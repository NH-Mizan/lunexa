"use client";

import { FaPrint } from "react-icons/fa";

export default function InvoiceActions() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700"
      aria-label="Print invoice"
      title="Print invoice"
    >
      <FaPrint />
    </button>
  );
}
