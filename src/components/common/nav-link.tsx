"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
};

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        isActive ? "bg-ink text-paper" : "bg-white/70 text-ink hover:bg-white"
      }`}
      href={href}
    >
      {children}
    </Link>
  );
}
