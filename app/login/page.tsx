"use client";

import { loginUser } from "./actions";

export default function LoginPage() {
  async function handleSubmit(formData: FormData) {
    await loginUser(formData);
    // after login, redirect to profile (client-side)
    window.location.href = "/profile";
  }

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
