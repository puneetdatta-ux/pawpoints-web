"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/account", label: "Profile" },
  { href: "/account/photos", label: "Photos" },
  { href: "/account/friends", label: "Friends" },
  { href: "/account/rewards", label: "Rewards" },
];

export default function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto">
      {LINKS.map(({ href, label }) => {
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
