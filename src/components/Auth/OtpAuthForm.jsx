"use client";

import { apiRequest, normalizePhoneNumber } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast, Bounce } from "react-toastify";

const OTP_LENGTH = 4;

export default function OtpAuthForm({
  compact = false,
  onSuccess,
  redirectTo = "/dashboard",
}) {
  const router = useRouter();
  const inputRefs = useRef([]);
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array.from({ length: OTP_LENGTH }, () => ""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer <= 0) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setTimer((value) => value - 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timer]);

  async function handleSendOtp() {
    const normalizedPhone = normalizePhoneNumber(phone);

    if (normalizedPhone.length < 10) {
      toast.error("Enter a valid phone number.", {
        position: "bottom-right",
        transition: Bounce,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await apiRequest("/api/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone: normalizedPhone }),
      });

      setPhone(normalizedPhone);
      setStep("otp");
      alert('otp : ' +`${data?.verify}`);
      setTimer(Number(data?.expires_in) || 120);
      setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
      toast.success(data?.message || "OTP sent successfully.", {
        position: "bottom-right",
        transition: Bounce,
      });
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.message || "Failed to send OTP.", {
        position: "bottom-right",
        transition: Bounce,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyOtp() {
    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      toast.error(`Enter the ${OTP_LENGTH}-digit OTP.`, {
        position: "bottom-right",
        transition: Bounce,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await apiRequest("/api/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone, otp: code }),
      });

      toast.success("Login successful.", {
        position: "bottom-right",
        transition: Bounce,
      });

      if (onSuccess) {
        onSuccess();
      }

      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      toast.error(error.message || "OTP verification failed.", {
        position: "bottom-right",
        transition: Bounce,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOtpChange(value, index) {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(event, index) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  const wrapperClass = compact
    ? "w-full space-y-5"
    : "w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-xl";

  return (
    <div className={wrapperClass}>
      {compact && (
        <div className="mb-5 space-y-1 pr-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pry">
            Secure Access
          </p>
          <h2 className="text-2xl font-bold text-gray-900">Login with OTP</h2>
          <p className="text-sm text-gray-500">
            Enter your phone number and verify the code.
          </p>
        </div>
      )}

      {!compact && (
        <div className="mb-8 space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pry">
            Secure Access
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Login with OTP</h1>
          <p className="text-sm text-gray-500">
            We send a one-time code to your phone and keep the session in a secure cookie.
          </p>
        </div>
      )}

      {step === "phone" ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-pry focus:ring-4 focus:ring-pink-100"
            />
          </div>

          <button
            type="button"
            onClick={handleSendOtp}
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-pry px-4 py-3 font-semibold text-white transition hover-bg-sec disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl bg-pink-50 px-4 py-3 text-sm text-gray-700">
            Code sent to <span className="font-semibold">{phone}</span>
          </div>

          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => handleOtpChange(event.target.value, index)}
                onKeyDown={(event) => handleOtpKeyDown(event, index)}
                className="h-14 w-full max-w-[58px] rounded-2xl border border-gray-300 text-center text-xl font-bold outline-none transition focus:border-sec focus:ring-4 focus:ring-sky-100"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-sec px-4 py-3 font-semibold text-white transition hover-bg-pry disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center text-sm text-gray-500">
            {timer > 0 ? (
              <span>Resend available in {timer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                className="font-semibold text-pry"
              >
                Resend OTP
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setStep("phone")}
            className="w-full text-sm font-medium text-gray-500"
          >
            Use another phone number
          </button>
        </div>
      )}
    </div>
  );
}
