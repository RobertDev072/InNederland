"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadLessonImage } from "@/lib/storage/upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input";

export function ImageUploadField({
  label = "Afbeelding (optioneel)",
  name,
  defaultValue,
}: {
  label?: string;
  name: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadLessonImage(file);
      setUrl(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Uploaden is mislukt.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <Label>{label}</Label>
      {/* Hidden field carries the resulting public URL into the surrounding form submission. */}
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="text-sm text-navy-600"
        />
        {uploading ? <span className="text-sm text-navy-400">Uploaden…</span> : null}
        {url ? (
          <Button type="button" size="sm" variant="ghost" onClick={() => setUrl("")}>
            Verwijderen
          </Button>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-sm text-flag-red">{error}</p> : null}
      {url ? (
        <Image
          src={url}
          alt="Voorbeeld"
          width={320}
          height={180}
          className="mt-2 h-32 w-auto rounded-lg border border-navy-100 object-cover"
          unoptimized
        />
      ) : null}
    </div>
  );
}
