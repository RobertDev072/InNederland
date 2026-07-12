import { ScrollText } from "lucide-react";
import { ComingSoon } from "../_components/coming-soon";

export default function AdminLogsPage() {
  return (
    <ComingSoon
      icon={ScrollText}
      title="Logs"
      description="Een audit-log van admin-acties (rol- en toegangswijzigingen, contentwijzigingen) komt hier terecht."
    />
  );
}
