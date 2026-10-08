"use client";
import useShopStore from "@/context/cardStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CheckoutSkeleton } from "@/components/Skeletons";
import Image from "next/image";
import { getAssetUrl } from "@/lib/asset-url";
import Link from "next/link";
import { FiArrowRight, FiCheck, FiCreditCard, FiFileText, FiLock, FiMapPin, FiMinus, FiPlus, FiShield, FiShoppingBag, FiShoppingCart, FiTag, FiTrash2, FiTruck } from "react-icons/fi";

export default function Checkout() {
  const cart = useShopStore((state) => state.cart);
  const increaseQty = useShopStore((state) => state.increaseQty);
  const decreaseQty = useShopStore((state) => state.decreaseQty);
  const removeFromCart = useShopStore((state) => state.removeFromCart);
  const [hydrated, setHydrated] = useState(false);
  const [shipping, setShipping] = useState(70);
  const [payment, setPayment] = useState("cod");
  const [token, setToken] = useState(null);
  const [tokenReady, setTokenReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setTokenReady(true);
    setHydrated(true);
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,

    });
  };
  const handleSubmit = async () => {
    if (!cart.length || isProcessing) return;
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Name, phone, and address required!");
      return;
    }

    setIsProcessing(true);

    try {
      const formattedCart = cart.map((item) => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        color: item.color ?? "",
        size: item.size ?? "",
        image: item.image.image ?? "",
      }));

      const orderData = {
        ...formData,
        area: 1,
        discount: 0,
        cart: formattedCart,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order-save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        router.push(`/ordersuccess?orderId=${data.order.id}`);
      } else {
        toast.error("Failed to place order.");
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      setIsProcessing(false);
    }
  };




  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item.new_price) || 0) * item.quantity,
    0
  );
  const discount = 0;
  const total = subtotal + shipping - discount;

  if (!hydrated || !tokenReady) {
    return <CheckoutSkeleton />;
  }

  if (isProcessing) {
    return <CheckoutSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 text-slate-800 sm:py-10">
      <div className="container space-y-6 px-2 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-pry">Almost there</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Checkout</h1>
          </div>
          <ol aria-label="Checkout progress" className="flex items-center gap-2 text-[10px] font-medium sm:gap-4 sm:text-sm">
            <li className="flex items-center gap-2 text-slate-500"><FiShoppingCart aria-hidden="true" /> Cart</li>
            <li aria-hidden="true" className="h-px w-4 bg-slate-200 sm:w-10" />
            <li aria-current="step" className="flex items-center gap-2 text-pry"><span className="grid size-8 place-items-center rounded-full bg-pry text-white"><FiTruck aria-hidden="true" /></span> Checkout</li>
            <li aria-hidden="true" className="h-px w-4 bg-slate-200 sm:w-10" />
            <li className="flex items-center gap-2 text-slate-400"><FiCheck aria-hidden="true" /> Confirmation</li>
          </ol>
          <p className="hidden items-center gap-2 text-xs text-slate-500 xl:flex"><FiLock aria-hidden="true" className="text-pry" /> Secure checkout</p>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">

          {/* ================= LEFT - DELIVERY DETAILS ================= */}
          <div className="min-w-0 space-y-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">

            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-rose-50 text-pry"><FiTruck aria-hidden="true" className="size-6" /></span>
              <div><h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Delivery Details</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">Please provide your delivery information to complete your order.</p></div>
            </div>

            {/* Name + Phone */}
            <div className="grid min-w-0 gap-5 sm:grid-cols-2">

              {/* Name */}
              <div className="flex flex-col">
                <label htmlFor="checkout-name" className="mb-2 text-sm font-medium text-slate-700">
                  Name (নাম)
                </label>
                <input
                  type="text"
                  id="checkout-name"
                  autoComplete="name"
                  placeholder="Your full name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400
                 focus:border-pry focus:ring-2 focus:ring-rose-100
                 outline-none transition"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label htmlFor="checkout-phone" className="mb-2 text-sm font-medium text-slate-700">
                  Phone Number (মোবাইল নাম্বার)
                </label>
                <input
                  type="tel"
                  id="checkout-phone"
                  autoComplete="tel"
                  placeholder="01XXXXXXXXX"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400
                 focus:border-pry focus:ring-2 focus:ring-rose-100
                 outline-none transition"
                />
              </div>

            </div>


            {/* Address + Note */}
            <div className="grid min-w-0 gap-5 sm:grid-cols-2">

              {/* Address */}
              <div className="flex flex-col">
                <label htmlFor="checkout-address" className="mb-2 text-sm font-medium text-slate-700">
                  Delivery Address (ঠিকানা)
                </label>
                <textarea
                  id="checkout-address"
                  autoComplete="street-address"
                  placeholder="House No, Road No, Area, City, District"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 h-28 placeholder:text-slate-400
                 focus:border-pry focus:ring-2 focus:ring-rose-100
                 outline-none transition resize-none"
                />
              </div>

              {/* Note */}
              <div className="flex flex-col">
                <label htmlFor="checkout-note" className="mb-2 text-sm font-medium text-slate-700">
                  Note (optional)
                </label>
                <textarea
                  id="checkout-note"
                  name="note"
                  value={formData.note || ""}
                  onChange={handleChange}
                  placeholder="Any specific instructions for delivery?"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 h-28 placeholder:text-slate-400
                 focus:border-pry focus:ring-2 focus:ring-rose-100
                 outline-none transition resize-none"
                />
              </div>

            </div>




            {/* Shipping + Payment */}
            <div className="min-w-0 space-y-6 border-t border-slate-100 pt-6">

              {/* Shipping */}
              <div className="">
                <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold text-slate-900"><FiMapPin aria-hidden="true" className="text-pry" /> Shipping Location</h3>
                <p className="mb-4 text-sm text-slate-500">Choose your preferred delivery option</p>

                <div className="grid gap-3 sm:grid-cols-2">

                  {/* Inside Dhaka */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition 
                    ${shipping === 70 ? "border-pry bg-rose-50/60" : "border-slate-200 hover:border-pry"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shipping === 70}
                        onChange={() => setShipping(70)}
                        className="size-4 shrink-0 accent-[var(--primary-color)]"
                      />
                      <div>
                        <p className="font-medium text-gray-800">Inside Dhaka</p>
                        <p className="text-sm text-gray-500">Delivery within 1-2 days</p>
                      </div>
                    </div>

                    <span className="ml-3 font-semibold text-pry">৳70</span>
                  </label>

                  {/* Outside Dhaka */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition 
                  ${shipping === 120 ? "border-pry bg-rose-50/60" : "border-slate-200 hover:border-pry"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shipping === 120}
                        onChange={() => setShipping(120)}
                        className="size-4 shrink-0 accent-[var(--primary-color)]"
                      />
                      <div>
                        <p className="font-medium text-gray-800">Outside Dhaka</p>
                        <p className="text-sm text-gray-500">Delivery within 3-5 days</p>
                      </div>
                    </div>

                    <span className="ml-3 font-semibold text-pry">৳120</span>
                  </label>

                </div>
              </div>

              {/* Payment */}
              <div className="">
                <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold text-slate-900"><FiCreditCard aria-hidden="true" className="text-pry" /> Payment Method</h3>
                <p className="mb-4 text-sm text-slate-500">Select your preferred payment method</p>

                <div className="grid gap-3 sm:grid-cols-2">

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition 
                    ${payment === "cod" ? "border-pry bg-rose-50/60" : "border-slate-200 hover:border-pry"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === "cod"}
                        onChange={() => setPayment("cod")}
                        className="size-4 shrink-0 accent-[var(--primary-color)]"
                      />
                      <div>
                        <p className="font-medium text-gray-800">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive</p>
                      </div>
                    </div>

                    <span className="ml-3 rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-pry">COD</span>
                  </label>

                  {/* Bkash */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition 
                 ${payment === "bkash" ? "border-pry bg-rose-50/60" : "border-slate-200 hover:border-pry"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === "bkash"}
                        onChange={() => setPayment("bkash")}
                        className="size-4 shrink-0 accent-[var(--primary-color)]"
                      />
                      <div>
                        <p className="font-medium text-gray-800">bKash</p>
                        <p className="text-sm text-gray-500">Pay securely via mobile banking</p>
                      </div>
                    </div>

                    <span className="ml-3 text-sm font-semibold text-pry">bKash</span>
                  </label>

                </div>
              </div>

            </div>

            {/* Order Button */}
            <button type="button" onClick={handleSubmit} disabled={!cart.length || isProcessing} className="flex w-full items-center justify-center gap-3 rounded-xl bg-pry px-4 py-4 text-lg font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 disabled:cursor-not-allowed disabled:opacity-50">
              <FiShoppingCart aria-hidden="true" className="size-5" />
              অর্ডার করুন (৳{total})
              <FiArrowRight aria-hidden="true" className="size-5" />
            </button>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <span className="flex items-center gap-2"><FiShield aria-hidden="true" className="size-4 text-pry" /> Secure checkout</span>
              <span className="flex items-center gap-2"><FiTruck aria-hidden="true" className="size-4 text-pry" /> Cash on delivery</span>
              <span className="flex items-center gap-2"><FiCreditCard aria-hidden="true" className="size-4 text-pry" /> bKash accepted</span>
            </div>

          </div>

          <aside className="min-w-0 space-y-6">
            <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="checkout-products-heading">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <h2 id="checkout-products-heading" className="flex items-center gap-2 text-xl font-bold text-slate-900"><FiShoppingBag aria-hidden="true" className="text-pry" /> Your Products</h2>
                <span className="shrink-0 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-pry">{cart.length} {cart.length === 1 ? "item" : "items"}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {cart.map((item) => (
                  <article key={`${item.id}-${item.size}-${item.color}`} className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-3 gap-y-3 py-5 last:pb-0 sm:grid-cols-[80px_minmax(0,1fr)] sm:gap-x-4">
                      <Image
                        src={getAssetUrl(typeof item.image === "string" ? item.image : item.image?.image)}
                        alt={item.name || "Product"}
                        width={80}
                        height={80}
                        className="row-span-2 size-16 rounded-xl border border-slate-100 bg-slate-50 object-cover sm:size-20"
                      />
                    <div className="flex min-w-0 items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="break-words text-sm font-semibold leading-relaxed text-slate-900">{item.name}</h3>
                        {(item.color || item.size) && <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-slate-500">
                          {item.color && <span className="rounded-md bg-slate-50 px-2 py-1">Color: {item.color}</span>}
                          {item.size && <span className="rounded-md bg-slate-50 px-2 py-1">Size: {item.size}</span>}
                        </div>}
                        <p className="mt-1 text-sm tabular-nums text-slate-500">৳{Number(item.new_price) || 0}</p>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item)} aria-label={`Remove ${item.name} from cart`} title="Remove product" className="grid size-9 shrink-0 place-items-center rounded-lg text-pry transition hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-rose-400">
                        <FiTrash2 aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                    <div className="col-start-2 flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-200">
                        <button type="button" onClick={() => decreaseQty(item)} disabled={item.quantity <= 1} aria-label={`Decrease quantity of ${item.name}`} className="grid size-9 place-items-center transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-slate-300"><FiMinus aria-hidden="true" className="size-3.5" /></button>
                        <span aria-live="polite" className="grid h-9 min-w-8 place-items-center border-x border-slate-100 text-sm tabular-nums">{item.quantity}</span>
                        <button type="button" onClick={() => increaseQty(item)} aria-label={`Increase quantity of ${item.name}`} className="grid size-9 place-items-center transition hover:bg-rose-50"><FiPlus aria-hidden="true" className="size-3.5" /></button>
                      </div>
                      <p className="text-right text-sm font-semibold tabular-nums text-slate-900"><span className="mr-1 text-xs font-normal text-slate-500">Subtotal</span> ৳{(Number(item.new_price) || 0) * item.quantity}</p>
                    </div>
                  </article>
                ))}
                {cart.length === 0 && <div className="flex flex-col items-center gap-3 py-8 text-center"><FiShoppingBag aria-hidden="true" className="size-9 text-slate-300" /><p className="text-sm text-slate-500">Your cart is empty</p><Link href="/" className="text-sm font-semibold text-pry hover:underline">Continue shopping <span aria-hidden="true">→</span></Link></div>}
              </div>
            </section>

            {/* ================= RIGHT - CART SUMMARY ================= */}
            <div className="h-fit min-w-0 space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">

              <h2 className="flex items-center gap-2 border-b border-slate-100 pb-5 text-xl font-bold text-slate-900">
                <FiFileText aria-hidden="true" className="text-pry" /> Cart Summary
              </h2>

              <div className="space-y-4 text-sm tabular-nums text-slate-600">

                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span>
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Product Price</span>
                  <span>৳{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>৳{discount}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>৳{shipping}</span>
                </div>

                <div aria-live="polite" className="flex justify-between border-t border-slate-100 pt-4 text-xl font-bold text-slate-900">
                  <span>Total</span>
                  <span>৳{total}</span>
                </div>

              </div>

              {/* Coupon */}
              <div className="pt-4">
                <label htmlFor="checkout-coupon" className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600"><FiTag aria-hidden="true" className="text-pry" /> Do you have a coupon code?</label>
                <div className="flex">
                  <input
                    type="text"
                    id="checkout-coupon"
                    className="min-w-0 flex-1 rounded-l-xl border border-r-0 border-rose-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-pry"
                    placeholder="Enter coupon"
                  />
                  <button type="button" className="rounded-r-xl bg-pry px-5 text-sm font-semibold text-white transition hover:brightness-95">
                    Apply
                  </button>
                </div>
              </div>



            </div>

          </aside>
        </div>

      </div>
    </div>
  );
}
