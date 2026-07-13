import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountNav from "./nav";

export const metadata = { title: "My account" };

export default async function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  return (
    <div className="min-h-screen bg-[#f6faf9]">
      <header className="border-b border-[#e3edeb] bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="text-lg font-bold text-[#0A6B60]">
            🐾 PawPoints
          </Link>
          <AccountNav />
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-full border border-[#d8e2e0] px-4 py-1.5 text-sm font-semibold text-[#4A5A57] hover:bg-[#f0f5f4]"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
