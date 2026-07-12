import Link from "next/link";
import { listUsers } from "@/lib/admin/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";

const STATUS_LABELS: Record<string, { label: string; variant: "success" | "neutral" | "outline" }> = {
  active: { label: "Actief", variant: "success" },
  pending: { label: "In afwachting", variant: "neutral" },
  blocked: { label: "Geblokkeerd", variant: "outline" },
};

export default async function AdminUsersPage() {
  const users = await listUsers();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Gebruikers</h1>
          <p className="text-navy-500">{users.length} accounts</p>
        </div>
        <LinkButton href="/admin/gebruikers/nieuw" size="sm">
          + Account aanmaken
        </LinkButton>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy-100 bg-navy-50/60 text-navy-500">
            <tr>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Naam</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Toegang</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {users.map((user) => {
              const status = STATUS_LABELS[user.accessStatus];
              return (
                <tr key={user.id}>
                  <td className="px-4 py-3 text-navy-800">{user.email}</td>
                  <td className="px-4 py-3 text-navy-600">{user.fullName ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === "admin" ? "orange" : "neutral"}>
                      {user.role === "admin" ? "Admin" : "Gebruiker"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/gebruikers/${user.id}`}
                      className="font-medium text-orange-600 hover:underline"
                    >
                      Beheren
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 ? (
          <CardContent>
            <p className="text-navy-500">Nog geen gebruikers.</p>
          </CardContent>
        ) : null}
      </Card>
    </div>
  );
}
