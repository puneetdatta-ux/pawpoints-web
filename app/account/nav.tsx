"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/account", label: "Profile" },
  { href: "/account/photos", label: "Photos" },
  { href: "/account/friends", label: "Friends" },
  { href: "/account/rewards", label: "Rewards" },
];

export default function AccountNav({ merchant = false }: { merchant?: boolean }) {
  const pathname = usePathname();
  // Owners get one extra tab into the merchant portal (own layout, so it
  // never reads as "active" here — it's a doorway, styled to stand out).
  const links = merchant
    ? [...LINKS, { href: "/merchant", label: "🏪 Merchant portal" }]
    : LINKS;
  return (
    <nav className="flex gap-1 overflow-x-auto">
      {links.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={
              "rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap " +
              (active
                ? "bg-[#16B8A6] text-white"
                : "text-[#4A5A57] hover:bg-[#e8f4f2] hover:text-[#0A6B60]")
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
