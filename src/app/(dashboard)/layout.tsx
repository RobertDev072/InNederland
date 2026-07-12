import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/profile/queries";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  const isAdmin = profile.role === "admin";

  if (!isAdmin && profile.accessStatus === "blocked") {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/geblokkeerd");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex flex-1 flex-col">
        <MobileNav isAdmin={isAdmin} />
        <main className="flex-1 bg-navy-50/50 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
