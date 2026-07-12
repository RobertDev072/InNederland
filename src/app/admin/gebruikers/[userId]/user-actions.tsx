"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteUserAccount,
  resetUserPassword,
  setAccessStatus,
  setUserLevel,
  setUserRole,
  type ResetPasswordResult,
} from "@/lib/admin/actions";
import type { AdminUserRow } from "@/lib/admin/queries";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { AccessStatus, UserRole } from "@/types/database";
import { LEVEL_CODES, LEVEL_LABELS, type LevelCode } from "@/types/content";

const resetInitialState: ResetPasswordResult = {};

export function UserActions({ user }: { user: AdminUserRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const boundResetPassword = resetUserPassword.bind(null, user.id);
  const [resetState, resetAction, resetPending] = useActionState(boundResetPassword, resetInitialState);

  function changeAccessStatus(status: AccessStatus) {
    startTransition(async () => {
      await setAccessStatus(user.id, status);
      router.refresh();
    });
  }

  function changeRole(role: UserRole) {
    startTransition(async () => {
      await setUserRole(user.id, role);
      router.refresh();
    });
  }

  function changeLevel(level: LevelCode) {
    startTransition(async () => {
      await setUserLevel(user.id, level);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm(`Weet je zeker dat je ${user.email} wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`)) {
      return;
    }
    startTransition(async () => {
      await deleteUserAccount(user.id);
      router.push("/admin");
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium text-navy-700">Toegangsstatus</p>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={user.accessStatus === "active" ? "primary" : "outline"}
            disabled={isPending}
            onClick={() => changeAccessStatus("active")}
          >
            Activeren
          </Button>
          <Button
            size="sm"
            variant={user.accessStatus === "pending" ? "secondary" : "outline"}
            disabled={isPending}
            onClick={() => changeAccessStatus("pending")}
          >
            Op wachtlijst zetten
          </Button>
          <Button
            size="sm"
            variant={user.accessStatus === "blocked" ? "danger" : "outline"}
            disabled={isPending}
            onClick={() => changeAccessStatus("blocked")}
          >
            Blokkeren
          </Button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-navy-700">Rol</p>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={user.role === "user" ? "secondary" : "outline"}
            disabled={isPending}
            onClick={() => changeRole("user")}
          >
            Gebruiker
          </Button>
          <Button
            size="sm"
            variant={user.role === "admin" ? "primary" : "outline"}
            disabled={isPending}
            onClick={() => changeRole("admin")}
          >
            Admin
          </Button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-navy-700">Niveau / module</p>
        <Select
          className="max-w-xs"
          value={(user.targetLevel ?? "") as LevelCode | ""}
          disabled={isPending}
          onChange={(event) => changeLevel(event.target.value as LevelCode)}
        >
          <option value="" disabled>
            Kies een niveau…
          </option>
          {LEVEL_CODES.map((level) => (
            <option key={level} value={level}>
              {LEVEL_LABELS[level]}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-navy-700">Wachtwoord resetten</p>
        <form action={resetAction} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="password">Nieuw wachtwoord</Label>
            <Input id="password" name="password" type="text" minLength={8} required />
          </div>
          <Button type="submit" size="sm" variant="outline" loading={resetPending}>
            Resetten
          </Button>
        </form>
        {resetState.error ? <p className="mt-2 text-sm text-flag-red">{resetState.error}</p> : null}
        {resetState.success ? (
          <p className="mt-2 text-sm text-emerald-700">
            Wachtwoord gewijzigd — geef het nieuwe wachtwoord handmatig door aan de gebruiker.
          </p>
        ) : null}
      </div>

      <div className="border-t border-navy-100 pt-4">
        <Button size="sm" variant="danger" disabled={isPending} onClick={handleDelete}>
          Account verwijderen
        </Button>
      </div>
    </div>
  );
}
