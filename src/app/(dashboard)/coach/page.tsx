import { getCurrentProfile } from "@/lib/profile/queries";
import { Card, CardContent } from "@/components/ui/card";
import { CoachChat } from "./_components/coach-chat";

export default async function CoachPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] min-h-[32rem] max-w-3xl flex-col gap-4">
      <h1 className="text-2xl font-bold text-navy-900">AI-examencoach</h1>
      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
          <CoachChat nativeLanguage={profile?.nativeLanguage ?? null} />
        </CardContent>
      </Card>
    </div>
  );
}
