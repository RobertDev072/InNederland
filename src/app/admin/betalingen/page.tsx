import { CreditCard } from "lucide-react";
import { ComingSoon } from "../_components/coming-soon";

export default function AdminBetalingenPage() {
  return (
    <ComingSoon
      icon={CreditCard}
      title="Betalingen"
      description="Betalingen verlopen voorlopig handmatig via WhatsApp (zie /toegang). Een overzicht/logboek van WhatsApp-betalingen kan hier later aan toegevoegd worden."
    />
  );
}
