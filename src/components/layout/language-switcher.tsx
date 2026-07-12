"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { setUserLocale } from "@/i18n/actions";
import { LOCALES, LOCALE_LABELS, LOCALE_FLAGS } from "@/i18n/locales";
import { Select } from "@/components/ui/select";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    startTransition(async () => {
      await setUserLocale(next);
      router.refresh();
    });
  }

  return (
    <Select
      aria-label="Taal"
      value={locale}
      onChange={handleChange}
      disabled={isPending}
      className={className ?? "w-auto text-sm"}
    >
      {LOCALES.map((code) => (
        <option key={code} value={code}>
          {LOCALE_FLAGS[code]} {LOCALE_LABELS[code]}
        </option>
      ))}
    </Select>
  );
}
