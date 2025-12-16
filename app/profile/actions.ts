"use server";

import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function saveProfile(formData: FormData) {
  const nama = formData.get("nama") as string;
  const alamat = formData.get("alamat") as string;
  const no_ktp = formData.get("no_ktp") as string;
  const foto = formData.get("foto") as File | null;

  const cookieStore = await cookies();
  const cookieUserId = cookieStore.get("sb-user-id")?.value;
  const formUserId = (formData.get("userId") as string) || null;
  const userId = formUserId ?? cookieUserId;

  if (!userId) throw new Error("User not authenticated");

  const { data: existingProfiles } = await supabaseAdmin
    .from("profiles")
    .select("foto_url")
    .eq("id", userId)
    .limit(1);

  const existingFotoUrl = existingProfiles?.[0]?.foto_url ?? null;

  let fotoPath: string | null = null;

  if (foto && foto.size > 0 && foto.name) {
    try {
      const uploadedFile = foto as File & { name?: string };
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      let ext = "jpg";
      if (uploadedFile.name && uploadedFile.name.includes(".")) {
        ext = uploadedFile.name.split('.').pop() || ext;
      } else if (uploadedFile.type) {
        const m = uploadedFile.type.split('/').pop();
        if (m) ext = m;
      }

      const filePath = `${userId}-${Date.now()}.${ext}`;

      const { data, error } = await supabaseAdmin.storage
        .from("photos")
        .upload(filePath, buffer, { upsert: true, contentType: uploadedFile.type });

      if (error) {
        console.error("Supabase storage upload error:", error);
        throw new Error(`Failed to upload foto: ${error.message}`);
      }

      fotoPath = data?.path ?? null;
      console.log("Foto uploaded successfully:", filePath, "Path:", fotoPath);
    } catch (err: any) {
      console.error("Error uploading foto:", err);
      throw new Error(`Gagal upload foto: ${err?.message ?? String(err)}`);
    }
  } else {
    fotoPath = existingFotoUrl;
    console.log("No new foto selected, using existing:", fotoPath);
  }

  const { error: upsertError } = await supabaseAdmin.from("profiles").upsert({
    id: userId,
    nama,
    alamat,
    no_ktp,
    foto_url: fotoPath,
  });
  if (upsertError) {
    console.error("Error upserting profile:", upsertError);
    const msg = encodeURIComponent(upsertError.message ?? "unknown error");
    redirect(`/profile?updated=0&error=${msg}`);
  }

  redirect("/profile?updated=1");
}
