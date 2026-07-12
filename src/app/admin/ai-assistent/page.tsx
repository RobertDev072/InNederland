import { Sparkles } from "lucide-react";
import { ComingSoon } from "../_components/coming-soon";

export default function AdminAiAssistentPage() {
  return (
    <ComingSoon
      icon={Sparkles}
      title="AI Assistent"
      description="Hier komt de configuratie voor de AI-examencoach die uitsluitend antwoordt op basis van jullie eigen lesmateriaal (RAG), zodra die fase gebouwd wordt."
    />
  );
}
