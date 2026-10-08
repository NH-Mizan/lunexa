"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiAlertCircle, FiCalendar, FiCheck, FiClipboard, FiClock, FiCreditCard, FiDollarSign, FiHeadphones, FiHeart, FiMapPin, FiPackage, FiPhone, FiShield, FiShoppingBag, FiTruck, FiUser } from "react-icons/fi";
import { getAssetUrl } from "@/lib/asset-url";
import Loading from "./loading";
import styles from "./success.module.css";

const money = (value) => `৳${Number(value || 0).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;
const label = (value) => String(value || "Not provided").replace(/[_-]/g, " ");

function orderDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Dhaka" });
}

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
      <main className={styles.page}>
        <div className={styles.errorCard}>
          <FiAlertCircle aria-hidden="true" className={styles.errorIcon} />
          <h1>{result?.error && id ? "Unable to load your order" : "Order details unavailable"}</h1>
          <p>{!id ? "Open the confirmation link for your order to view its details." : "We couldn’t retrieve this order. Try again or check your orders from your account."}</p>
          <div className={styles.actions}>
            {id && <button onClick={() => setAttempt((value) => value + 1)} className={styles.primaryButton}>Try again</button>}
            <Link href="/dashboard/orders" className={styles.outlineButton}>My orders</Link>
          </div>
        </div>
      </main>
    );
  }

  const items = Array.isArray(order.order_details) ? order.order_details : [];
  const paymentMethod = order.payment?.payment_method;
  const isCod = ["cod", "cash on delivery", "cash_on_delivery"].includes(String(paymentMethod).toLowerCase());
  const paymentStatus = order.payment?.payment_status;
  const isPaid = ["paid", "completed", "success", "successful"].includes(String(paymentStatus).toLowerCase());
  const date = orderDate(order.created_at);
  const phone = order.shipping?.phone || order.customer?.phone;
  const subtotal = Number(order.amount || 0) - Number(order.shipping_charge || 0);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.confirmation}>
          <div className={styles.successMark} aria-hidden="true"><FiCheck strokeWidth={3.5} /><span className={styles.confetti} /></div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase! Your order has been placed successfully.<br />We’ll notify you once your items are on the way.</p>
        </header>

        <dl className={styles.orderInfo}>
          <div><span className={styles.infoIcon}><FiClipboard aria-hidden="true" /></span><div><dt>Order Number</dt><dd>#{order.invoice_id || id}</dd></div></div>
          <div><span className={styles.infoIcon}><FiPhone aria-hidden="true" /></span><div><dt>Phone</dt><dd>{phone || "Not provided"}</dd></div></div>
          <div><span className={styles.infoIcon}><FiDollarSign aria-hidden="true" /></span><div><dt>Total Amount</dt><dd>{money(order.amount)}</dd></div></div>
        </dl>

        <section className={styles.summary} aria-labelledby="order-summary-heading">
          <div className={styles.summaryHeader}>
            <div className={styles.headingGroup}><FiShoppingBag aria-hidden="true" /><div><h2 id="order-summary-heading">Order Summary</h2><p>Here are the details of your order.</p></div></div>
            {date && <span className={styles.date}><FiCalendar aria-hidden="true" /> Order Date: {date}</span>}
          </div>
          <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Ordered products">
            <table className={styles.productTable}>
              <thead><tr><th scope="col">Product</th><th scope="col">Qty</th><th scope="col">Price</th><th scope="col">Total</th></tr></thead>
              <tbody>
                {items.map((item, index) => {
                  const image = typeof item.image === "string" ? item.image : item.image?.image;
                  const variant = [item.product_color && `Color: ${item.product_color}`, item.product_size && `Size: ${item.product_size}`].filter(Boolean).join(" · ");
                  return (
                    <tr key={item.id || index}>
                      <td><div className={styles.product}>
                        <Image src={getAssetUrl(image)} alt={item.product_name || "Product"} width={64} height={64} className={styles.productImage} />
                        <div><h3>{item.product_name}</h3><p>{variant || "Lunexa"}</p></div>
                      </div></td>
                      <td>{item.qty}</td><td>{money(item.sale_price)}</td><td>{money(Number(item.qty) * Number(item.sale_price))}</td>
                    </tr>
                  );
                })}
                {!items.length && <tr><td colSpan={4} className={styles.empty}>Product details are not available for this order.</td></tr>}
              </tbody>
            </table>
          </div>
          <dl className={styles.totals}>
            <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>{money(order.shipping_charge)}</dd></div>
            <div className={styles.grandTotal}><dt>Total</dt><dd>{money(order.amount)}</dd></div>
          </dl>

          <div className={styles.detailCards}>
            <section className={styles.delivery} aria-labelledby="delivery-heading">
              <h2 id="delivery-heading"><span className={styles.cardIcon}><FiTruck aria-hidden="true" /></span> Billing &amp; Delivery</h2>
              <address>
                <p><FiUser aria-hidden="true" /><span>{order.shipping?.name || order.customer?.name || "Name not provided"}</span></p>
                <p><FiPhone aria-hidden="true" /><span>{phone || "Phone not provided"}</span></p>
                <p><FiMapPin aria-hidden="true" /><span>{order.shipping?.address || order.customer?.address || "Address not provided"}</span></p>
              </address>
              <FiMapPin aria-hidden="true" className={styles.deliveryArt} />
            </section>
            <section className={styles.payment} aria-labelledby="payment-heading">
              <h2 id="payment-heading"><span className={styles.cardIcon}><FiCreditCard aria-hidden="true" /></span> Payment Information</h2>
              <div className={styles.paymentContent}>
                <span className={styles.cashIcon}><FiDollarSign aria-hidden="true" /></span>
                <div><h3>{isCod ? "Cash On Delivery" : label(paymentMethod)}</h3>
                  <span className={`${styles.paymentBadge} ${isPaid ? styles.paid : ""}`}><FiClock aria-hidden="true" /> {paymentStatus ? `Payment ${label(paymentStatus)}` : "Status unavailable"}</span>
                  <p>{isCod && !isPaid ? "Please keep the exact amount ready at the time of delivery." : isPaid ? "Your payment has been received. Thank you!" : "You can check your payment status from your orders."}</p>
                </div>
              </div>
              <FiPackage aria-hidden="true" className={styles.paymentArt} />
            </section>
          </div>
          <div className={styles.actions}>
            <Link href="/products" className={styles.outlineButton}><FiShoppingBag aria-hidden="true" /> Continue Shopping</Link>
            <Link href={`/dashboard/orders/${encodeURIComponent(order.id || id)}`} className={styles.primaryButton}><FiClipboard aria-hidden="true" /> Track Your Order</Link>
          </div>
          <div className={styles.assurances}>
            <div><FiShield aria-hidden="true" /><div><h3>Secure Shopping</h3><p>Your data is safe with us</p></div></div>
            <div><FiTruck aria-hidden="true" /><div><h3>Fast Delivery</h3><p>Carefully delivered to you</p></div></div>
            <div><FiHeadphones aria-hidden="true" /><div><h3>Customer Support</h3><p>We’re here to help</p></div></div>
            <div><FiHeart aria-hidden="true" /><div><h3>Happy Customers</h3><p>Your satisfaction matters</p></div></div>
          </div>
        </section>
        <p className={styles.footer}>© {new Date().getFullYear()} Lunexa. All rights reserved.</p>
      </div>
    </main>
  );
}
