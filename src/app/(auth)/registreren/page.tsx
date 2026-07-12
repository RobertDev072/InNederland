"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { signUp, type AuthFormState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const initialState: AuthFormState = {};

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signUp, initialState);
  const t = useTranslations("Auth");

  return (
    <>
      <h1 className="text-xl font-bold text-navy-900">{t("registerTitle")}</h1>
      <p className="mt-1 text-sm text-navy-500">{t("registerSubtitle")}</p>

      <form action={action} className="mt-6 flex flex-col gap-4">
        <div>
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <p className="mt-1 text-xs text-navy-400">{t("passwordHint")}</p>
        </div>

        {state.error ? <p className="text-sm text-flag-red">{state.error}</p> : null}
        {state.message ? <p className="text-sm text-emerald-700">{state.message}</p> : null}

        <Button type="submit" loading={pending} className="mt-2 w-full">
          {t("registerButton")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-500">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-medium text-orange-600 hover:underline">
          {t("loginLink")}
        </Link>
      </p>
    </>
  );
}
