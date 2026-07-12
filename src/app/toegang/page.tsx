import { MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/layout/logo";
import { Card, CardContent } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default async function ToegangPage() {
  const t = await getTranslations("Toegang");
  const whatsappLink = buildWhatsAppLink(
    "Hoi, ik wil graag toegang tot InNederland.ai activeren.",
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-navy-50 px-4 py-12">
      <Logo priority />
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center gap-5 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
            <Sparkles className="size-7" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-navy-900">{t("title")}</h1>
            <p className="mt-2 text-navy-600">{t("body")}</p>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("primary", "lg", "w-full gap-2")}
          >
            <MessageCircle className="size-5" />
            {t("whatsappButton")}
          </a>

          <div className="flex items-center gap-2 text-xs text-navy-400">
            <ShieldCheck className="size-4" />
            {t("activationNote")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
