-- ═══════════════════════════════════════════════════════════════════════════
-- admin_approve_application.sql  (UNIFIED — 2026-09-15, supersedes both
-- earlier versions: the website branch's `app_id → text` one and the
-- same-day `p_application_id → jsonb` one that accidentally replaced it)
-- ═══════════════════════════════════════════════════════════════════════════
-- Two entry points call this, and both must keep working:
--   • pawpoints-web /api/applications/approve — the one-click Approve link in
--     the founder alert email (service role, param name `app_id`)
--   • the Supabase SQL editor — select admin_approve_application('<id>');
--     (no auth.uid(); the editor already has full DB access)
--   • an app admin session (is_app_admin()) would also be allowed.
--
-- What one call does, in one transaction:
--   1. merchants row: unique slug, 5-digit numeric store code, city/summary/
--      website/contact/show_contact carried over from the application,
--      status approved + is_active + approved_at
--   2. owner link in merchant_operators if an account exists for the
--      application email (case-insensitive) + trial merchant_subscriptions row
--   3. application marked approved + approved_at
--   4. best-effort POST to the send-store-code edge function (Resend) so the
--      merchant gets their store code by email. Email trouble NEVER fails the
--      approval; the code is in the return value too.
-- Re-approving an already-approved application is a no-op that returns the
-- existing cafe_id (the email link can be clicked twice safely).
--
-- Returns jsonb: { success, cafe_id, store_code, owner_linked, email_queued }
-- or { success, already_approved: true, cafe_id }.
--
-- NOT included on purpose: the redemption PIN (set separately, never emailed)
-- and address/lat/lng (added by hand when known).
-- STAGING keeps the placeholder secret (its email posts 401 harmlessly);
-- PRODUCTION gets the real WEBHOOK_SECRET pasted in before running.
-- ═══════════════════════════════════════════════════════════════════════════

-- Columns the website flow relies on (already on prod; idempotent elsewhere).
alter table merchant_applications add column if not exists approved_at timestamptz;
alter table merchant_applications add column if not exists notified_at timestamptz;

-- Drop first: earlier versions differ in param name / return type, which
-- create-or-replace refuses to change (42P13).
drop function if exists admin_approve_application(uuid);

create or replace function admin_approve_application(app_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_app      merchant_applications%rowtype;
  v_base     text;
  v_slug     text;
  v_n        integer := 1;
  v_code     text;
  v_uid      uuid;
  v_linked   boolean := false;
  v_existing text;
begin
  -- API callers must be admins. auth.uid() is null only outside PostgREST —
  -- the SQL editor or the service role (website route) — which already have
  -- full database access, so the check adds nothing there.
  if auth.uid() is not null and not is_app_admin() then
    raise exception 'Admins only';
  end if;

  select * into v_app from merchant_applications
   where id = app_id
   for update;
  if not found then
    raise exception 'Application % not found', app_id;
  end if;

  if v_app.status = 'approved' then
    select m.cafe_id into v_existing from merchants m
     where m.name = trim(v_app.business_name)
     order by m.created_at desc limit 1;
    return jsonb_build_object('success', true, 'already_approved', true,
                              'cafe_id', v_existing);
  end if;
  if v_app.status <> 'open' then
    raise exception 'Application is % — nothing to do', v_app.status;
  end if;

  -- Slug from the business name, suffixed until unique.
  v_base := trim(both '-' from
            regexp_replace(lower(trim(v_app.business_name)), '[^a-z0-9]+', '-', 'g'));
  if v_base = '' then v_base := 'merchant'; end if;
  v_slug := v_base;
  while exists (select 1 from merchants where cafe_id = v_slug) loop
    v_n := v_n + 1;
    v_slug := v_base || '-' || v_n::text;
  end loop;

  -- 5-digit numeric store code (founder decision 2026-09-15), unique.
  loop
    v_code := (floor(random() * 90000) + 10000)::int::text;
    exit when not exists (select 1 from merchants where user_code = v_code);
  end loop;

  insert into merchants (cafe_id, name, user_code, city, summary, website,
                         contact_name, contact_phone, show_contact,
                         status, is_active, approved_at)
  values (v_slug, trim(v_app.business_name), v_code, v_app.city,
          v_app.summary, v_app.website,
          v_app.contact_name, v_app.phone, coalesce(v_app.show_contact, false),
          'approved', true, now());

  -- Owner portal access + trial, if an account exists for the application email.
  if v_app.email is not null then
    select id into v_uid from auth.users
     where lower(email) = lower(trim(v_app.email))
     limit 1;
    if v_uid is not null then
      insert into merchant_operators (cafe_id, user_id, role, status)
      values (v_slug, v_uid, 'owner', 'active')
      on conflict (cafe_id, user_id) do update set role = 'owner', status = 'active';
      if to_regclass('public.merchant_subscriptions') is not null then
        insert into merchant_subscriptions (user_id) values (v_uid)
        on conflict do nothing;
      end if;
      v_linked := true;
    end if;
  end if;

  update merchant_applications
     set status = 'approved', approved_at = now()
   where id = app_id;

  -- Store-code email — best effort only.
  if v_app.email is not null then
    begin
      perform net.http_post(
        url     := 'https://ohvndmcybxvahjmmjujn.supabase.co/functions/v1/send-store-code',
        headers := jsonb_build_object(
                     'Content-Type',     'application/json',
                     'x-webhook-secret', 'PASTE_SECRET_HERE'
                   ),
        body    := jsonb_build_object(
                     'email',         v_app.email,
                     'business_name', trim(v_app.business_name),
                     'cafe_id',       v_slug,
                     'user_code',     v_code,
                     'has_account',   v_linked
                   )
      );
    exception when others then
      null;
    end;
  end if;

  return jsonb_build_object(
    'success',      true,
    'cafe_id',      v_slug,
    'store_code',   v_code,
    'owner_linked', v_linked,
    'email_queued', v_app.email is not null
  );
end $$;

revoke execute on function admin_approve_application(uuid) from public, anon;
grant  execute on function admin_approve_application(uuid) to authenticated, service_role;

notify pgrst, 'reload schema';

-- ─── VERIFY ──────────────────────────────────────────────────────────────────
-- select proname, pg_get_function_identity_arguments(oid), prorettype::regtype
--   from pg_proc where proname = 'admin_approve_application';
--   -- expect: admin_approve_application | app_id uuid | jsonb
