import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { LinkButton } from "@/components/ui/button";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo priority />
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-navy-700 hover:text-navy-900 sm:inline"
            >
              Inloggen
            </Link>
            <LinkButton href="/registreren" size="sm" className="sm:h-10">
              Gratis starten
            </LinkButton>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-navy-100 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-sm text-navy-500 sm:px-6">
          <Logo />
          <p>Jouw weg naar een nieuwe toekomst.</p>
          <p className="text-xs text-navy-400">
            Eigen oefenmateriaal — geen officiële examenvragen, geen garantie op slagen.
          </p>
        </div>
      </footer>
    </div>
  );
}
