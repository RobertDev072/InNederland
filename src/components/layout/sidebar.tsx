"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BookOpenText,
  Ear,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  Mic,
  MessageCircleQuestion,
  PenLine,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { signOut } from "@/lib/auth/actions";

export const NAV_ITEM_DEFS = [
  { href: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { href: "/spreken", icon: Mic, key: "spreken" },
  { href: "/luisteren", icon: Ear, key: "luisteren" },
  { href: "/lezen", icon: BookOpenText, key: "lezen" },
  { href: "/schrijven", icon: PenLine, key: "schrijven" },
  { href: "/knm", icon: Landmark, key: "knm" },
  { href: "/proefexamen", icon: GraduationCap, key: "proefexamen" },
  { href: "/coach", icon: MessageCircleQuestion, key: "coach" },
] as const;

export function Sidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const navItems = NAV_ITEM_DEFS.map((item) => ({ ...item, label: t(item.key) }));

  return (
    <aside className="hidden h-full w-64 flex-col border-r border-navy-100 bg-white md:flex">
      <div className="flex h-16 items-center border-b border-navy-100 px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
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
        {isAdmin ? (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith("/admin")
                ? "bg-orange-50 text-orange-700"
                : "text-navy-600 hover:bg-navy-50 hover:text-navy-900",
            )}
          >
            <ShieldCheck className="size-4.5 shrink-0" />
            {t("admin")}
          </Link>
        ) : null}
      </nav>
      <div className="border-t border-navy-100 p-3">
        <LanguageSwitcher className="mb-2 w-full text-sm" />
        <form action={signOut}>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-navy-500 hover:bg-navy-50 hover:text-navy-800"
          >
            {tCommon("signOut")}
          </button>
        </form>
      </div>
    </aside>
  );
}
