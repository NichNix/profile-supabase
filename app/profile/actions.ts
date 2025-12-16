"use server";

import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export async function saveProfile(formData: FormData) {
  const nama = formData.get("nama") as string;
  const alamat = formData.get("alamat") as string;
  const no_ktp = formData.get("no_ktp") as string;
  const foto = formData.get("foto") as File;

  const cookieStore = await cookies();
  const cookieUserId = cookieStore.get("sb-user-id")?.value;
  const formUserId = (formData.get("userId") as string) || null;
  const userId = formUserId ?? cookieUserId;

  if (!userId) throw new Error("User not authenticated");

  let fotoPath: string | null = null;

  if (foto && (foto as File).size > 0) {
    // note: on server actions, File is readable
    const { data, error } = await supabaseAdmin.storage
      .from("photos")
      .upload(`${userId}.jpg`, foto, { upsert: true });

    if (error) throw new Error(error.message);

    fotoPath = data?.path ?? null;
  }

  const { error: upsertError } = await supabaseAdmin.from("profiles").upsert({
    id: userId,
    nama,
    alamat,
    no_ktp,
    foto_url: fotoPath,
  });

  if (upsertError) throw new Error(upsertError.message);
}
