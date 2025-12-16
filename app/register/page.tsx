"use client";

import { registerUser } from "./actions";

export default function RegisterPage() {
  async function handleSubmit(formData: FormData) {
    await registerUser(formData);
  }

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}
