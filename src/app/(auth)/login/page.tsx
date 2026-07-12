"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthFormState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const initialState: AuthFormState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, initialState);

  return (
    <>
      <h1 className="text-xl font-bold text-navy-900">Welkom terug</h1>
      <p className="mt-1 text-sm text-navy-500">Log in om verder te gaan met je studieplan.</p>

      <form action={action} className="mt-6 flex flex-col gap-4">
        <div>
          <Label htmlFor="email">E-mailadres</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="password">Wachtwoord</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>

        {state.error ? <p className="text-sm text-flag-red">{state.error}</p> : null}

        <Button type="submit" loading={pending} className="mt-2 w-full">
          Inloggen
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-500">
        Nog geen account?{" "}
        <Link href="/registreren" className="font-medium text-orange-600 hover:underline">
          Registreer gratis
        </Link>
      </p>
    </>
  );
}
