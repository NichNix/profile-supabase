"use server";

import { supabaseAdmin } from "@/lib/supabase";

export type RegisterResult = {
  success: boolean;
  user?: any;
  error?: string;
};

export async function registerUser(formData: FormData): Promise<RegisterResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const msg = "Server misconfiguration: missing SUPABASE_SERVICE_ROLE_KEY";
    console.error(msg);
    return { success: false, error: msg };
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      console.error("Supabase createUser error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (err: any) {
    console.error("Unexpected error in registerUser:", err);
    return { success: false, error: err?.message ?? String(err) };
  }
}
