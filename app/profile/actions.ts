"use server";

import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";

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
    // handle uploaded file: convert to Buffer for Node upload
    try {
      const uploadedFile = foto as File & { name?: string };
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // determine extension from original filename or mime-type
      let ext = "jpg";
      if (uploadedFile.name && uploadedFile.name.includes(".")) {
        ext = uploadedFile.name.split('.').pop() || ext;
      } else if (uploadedFile.type) {
        const m = uploadedFile.type.split('/').pop();
        if (m) ext = m;
      }

      const filePath = `${userId}.${ext}`;

      const { data, error } = await supabaseAdmin.storage
        .from("photos")
        .upload(filePath, buffer, { upsert: true, contentType: uploadedFile.type });

      if (error) {
        console.error("Supabase storage upload error:", error);
        throw new Error(error.message);
      }

      fotoPath = data?.path ?? null;
    } catch (err: any) {
      console.error("Error uploading foto:", err);
      throw new Error(err?.message ?? String(err));
    }
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
    // redirect back with error
    const msg = encodeURIComponent(upsertError.message ?? "unknown error");
    redirect(`/profile?updated=0&error=${msg}`);
  }

  // redirect back to profile with a query param to indicate success
  redirect("/profile?updated=1");
}
