import Link from "next/link";
import { requireAdmin } from "@/lib/admin/guard";
import { Logo } from "@/components/layout/logo";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { signOut } from "@/lib/auth/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <div className="flex h-14 items-center justify-between border-b border-navy-100 bg-white px-4 md:hidden">
          <Logo />
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-medium text-navy-500">
              Dashboard
            </Link>
            <form action={signOut}>
              <button type="submit" className="text-sm font-medium text-navy-500">
                Uitloggen
              </button>
            </form>
          </div>
        </div>
        <main className="flex-1 bg-navy-50/50 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
