"use server";

import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  (await cookies()).set("sb-access-token", data.session.access_token);

  return data.user;
}
