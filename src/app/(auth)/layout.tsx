import { Logo } from "@/components/layout/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-navy-50 px-4 py-12">
      <Logo priority />
      <div className="w-full max-w-md rounded-card border border-navy-100 bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
