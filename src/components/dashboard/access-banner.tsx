import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

/** Shown on the dashboard for 'pending' users (free preview, not yet paid via WhatsApp). */
export async function AccessBanner() {
  const t = await getTranslations("Dashboard");

  return (
    <div className="flex flex-col items-start gap-3 rounded-card border border-orange-200 bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <Sparkles className="size-4.5" />
        </span>
        <p className="text-sm text-orange-900">{t("accessBannerText")}</p>
      </div>
      <Link
        href="/toegang"
        className="shrink-0 text-sm font-semibold text-orange-700 hover:underline"
      >
        {t("accessBannerCta")}
      </Link>
    </div>
  );
}
