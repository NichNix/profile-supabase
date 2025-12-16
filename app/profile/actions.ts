"use server";

import { supabase } from "@/lib/supabase";

export async function saveProfile(formData: FormData) {
  const nama = formData.get("nama") as string;
  const alamat = formData.get("alamat") as string;
  const no_ktp = formData.get("no_ktp") as string;
  const foto = formData.get("foto") as File;

  // contoh userId hardcode dulu (biar build aman)
  const userId = "dummy-user-id";

  let fotoPath = null;

  if (foto && foto.size > 0) {
    const { data } = await supabase.storage
      .from("photos")
      .upload(`${userId}.jpg`, foto, { upsert: true });

    fotoPath = data?.path;
  }

  await supabase.from("profiles").upsert({
    id: userId,
    nama,
    alamat,
    no_ktp,
    foto_url: fotoPath,
  });
}
