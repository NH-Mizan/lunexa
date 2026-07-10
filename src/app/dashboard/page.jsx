"use client";

import { useAuthSession } from "@/components/Auth/AuthSessionProvider";
import { FaCheckCircle, FaMapMarkerAlt, FaPhoneAlt, FaShieldAlt } from "react-icons/fa";

function StatCard({ label, value, accent, helper, icon }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-600">
          {icon}
        </div>
      </div>
      <h3 className={`mt-5 text-2xl font-bold ${accent}`}>{value}</h3>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </div>
  );
}

export default function DashboardOverviewPage() {
  const user = useAuthSession();
  const accountStatus = user?.status === "active" ? "Active" : "Inactive";
  const verificationStatus = Number(user?.verify) === 1 ? "Verified" : "Pending";

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#111827_40%,#1d4ed8_100%)] p-6 text-white shadow-lg md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
              Overview
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Hello, {user?.name || "Customer"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
              Your account is protected with OTP verification and a secure
              cookie-based session. Manage your details, orders, and account
              information from one clean workspace.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/23 bg-white/23 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-100">
              Account snapshot
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                <span className="text-slate-200">Phone</span>
                <span className="font-semibold text-white">{user?.phone || "Not set"}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                <span className="text-slate-200">District</span>
                <span className="font-semibold text-white">{user?.district || "Not set"}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                <span className="text-slate-200">Verification</span>
                <span className="font-semibold text-emerald-200">{verificationStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

   
    </div>
  );
}
