"use client";

import { useActionState } from "react";
import { createUserAccount, type CreateUserResult } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { LEVEL_CODES, LEVEL_LABELS } from "@/types/content";

const initialState: CreateUserResult = {};

export default function CreateUserPage() {
  const [state, action, pending] = useActionState(createUserAccount, initialState);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Account aanmaken</h1>
      <Card>
        <CardContent>
          <form action={action} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">E-mailadres</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="password">Tijdelijk wachtwoord</Label>
              <Input id="password" name="password" type="text" minLength={8} required />
            </div>
            <div>
              <Label htmlFor="full_name">Naam (optioneel)</Label>
              <Input id="full_name" name="full_name" type="text" />
            </div>
            <div>
              <Label htmlFor="native_language">Moedertaal (optioneel)</Label>
              <Input id="native_language" name="native_language" type="text" placeholder="Bijv. Engels, Arabisch, Pools…" />
            </div>
            <div>
              <Label htmlFor="target_level">Niveau / module</Label>
              <Select id="target_level" name="target_level" defaultValue="A2" required>
                {LEVEL_CODES.map((level) => (
                  <option key={level} value={level}>
                    {LEVEL_LABELS[level]}
                  </option>
                ))}
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm text-navy-700">
              <input type="checkbox" name="activate_immediately" className="size-4 rounded border-navy-300" />
              Meteen volledige toegang geven (betaling al ontvangen)
            </label>

            {state.error ? <p className="text-sm text-flag-red">{state.error}</p> : null}

            <Button type="submit" loading={pending} className="mt-2 w-full">
              Account aanmaken
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
