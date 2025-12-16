import { saveProfile } from "./actions";

export default function ProfilePage() {
  return (
    <form action={saveProfile} encType="multipart/form-data">
      <input name="userId" type="hidden" />
      <input name="nama" placeholder="Nama" />
      <input name="alamat" placeholder="Alamat" />
      <input name="no_ktp" placeholder="No KTP" />
      <input name="foto" type="file" />
      <button type="submit">Simpan</button>
    </form>
  );
}
