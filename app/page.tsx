export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <main className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Selamat Datang
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
          Aplikasi untuk mengelola profil diri Anda dengan data lengkap termasuk foto.
        </p>
        <div className="flex gap-4 flex-col sm:flex-row">
          <a
            href="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Registrasi
          </a>
          <a
            href="/login"
            className="px-6 py-3 bg-zinc-300 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 rounded-lg font-semibold hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-colors"
          >
            Login
          </a>
        </div>
      </main>
    </div>
  );
}
