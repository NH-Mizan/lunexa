import OtpAuthForm from "@/components/Auth/OtpAuthForm";
import { getAuthenticatedUser } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getAuthenticatedUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7f9_0%,#f8fbff_100%)]">
      <div className="container grid min-h-screen grid-cols-1 gap-10 py-10 md:grid-cols-2 md:items-center">
        <div className="order-2 md:order-1">
          <OtpAuthForm />
        </div>

        <div className="order-1 flex items-center justify-center md:order-2">
          <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-2xl backdrop-blur">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(244,83,136,0.14),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(0,173,241,0.14),_transparent_35%)]" />
            <div className="relative space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pry">
                  SellPixser Account
                </p>
                <h2 className="text-4xl font-bold text-slate-900">
                  Fast login, protected dashboard, secure session.
                </h2>
                <p className="max-w-lg text-sm leading-6 text-slate-600">
                  We verify your phone with a short-lived OTP and keep the token in
                  an HTTP-only cookie so your session stays out of browser storage.
                </p>
              </div>

              <div className="overflow-hidden rounded-[1.5rem] bg-white p-3 shadow-lg">
                <Image
                  src="/images/sell-pixer.webp"
                  alt="SellPixser"
                  width={720}
                  height={420}
                  className="h-auto w-full rounded-[1.25rem] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
