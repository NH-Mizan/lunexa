"use client";

import OtpAuthForm from "@/components/Auth/OtpAuthForm";

export default function OtpLoginModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          Close
        </button>

        <OtpAuthForm compact onSuccess={onClose} />
      </div>
    </div>
  );
}
