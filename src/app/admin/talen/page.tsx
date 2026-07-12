import { Languages } from "lucide-react";
import { ComingSoon } from "../_components/coming-soon";

export default function AdminTalenPage() {
  return (
    <ComingSoon
      icon={Languages}
      title="Talen"
      description="Beheer voor interface-vertalingen (NL, EN, PT, ES, AR, ZH) komt hier zodra de i18n-uitrol wordt opgepakt."
    />
  );
}
