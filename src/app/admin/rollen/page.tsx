import Link from "next/link";
import { listUsers } from "@/lib/admin/queries";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminRolesPage() {
  const users = await listUsers();
  const admins = users.filter((user) => user.role === "admin");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Rollen &amp; Rechten</h1>
        <p className="text-navy-500">
          {admins.length} van {users.length} accounts hebben adminrechten.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3">
          <CardTitle className="text-base">Admins</CardTitle>
          <CardDescription>
            Admins hebben volledige toegang tot alle niveaus en het admin-paneel, en omzeilen de
            betaal-gate. Rol wijzigen doe je via de detailpagina van een gebruiker.
          </CardDescription>
          {admins.length === 0 ? (
            <p className="text-sm text-navy-500">Geen admins gevonden.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-navy-100">
              {admins.map((admin) => (
                <li key={admin.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium text-navy-800">{admin.email}</p>
                    <p className="text-xs text-navy-400">{admin.fullName ?? "Geen naam"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="orange">Admin</Badge>
                    <Link
                      href={`/admin/gebruikers/${admin.id}`}
                      className="text-sm font-medium text-orange-600 hover:underline"
                    >
                      Beheren
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <CardTitle className="mb-1 text-base">Alle gebruikers</CardTitle>
          <CardDescription>
            Ga naar <Link href="/admin/gebruikers" className="text-orange-600 hover:underline">Gebruikers</Link>{" "}
            om de rol van een specifiek account te wijzigen.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
