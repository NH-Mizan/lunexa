"use client";

import { apiRequest } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await apiRequest("/api/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pry">
          Settings
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Security controls</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          This account uses OTP authentication with a secure HTTP-only session cookie.
          Signing out clears the cookie and invalidates the backend token.
        </p>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Current session</h3>
            <p className="text-sm text-slate-500">
              Stored securely in a cookie, not in local storage.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
          >
            {isLoggingOut ? "Signing out..." : "Logout from this device"}
          </button>
        </div>
      </section>
    </div>
  );
}
