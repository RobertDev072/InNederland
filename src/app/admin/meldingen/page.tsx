import { Bell } from "lucide-react";
import { ComingSoon } from "../_components/coming-soon";

export default function AdminMeldingenPage() {
  return (
    <ComingSoon
      icon={Bell}
      title="Meldingen"
      description="Systeemmeldingen (nieuwe registraties, betaalverzoeken via /toegang, geblokkeerde accounts) komen hier terecht."
    />
  );
}
