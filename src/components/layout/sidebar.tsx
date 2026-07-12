"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  Ear,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  Mic,
  MessageCircleQuestion,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { signOut } from "@/lib/auth/actions";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/spreken", label: "Spreken", icon: Mic },
  { href: "/luisteren", label: "Luisteren", icon: Ear },
  { href: "/lezen", label: "Lezen", icon: BookOpenText },
  { href: "/schrijven", label: "Schrijven", icon: PenLine },
  { href: "/knm", label: "KNM", icon: Landmark },
  { href: "/proefexamen", label: "Proefexamen", icon: GraduationCap },
  { href: "/coach", label: "AI-coach", icon: MessageCircleQuestion },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-64 flex-col border-r border-navy-100 bg-white md:flex">
      <div className="flex h-16 items-center border-b border-navy-100 px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-orange-50 text-orange-700"
                  : "text-navy-600 hover:bg-navy-50 hover:text-navy-900",
              )}
            >
              <Icon className="size-4.5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <form action={signOut} className="border-t border-navy-100 p-3">
        <button
          type="submit"
          className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-navy-500 hover:bg-navy-50 hover:text-navy-800"
        >
          Uitloggen
        </button>
      </form>
    </aside>
  );
}
