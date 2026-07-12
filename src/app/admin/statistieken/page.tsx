import { BarChart3 } from "lucide-react";
import { ComingSoon } from "../_components/coming-soon";

export default function AdminStatistiekenPage() {
  return (
    <ComingSoon
      icon={BarChart3}
      title="Statistieken"
      description="Uitgebreide voortgangs- en gebruiksstatistieken (per module, per gebruiker, examengereedheid) — de basiscijfers staan al op het Dashboard."
    />
  );
}
