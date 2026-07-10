"use client";

import { useAuthSession } from "@/components/Auth/AuthSessionProvider";
import { apiRequest } from "@/lib/auth-client";
import { getAssetUrl } from "@/lib/asset-url";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaBars,
  FaBell,
  FaCog,
  FaHome,
  FaShoppingCart,
  FaTachometerAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: FaTachometerAlt },
  { href: "/dashboard/profile", label: "Profile", icon: FaUser },
  { href: "/dashboard/orders", label: "Orders", icon: FaShoppingCart },
  { href: "/dashboard/settings", label: "Settings", icon: FaCog },
];

export default function DashboardShell({ user, children }) {
  const sessionUser = useAuthSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const currentUser = sessionUser || user;

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
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)] print:min-h-0 print:bg-white">
      <div className="mx-auto flex min-h-screen max-w-[1480px] print:min-h-0 print:max-w-none">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 px-5 py-6 text-black shadow-2xl transition-transform duration-200 print:hidden lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
        

          <div className="mb-8 rounded-[1.75rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Signed in as</p>
            <h3 className="mt-2 text-lg font-bold text-white">
              {currentUser?.name || "Customer"}
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              {currentUser?.phone || currentUser?.email || "Secure OTP session"}
            </p>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-slate-800">
                <Image
                  src={getAssetUrl(currentUser?.image)}
                  alt={currentUser?.name || "Customer"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-400">
                  {currentUser?.status === "active" ? "Active customer" : "Customer"}
                </p>
                <p className="text-xs text-slate-300">
                  {Number(currentUser?.verify) === 1 ? "Phone verified" : "Verification pending"}
                </p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {navigation.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-slate-950 shadow-lg"
                      : "text-slate-300 hover:bg-white/10 hover:text-black/80"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="text-base" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-8 w-full rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
          >
            {isLoggingOut ? "Signing out..." : "Logout"}
          </button>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col print:min-h-0">
          <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 px-4 py-4 backdrop-blur-xl print:hidden md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <FaBars />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Welcome back
                  </p>
                  <h1 className="text-xl font-bold text-slate-900">
                    {currentUser?.name || "Customer"}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm md:inline-flex"
                >
                  <FaHome className="text-slate-500" />
                  Back to shop
                </Link>
                <div className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm">
                  <FaBell />
                </div>
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-900">
                    <Image
                      src={getAssetUrl(currentUser?.image)}
                      alt={currentUser?.name || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold text-slate-900">
                      {currentUser?.name || "User"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {currentUser?.phone || currentUser?.email || "Authenticated"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 print:p-0 md:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
