"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiArrowRight, FiCheck, FiCreditCard, FiMapPin, FiPackage, FiPhone, FiShoppingBag, FiAlertCircle } from "react-icons/fi";
import Loading from "./loading";

const money = (value) => `৳${Number(value || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const label = (value) => String(value || "Not provided").replace(/[_-]/g, " ");
const actionClass = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-600";

export default function OrderSuccessPage() {
  return <Suspense fallback={<Loading />}><OrderSuccess /></Suspense>;
}

function OrderSuccess() {
  const searchParams = useSearchParams();
  const id = searchParams.get("orderId");
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    async function loadOrder() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordersuccess/${encodeURIComponent(id)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load order");
        const data = await response.json();
        if (!controller.signal.aborted) setResult({ id, attempt, order: data.status === "success" ? data.order : null });
      } catch (error) {
        if (error.name !== "AbortError" && !controller.signal.aborted) setResult({ id, attempt, error: true });
      }
    }
    loadOrder();
    return () => controller.abort();
  }, [id, attempt]);

  if (id && (result?.id !== id || result?.attempt !== attempt)) return <Loading />;
  const order = id ? result?.order : null;
  if (!order) {
    return (
      <main className="bg-[#faf8f9] px-4 py-20 text-slate-900">
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <FiAlertCircle aria-hidden="true" className="mx-auto mb-5 size-10 text-pry" />
          <h1 className="text-2xl font-bold">{result?.error && id ? "Unable to load your order" : "Order details unavailable"}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{!id ? "Open the confirmation link for your order to view its details." : "We couldn’t retrieve this order. You can try again or check your orders from your account."}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {id && <button onClick={() => setAttempt((value) => value + 1)} className={`${actionClass} bg-slate-900 text-white hover:bg-slate-700`}>Try again</button>}
            <Link href="/dashboard/orders" className={`${actionClass} border border-slate-200 hover:bg-slate-50`}>My orders</Link>
          </div>
        </div>
      </main>
    );
  }

  const items = Array.isArray(order.order_details) ? order.order_details : [];
  const itemCount = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  const paymentMethod = order.payment?.payment_method;
  const isCod = ["cod", "cash on delivery", "cash_on_delivery"].includes(String(paymentMethod).toLowerCase());

  return (
    <main className="bg-[#faf8f9] px-4 py-8 text-slate-900 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 sm:gap-4">
          <span className="flex items-center gap-1.5"><FiCheck aria-hidden="true" className="text-emerald-600" /> Shopping bag</span>
          <span aria-hidden="true" className="h-px w-5 bg-slate-300 sm:w-10" />
          <span className="flex items-center gap-1.5"><FiCheck aria-hidden="true" className="text-emerald-600" /> Checkout</span>
          <span aria-hidden="true" className="h-px w-5 bg-slate-300 sm:w-10" />
          <span aria-current="step" className="font-semibold text-slate-900">Confirmation</span>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-pink-100 bg-white px-5 py-9 text-center shadow-[0_8px_40px_-20px_rgba(80,30,50,0.15)] sm:px-10 sm:py-12">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[var(--primary-color)]" />
          <div aria-hidden="true" className="mx-auto flex size-20 items-center justify-center rounded-full border-8 border-emerald-50 bg-emerald-100 text-emerald-700"><FiCheck className="size-9" strokeWidth={2.5} /></div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Order placed successfully</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Thank you for your order!</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">We’ve received your order. Our team will contact you shortly to confirm the details.</p>
          <div className="mx-auto mt-7 grid max-w-2xl grid-cols-1 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50/70 text-left sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="min-w-0 px-5 py-4"><p className="text-xs text-slate-500">Invoice number</p><p className="mt-1 break-all text-sm font-semibold">#{order.invoice_id || id}</p></div>
            <div className="px-5 py-4"><p className="text-xs text-slate-500">Order total</p><p className="mt-1 text-sm font-semibold tabular-nums">{money(order.amount)}</p></div>
            <div className="px-5 py-4"><p className="text-xs text-slate-500">Payment method</p><p className="mt-1 text-sm font-semibold capitalize">{isCod ? "Cash on delivery" : label(paymentMethod)}</p></div>
          </div>
        </section>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
              <h2 className="flex items-center gap-3 text-lg font-semibold"><FiShoppingBag aria-hidden="true" className="text-pry" /> Order summary</h2>
              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
            </div>
            <ul className="divide-y divide-slate-100 px-5 sm:px-7">
              {items.map((item, index) => (
                <li key={item.id || index} className="flex gap-3 py-6 sm:gap-4">
                  <div aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-pink-100 bg-pink-50 text-pry sm:size-14"><FiPackage className="size-6" /></div>
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-sm font-semibold leading-6">{item.product_name}</h3>
                    {(item.product_color || item.product_size) && <p className="mt-1 text-xs leading-5 text-slate-500">{[item.product_color && `Color: ${item.product_color}`, item.product_size && `Size: ${item.product_size}`].filter(Boolean).join(" · ")}</p>}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="text-xs text-slate-500">{money(item.sale_price)} <span className="px-1">×</span> {item.qty}</span>
                      <span className="font-semibold tabular-nums">{money(Number(item.qty) * Number(item.sale_price))}</span>
                    </div>
                  </div>
                </li>
              ))}
              {!items.length && <li className="py-6 text-sm text-slate-500">Product details are not available for this order.</li>}
            </ul>
            <div className="flex items-start gap-3 border-t border-pink-100 bg-pink-50/50 px-5 py-4 sm:px-7"><FiPhone aria-hidden="true" className="mt-0.5 shrink-0 text-pry" /><p className="text-xs leading-5 text-slate-600">Please keep your phone available so our team can reach you about your order.</p></div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-base font-semibold">Payment summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Subtotal</dt><dd className="font-medium tabular-nums">{money(Number(order.amount || 0) - Number(order.shipping_charge || 0))}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Delivery charge</dt><dd className="font-medium tabular-nums">{money(order.shipping_charge)}</dd></div>
                <div className="flex justify-between gap-4 border-t border-dashed border-slate-200 pt-4"><dt className="font-semibold">Total amount</dt><dd className="text-xl font-bold tabular-nums">{money(order.amount)}</dd></div>
              </dl>
              <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-3"><FiCreditCard aria-hidden="true" className="mt-0.5 shrink-0 text-slate-500" /><div className="text-xs leading-5"><p className="font-medium capitalize">{isCod ? "Cash on delivery" : label(paymentMethod)}</p><p className="text-slate-500">Payment status: <span className="capitalize">{label(order.payment?.payment_status)}</span></p></div></div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold"><FiMapPin aria-hidden="true" className="text-pry" /> Delivery details</h2>
              <address className="mt-4 space-y-2 break-words text-sm not-italic leading-6">
                <p className="font-semibold">{order.shipping?.name || "Name not provided"}</p>
                <p className="text-slate-500">{order.shipping?.address || "Address not provided"}</p>
                {order.shipping?.phone && <p className="flex items-center gap-2 pt-1 text-slate-600"><FiPhone aria-hidden="true" className="size-3.5 shrink-0" />{order.shipping.phone}</p>}
              </address>
            </section>
          </aside>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/products" className={`${actionClass} w-full bg-slate-900 text-white hover:bg-slate-700 sm:w-auto`}>Continue shopping <FiArrowRight aria-hidden="true" /></Link>
          <Link href="/dashboard/orders" className={`${actionClass} w-full border border-slate-200 bg-white text-slate-700 hover:border-pink-300 hover:bg-pink-50 sm:w-auto`}>View my orders</Link>
        </div>
        <p className="mt-5 text-center text-xs leading-5 text-slate-500">Keep your invoice number handy for any questions about your order.</p>
      </div>
    </main>
  );
}
