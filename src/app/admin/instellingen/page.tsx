import { Settings } from "lucide-react";
import { ComingSoon } from "../_components/coming-soon";

export default function AdminInstellingenPage() {
  return (
    <ComingSoon
      icon={Settings}
      title="Instellingen"
      description="Algemene platforminstellingen (bijv. WhatsApp-nummer, standaardniveau voor nieuwe accounts) komen hier terecht."
    />
  );
}
