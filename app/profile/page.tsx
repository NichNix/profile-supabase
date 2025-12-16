import { saveProfile } from "./actions";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("sb-user-id")?.value;

  if (!userId) {
    return (
      <div>
        <p>User not authenticated. Please <a href="/login">login</a>.</p>
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

  return (
    <form action={saveProfile} encType="multipart/form-data">
      <input name="userId" type="hidden" value={userId} />
      <input name="nama" placeholder="Nama" defaultValue={profile?.nama ?? ""} />
      <input name="alamat" placeholder="Alamat" defaultValue={profile?.alamat ?? ""} />
      <input name="no_ktp" placeholder="No KTP" defaultValue={profile?.no_ktp ?? ""} />
      <input name="foto" type="file" />
      <button type="submit">Simpan</button>
      {profile?.foto_url ? (
        <div>
          <p>Foto saat ini:</p>
          <img
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${profile.foto_url}`}
            alt="foto"
            style={{ width: 200 }}
          />
        </div>
      ) : null}
    </form>
  );
}
