"use client";

import { createClient } from "@/lib/supabase/client";

/** Uploads an admin-picked image to the public lesson-media bucket and returns its public URL. */
export async function uploadLessonImage(file: File): Promise<string> {
  const supabase = createClient();
  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from("lesson-media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(`Uploaden is mislukt: ${error.message}`);
  }

  const { data } = supabase.storage.from("lesson-media").getPublicUrl(path);
  return data.publicUrl;
}
