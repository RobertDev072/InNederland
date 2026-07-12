"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { signIn, type AuthFormState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const initialState: AuthFormState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, initialState);
  const t = useTranslations("Auth");

  return (
    <>
      <h1 className="text-xl font-bold text-navy-900">{t("loginTitle")}</h1>
      <p className="mt-1 text-sm text-navy-500">{t("loginSubtitle")}</p>

      <form action={action} className="mt-6 flex flex-col gap-4">
        <div>
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>

        {state.error ? <p className="text-sm text-flag-red">{state.error}</p> : null}

        <Button type="submit" loading={pending} className="mt-2 w-full">
          {t("loginButton")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-500">
        {t("noAccount")}{" "}
        <Link href="/registreren" className="font-medium text-orange-600 hover:underline">
          {t("registerLink")}
        </Link>
      </p>
    </>
  );
}
