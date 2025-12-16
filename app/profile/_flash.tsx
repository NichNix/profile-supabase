"use client";

import { useEffect, useState } from "react";

export default function ClientFlash() {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const updated = params.get("updated");
    const error = params.get("error");

    if (updated === "1") {
      setMessage("Profil berhasil disimpan");
      setType("success");
      params.delete("updated");
      const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
      window.history.replaceState({}, "", newUrl);
    } else if (updated === "0") {
      setMessage(error ? decodeURIComponent(error) : "Gagal menyimpan profil");
      setType("error");
      params.delete("updated");
      params.delete("error");
      const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  if (!message) return null;

  return (
    <div className={`mb-6 p-4 rounded-lg ${type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
      {message}
    </div>
  );
}
