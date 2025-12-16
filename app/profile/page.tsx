import { saveProfile } from "./actions";
import { logoutUser } from "./logout";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("sb-user-id")?.value;

  if (!userId) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8 text-center">
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">User not authenticated</p>
          <a href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Login
          </a>
        </div>
      </div>
    );
  }

  // fetch profile server-side
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, nama, alamat, no_ktp, foto_url")
    .eq("id", userId)
    .limit(1);

  const profile = profiles && profiles.length > 0 ? profiles[0] : null;

  async function handleLogout() {
    "use server";
    await logoutUser();
    // Note: In production, you might want to use redirect() from next/navigation
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Profil Saya</h1>
          <form action={async () => {
            "use server";
            await logoutUser();
          }}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Logout
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
          <form action={saveProfile} encType="multipart/form-data" className="space-y-6">
            <input name="userId" type="hidden" value={userId} />

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Nama
              </label>
              <input
                type="text"
                name="nama"
                placeholder="Masukkan nama lengkap"
                defaultValue={profile?.nama ?? ""}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Alamat
              </label>
              <textarea
                name="alamat"
                placeholder="Masukkan alamat lengkap"
                defaultValue={profile?.alamat ?? ""}
                rows={3}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                No KTP
              </label>
              <input
                type="text"
                name="no_ktp"
                placeholder="Masukkan nomor KTP"
                defaultValue={profile?.no_ktp ?? ""}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Foto Profil
              </label>
              <input
                type="file"
                name="foto"
                accept="image/*"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {profile?.foto_url && (
              <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">Foto Saat Ini</p>
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${profile.foto_url}`}
                  alt="Foto profil"
                  className="w-48 h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mt-8"
            >
              Simpan Profil
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
