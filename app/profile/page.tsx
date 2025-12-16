import { saveProfile } from "./actions";

export default function ProfilePage() {
  return (
    <form action={saveProfile}>
      <input name="userId" type="hidden" value="USER_ID_DARI_SESSION" />
      <input name="nama" placeholder="Nama" />
      <input name="alamat" placeholder="Alamat" />
      <input name="no_ktp" placeholder="No KTP" />
      <input name="foto" type="file" />
      <button type="submit">Save</button>
    </form>
  );
}
