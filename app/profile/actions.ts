"use server";

import { supabase } from "@/lib/supabase";

export async function saveProfile(formData: FormData) {
  const userId = formData.get("userId") as string;
  const nama = formData.get("nama") as string;
  const alamat = formData.get("alamat") as string;
  const no_ktp = formData.get("no_ktp") as string;
  const foto = formData.get("foto") as File;

  let fotoUrl = null;

  if (foto && foto.size > 0) {
    const { data } = await supabase.storage
      .from("photos")
      .upload(`${userId}.jpg`, foto, { upsert: true });

    fotoUrl = data?.path;
  }

  await supabase.from("profiles").upsert({
    id: userId,
    nama,
    alamat,
    no_ktp,
    foto_url: fotoUrl,
  });
}
