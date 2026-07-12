import { notFound } from "next/navigation";
import { getUserDetail } from "@/lib/admin/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserActions } from "./user-actions";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getUserDetail(userId);

  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">{user.email}</h1>
        <p className="text-navy-500">
          {user.fullName ?? "Geen naam ingesteld"} · aangemaakt op{" "}
          {new Date(user.createdAt).toLocaleDateString("nl-NL")}
        </p>
        <div className="mt-2 flex gap-2">
          <Badge variant={user.role === "admin" ? "orange" : "neutral"}>
            {user.role === "admin" ? "Admin" : "Gebruiker"}
          </Badge>
          <Badge
            variant={
              user.accessStatus === "active"
                ? "success"
                : user.accessStatus === "blocked"
                  ? "outline"
                  : "neutral"
            }
          >
            {user.accessStatus === "active"
              ? "Actief"
              : user.accessStatus === "blocked"
                ? "Geblokkeerd"
                : "In afwachting"}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Beheeracties</CardTitle>
        </CardHeader>
        <CardContent>
          <UserActions user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
