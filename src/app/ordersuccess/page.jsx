"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SkeletonBlock, TableSkeleton } from "@/components/Skeletons";

function OrderSuccessSkeleton() {
  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-8">
        <div className="space-y-4 border-b pb-6 text-center">
          <div className="flex justify-center">
            <SkeletonBlock className="h-16 w-16 rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <SkeletonBlock className="h-8 w-80 rounded-md" />
            <SkeletonBlock className="h-4 w-56 rounded-md" />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <SkeletonBlock className="h-10 w-32 rounded-full" />
            <SkeletonBlock className="h-10 w-32 rounded-full" />
            <SkeletonBlock className="h-10 w-32 rounded-full" />
          </div>
        </div>
        <div className="space-y-4">
          <SkeletonBlock className="h-7 w-40 rounded-md" />
          <TableSkeleton rows={3} showImage={false} columns={4} />
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const id = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordersuccess/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setOrder(data.order);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <OrderSuccessSkeleton />;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-red-500">Order not found</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">

        {/* SUCCESS HEADER */}
        <div className="text-center border-b pb-6">
          <div className="text-6xl">🎉</div>

          <h1 className="text-3xl font-bold text-green-600 mt-3">
            Your order has been placed successfully
          </h1>

          <p className="text-gray-500 mt-2">
            Our team will contact you shortly
          </p>

          {/* quick info */}
          <div className="flex flex-wrap justify-center gap-3 mt-5 text-sm">
            <span className="bg-blue-50 px-4 py-2 rounded-full">
              Invoice: #{order.invoice_id}
            </span>
            <span className="bg-blue-50 px-4 py-2 rounded-full">
              Phone: {order.shipping?.phone}
            </span>
            <span className="bg-blue-50 px-4 py-2 rounded-full">
              Total: ৳{order.amount}
            </span>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3">Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {order.order_details?.map((item, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">
                      <div className="font-medium">
                        {item.product_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Color: {item.product_color} | Size: {item.product_size}
                      </div>
                    </td>

                    <td className="text-center">{item.qty}</td>

                    <td className="text-center">৳{item.sale_price}</td>

                    <td className="text-center font-semibold">
                      ৳{item.qty * item.sale_price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOTAL SECTION */}
        <div className="mt-6 flex justify-end">
          <div className="w-full md:w-1/2 bg-gray-50 p-5 rounded-xl">
            
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳{order.amount - order.shipping_charge}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>৳{order.shipping_charge}</span>
            </div>

            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>৳{order.amount}</span>
            </div>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="mt-8 grid md:grid-cols-2 gap-5">

          <div className="border rounded-xl p-5">
            <h3 className="font-semibold mb-2">Billing & Delivery</h3>
            <p>{order.shipping?.name}</p>
            <p>{order.shipping?.phone}</p>
            <p>{order.shipping?.address}</p>
          </div>

          <div className="border rounded-xl p-5">
            <h3 className="font-semibold mb-2">Payment Info</h3>
            <p>{order.payment?.payment_method}</p>
            <p className="text-sm text-gray-500">
              Status: {order.payment?.payment_status}
            </p>
          </div>

        </div>

        {/* BUTTON */}
        <div className="mt-8 text-center">
          <Link href={'/'} className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition">
            Back To Home
          </Link>
        </div>

      </div>
    </div>
  );
}
