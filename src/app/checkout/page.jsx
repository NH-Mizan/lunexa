"use client";
import useShopStore from "@/context/cardStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CheckoutSkeleton } from "@/components/Skeletons";
import Image from "next/image";
import { getAssetUrl } from "@/lib/asset-url";

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
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container space-y-8">

        {/* Top Section */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">

          {/* ================= LEFT - DELIVERY DETAILS ================= */}
          <div className="min-w-0 bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-6">

            <h2 className="text-2xl font-bold border-b pb-3">
              Delivery Details
            </h2>

            {/* Name + Phone */}
            <div className="grid min-w-0 xl:grid-cols-2 gap-6">

              {/* Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Name (নাম)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 
                 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 
                 outline-none transition"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Phone Number (মোবাইল নাম্বার)
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 
                 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 
                 outline-none transition"
                />
              </div>

            </div>


            {/* Address + Note */}
            <div className="grid min-w-0 xl:grid-cols-2 gap-6 mt-4">

              {/* Address */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Delivery Address (ঠিকানা)
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 h-28 
                 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 
                 outline-none transition resize-none"
                />
              </div>

              {/* Note */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Note (optional)
                </label>
                <textarea
                  name="note"
                  value={formData.note || ""}
                  onChange={handleChange}
                  placeholder="Any specific instructions for delivery?"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 h-28 
                 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 
                 outline-none transition resize-none"
                />
              </div>

            </div>




            {/* Shipping + Payment */}
            <div className="grid min-w-0 xl:grid-cols-2 gap-6">

              {/* Shipping */}
              <div className="">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  Shipping Location
                </h3>

                <div className="space-y-3">

                  {/* Inside Dhaka */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition 
                    ${shipping === 70 ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shipping === 70}
                        onChange={() => setShipping(70)}
                        className="accent-primary w-4 h-4"
                      />
                      <div>
                        <p className="font-medium text-gray-800">Inside Dhaka</p>
                        <p className="text-sm text-gray-500">Delivery within 1-2 days</p>
                      </div>
                    </div>

                    <span className="font-semibold text-primary">৳70</span>
                  </label>

                  {/* Outside Dhaka */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition 
                  ${shipping === 120 ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shipping === 120}
                        onChange={() => setShipping(120)}
                        className="accent-primary w-4 h-4"
                      />
                      <div>
                        <p className="font-medium text-gray-800">Outside Dhaka</p>
                        <p className="text-sm text-gray-500">Delivery within 3-5 days</p>
                      </div>
                    </div>

                    <span className="font-semibold text-primary">৳120</span>
                  </label>

                </div>
              </div>

              {/* Payment */}
              <div className="">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  Payment Method
                </h3>

                <div className="space-y-3">

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition 
                    ${payment === "cod" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === "cod"}
                        onChange={() => setPayment("cod")}
                        className="accent-primary w-4 h-4"
                      />
                      <div>
                        <p className="font-medium text-gray-800">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive</p>
                      </div>
                    </div>

                    <span className="text-sm font-semibold text-gray-600">COD</span>
                  </label>

                  {/* Bkash */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition 
                 ${payment === "bkash" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === "bkash"}
                        onChange={() => setPayment("bkash")}
                        className="accent-primary w-4 h-4"
                      />
                      <div>
                        <p className="font-medium text-gray-800">bKash</p>
                        <p className="text-sm text-gray-500">Pay securely via mobile banking</p>
                      </div>
                    </div>

                    <span className="text-sm font-semibold text-pink-500">bKash</span>
                  </label>

                </div>
              </div>

            </div>

            {/* Order Button */}
            <button onClick={handleSubmit} className="w-full bg-pry hover-bg-sec transition text-white py-3 rounded-lg font-semibold text-lg">
              অর্ডার করুন (৳{total})
            </button>

          </div>

          <aside className="min-w-0 space-y-6">
            <section className="min-w-0 rounded-lg bg-white p-4 shadow-md sm:p-6" aria-labelledby="checkout-products-heading">
              <h2 id="checkout-products-heading" className="border-b pb-3 text-xl font-bold sm:text-2xl">
                Your Products
              </h2>
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <article key={`${item.id}-${item.size}-${item.color}`} className="py-4 last:pb-0">
                    <div className="flex items-start gap-3">
                      <Image
                        src={getAssetUrl(typeof item.image === "string" ? item.image : item.image?.image)}
                        alt={item.name || "Product"}
                        width={64}
                        height={64}
                        className="h-16 w-16 shrink-0 rounded-lg border object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-sm font-semibold text-gray-900">{item.name}</h3>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs">
                          {item.color && <span className="rounded-full bg-pink-100 px-2 py-1 text-pink-700">{item.color}</span>}
                          {item.size && <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">{item.size}</span>}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Price: ৳{Number(item.new_price) || 0}</p>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item)} aria-label={`Remove ${item.name} from cart`} className="shrink-0 text-sm text-red-500 hover:text-red-700">
                        Remove
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => decreaseQty(item)} disabled={item.quantity <= 1} aria-label={`Decrease quantity of ${item.name}`} className="h-8 w-8 rounded-md border hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">−</button>
                        <span className="min-w-4 text-center text-sm">{item.quantity}</span>
                        <button type="button" onClick={() => increaseQty(item)} aria-label={`Increase quantity of ${item.name}`} className="h-8 w-8 rounded-md border hover:bg-gray-100">+</button>
                      </div>
                      <p className="text-sm font-semibold">Subtotal: ৳{(Number(item.new_price) || 0) * item.quantity}</p>
                    </div>
                  </article>
                ))}
                {cart.length === 0 && <p className="py-6 text-center text-sm text-gray-500">No products in cart</p>}
              </div>
            </section>

            {/* ================= RIGHT - CART SUMMARY ================= */}
            <div className="min-w-0 bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4 h-fit">

              <h2 className="text-2xl font-bold border-b pb-3 text-center">
                Cart Summary
              </h2>

              <div className="space-y-3 text-sm">

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

                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>৳{total}</span>
                </div>

              </div>

              {/* Coupon */}
              <div className="pt-4">
                <p className="text-sm mb-2">Do you have a coupon code?</p>
                <div className="flex">
                  <input
                    type="text"
                    className="min-w-0 flex-1 coupon_input"
                    placeholder="Enter coupon"
                  />
                  <button className="coupon_btn">
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
