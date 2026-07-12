import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/layout/logo";
import { LinkButton } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("Marketing");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo priority />
          <nav className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher className="w-auto text-xs sm:text-sm" />
            <Link
              href="/login"
              className="hidden text-sm font-medium text-navy-700 hover:text-navy-900 sm:inline"
            >
              {t("login")}
            </Link>
            <LinkButton href="/registreren" size="sm" className="sm:h-10">
              {t("startFree")}
            </LinkButton>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-navy-100 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-sm text-navy-500 sm:px-6">
          <Logo />
          <p>{t("footerTagline")}</p>
          <p className="text-xs text-navy-400">{t("disclaimer")}</p>
        </div>
      </footer>
    </div>
  );
}
