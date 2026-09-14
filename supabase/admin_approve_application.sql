-- One-click merchant go-live, called by /api/applications/approve (service
-- role only). Creates the live merchants row from the application, links the
-- owner's account, starts the two-month trial, and marks the application
-- approved — all in one transaction. Run this once in the SQL Editor.

create or replace function public.admin_approve_application(app_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_app merchant_applications%rowtype;
  v_user_id uuid;
  v_slug text;
  v_code text;
  v_initials text;
begin
  select * into v_app from merchant_applications where id = app_id for update;
  if not found then
    raise exception 'application not found';
  end if;
  if v_app.status = 'approved' then
    return (select cafe_id from merchants where name = v_app.business_name limit 1);
  end if;

  select id into v_user_id from auth.users where email = v_app.email;

  -- cafe_id: slug of the business name, suffixed if taken (tax-professionals)
  v_slug := trim(both '-' from regexp_replace(lower(v_app.business_name), '[^a-z0-9]+', '-', 'g'));
  if exists (select 1 from merchants where cafe_id = v_slug) then
    v_slug := v_slug || '-' || substr(md5(random()::text), 1, 4);
  end if;

  -- user_code: initials + random block (TP-R8V2NQ)
  v_initials := upper(left(regexp_replace(v_app.business_name, '(\w)\w*\s*', '\1', 'g'), 3));
  v_code := v_initials || '-' || upper(substr(md5(random()::text), 1, 6));

  insert into merchants
    (cafe_id, name, user_code, status, approved_at, is_active, city, summary,
     website, contact_name, contact_phone, show_contact)
  values
    (v_slug, v_app.business_name, v_code, 'approved', now(), true, v_app.city,
     v_app.summary, v_app.website, v_app.contact_name, v_app.phone, v_app.show_contact);

  if v_user_id is not null then
    insert into merchant_operators (cafe_id, user_id, role, status)
    values (v_slug, v_user_id, 'owner', 'active');
    insert into merchant_subscriptions (user_id) values (v_user_id);
  end if;

  update merchant_applications
  set status = 'approved', approved_at = now()
  where id = app_id;

  return v_slug;
end;
$$;

-- Only the service role (the website's server routes) may call this.
revoke execute on function public.admin_approve_application(uuid) from public, anon, authenticated;
grant execute on function public.admin_approve_application(uuid) to service_role;
