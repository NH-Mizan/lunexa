import Link from "next/link";
import { laravelFetch, getSessionToken } from "@/lib/auth";
import {
  FaArrowRight,
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaReceipt,
} from "react-icons/fa";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function hexToRgba(hex, alpha) {
  if (!hex || typeof hex !== "string") {
    return `rgba(15, 23, 42, ${alpha})`;
  }

  const normalized = hex.replace("#", "");
  const fullHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  if (fullHex.length !== 6) {
    return `rgba(15, 23, 42, ${alpha})`;
  }

  const red = Number.parseInt(fullHex.slice(0, 2), 16);
  const green = Number.parseInt(fullHex.slice(2, 4), 16);
  const blue = Number.parseInt(fullHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getOrderStatusMeta(order) {
  const statusName = order?.status?.name || "Unknown";
  const statusColor = order?.status?.color || "#0f172a";

  return {
    label: statusName,
    color: statusColor,
    background: hexToRgba(statusColor, 0.12),
  };
}

function StatCard({ icon, label, value, helper }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </p>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">{value}</h3>
          <p className="mt-2 text-sm text-slate-500">{helper}</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-sm">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-2xl text-slate-500">
        <FaBoxOpen />
      </div>
      <h3 className="mt-5 text-2xl font-bold text-slate-900">No orders yet</h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
        Your recent purchases will appear here with invoice number, amount,
        date, and live status updates.
      </p>
    </section>
  );
}

export default async function OrdersPage() {
  const token = await getSessionToken();
  let orders = [];
  let errorMessage = "";

  if (token) {
    try {
      const { response, data } = await laravelFetch("/customer/orders", { token });

      if (response.ok) {
        orders = Array.isArray(data?.orders) ? data.orders : [];
      } else {
        errorMessage = data?.message || "Failed to load your orders.";
      }
    } catch (error) {
      errorMessage = error.message || "Failed to load your orders.";
    }
  }

  const totalAmount = orders.reduce(
    (sum, order) => sum + Number(order?.amount || 0),
    0
  );
  const pendingOrders = orders.filter(
    (order) => order?.status?.slug === "pending" || order?.status?.name === "Pending"
  ).length;
  const deliveredOrders = orders.filter(
    (order) =>
      order?.status?.slug === "delivered" || order?.status?.name === "Delivered"
  ).length;
  const latestInvoice = orders[0]?.invoice_id ? `#${orders[0].invoice_id}` : "N/A";

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#fffaf3_0%,#ffffff_45%,#eef6ff_100%)] shadow-sm">
        <div className="grid gap-8 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pry">
              Customer Orders
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">My order timeline</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Track every invoice in one place with a clearer status view, total
              amount, order note, and latest activity.
            </p>
          </div>

          
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<FaReceipt />}
          label="All Orders"
          value={orders.length}
          helper="Invoices available in your account"
        />
        <StatCard
          icon={<FaClock />}
          label="Pending"
          value={pendingOrders}
          helper="Orders waiting for next update"
        />
        <StatCard
          icon={<FaCheckCircle />}
          label="Delivered"
          value={deliveredOrders}
          helper="Orders marked as completed"
        />
        <StatCard
          icon={<FaArrowRight />}
          label="Total Amount"
          value={formatCurrency(totalAmount)}
          helper="Combined order value so far"
        />
      </section>

      {errorMessage ? (
        <section className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
            Orders
          </p>
          <h3 className="mt-2 text-xl font-bold text-rose-950">Unable to load orders</h3>
          <p className="mt-2 text-sm leading-6 text-rose-700">{errorMessage}</p>
        </section>
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <section className="grid gap-4 lg:hidden">
            {orders.map((order) => {
              const status = getOrderStatusMeta(order);

              return (
                <article
                  key={order.id}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Invoice
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-slate-900">
                        #{order.invoice_id}
                      </h3>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        color: status.color,
                        backgroundColor: status.background,
                      }}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Date
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Amount
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {formatCurrency(order.amount)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Discount
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {formatCurrency(order.discount)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Shipping
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {formatCurrency(order.shipping_charge)}
                      </p>
                    </div>
                  </div>

                  {order.note ? (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Note
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{order.note}</p>
                    </div>
                  ) : null}

                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <FaEye />
                    View Invoice
                  </Link>
                </article>
              );
            })}
          </section>

          <section className="hidden overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:block">
            <div className="border-b border-slate-100 px-6 py-5">
              <h3 className="text-xl font-bold text-slate-900">Recent orders</h3>
              <p className="mt-1 text-sm text-slate-500">
                A cleaner snapshot of invoice, amount, discount, note, and status.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-slate-500">
                    <th className="px-6 py-4 font-semibold">Invoice</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Discount</th>
                    <th className="px-6 py-4 font-semibold">Shipping</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Note</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => {
                    const status = getOrderStatusMeta(order);

                    return (
                      <tr key={order.id} className="align-top">
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-bold text-slate-900">#{order.invoice_id}</p>
                           
                          </div>
                        </td>
                        <td className="px-6 py-5 font-medium text-slate-700">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-5 font-semibold text-slate-900">
                          {formatCurrency(order.amount)}
                        </td>
                        <td className="px-6 py-5 text-slate-700">
                          {formatCurrency(order.discount)}
                        </td>
                        <td className="px-6 py-5 text-slate-700">
                          {formatCurrency(order.shipping_charge)}
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                            style={{
                              color: status.color,
                              backgroundColor: status.background,
                            }}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="max-w-xs px-6 py-5 text-slate-600">
                          <p className="max-w-xs leading-6">
                            {order.note || "No additional note for this order."}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Link
                            href={`/dashboard/orders/${order.id}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                          >
                            <FaEye />
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
