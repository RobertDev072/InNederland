import Image from "next/image";
import Link from "next/link";

export function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" className={className} aria-label="InNederland.ai — home">
      <Image
        src="/logo/logo.png"
        alt="InNederland.ai"
        width={3840}
        height={976}
        priority={priority}
        className="h-8 w-auto sm:h-9"
      />
    </Link>
  );
}
