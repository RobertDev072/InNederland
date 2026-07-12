"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpenText,
  CreditCard,
  Database,
  FileText,
  GraduationCap,
  Languages,
  LayoutDashboard,
  Layers,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { signOut } from "@/lib/auth/actions";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  external?: boolean;
  soon?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overzicht",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Gebruikers",
    items: [
      { href: "/admin/gebruikers", label: "Gebruikers", icon: Users },
      { href: "/admin/gebruikers/nieuw", label: "Account aanmaken", icon: UserPlus },
      { href: "/admin/rollen", label: "Rollen & Rechten", icon: ShieldCheck },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/modules", label: "Modules & Niveaus", icon: Layers },
      { href: "/admin/lessen", label: "Lessen & Oefeningen", icon: BookOpenText },
      { href: "/admin/examens", label: "Examens", icon: GraduationCap },
      { href: "/admin/knm", label: "KNM", icon: FileText },
    ],
  },
  {
    title: "Platform",
    items: [
      { href: "/admin/ai-assistent", label: "AI Assistent", icon: Sparkles, soon: true },
      { href: "/admin/statistieken", label: "Statistieken", icon: BarChart3, soon: true },
      { href: "/admin/betalingen", label: "Betalingen", icon: CreditCard, soon: true },
      { href: "/admin/talen", label: "Talen", icon: Languages, soon: true },
      { href: "/admin/meldingen", label: "Meldingen", icon: Bell, soon: true },
      { href: "/admin/logs", label: "Logs", icon: ScrollText, soon: true },
      { href: "/admin/instellingen", label: "Instellingen", icon: Settings, soon: true },
      {
        href: "https://supabase.com/dashboard",
        label: "Databasebeheer",
        icon: Database,
        external: true,
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col border-r border-navy-100 bg-white md:flex">
      <div className="flex h-16 items-center border-b border-navy-100 px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-navy-400">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map(({ href, label, icon: Icon, external, soon }) => {
                const active = !external && (pathname === href || pathname.startsWith(`${href}/`));
                if (external) {
                  return (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-navy-600 hover:bg-navy-50"
                    >
                      <Icon className="size-4 shrink-0" />
                      {label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-orange-50 text-orange-700"
                        : "text-navy-600 hover:bg-navy-50 hover:text-navy-900",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="flex-1">{label}</span>
                    {soon ? (
                      <span className="rounded-full bg-navy-100 px-1.5 py-0.5 text-[10px] font-semibold text-navy-500">
                        binnenkort
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        <Link
          href="/dashboard"
          className="block rounded-lg px-3 py-2 text-sm font-medium text-navy-400 hover:bg-navy-50"
        >
          ← Terug naar dashboard
        </Link>
      </nav>
      <form action={signOut} className="border-t border-navy-100 p-3">
        <button
          type="submit"
          className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-navy-500 hover:bg-navy-50"
        >
          Uitloggen
        </button>
      </form>
    </aside>
  );
}
