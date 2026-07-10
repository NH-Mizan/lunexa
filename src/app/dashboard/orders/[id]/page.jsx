import InvoiceActions from "@/components/Dashboard/InvoiceActions";
import { getAssetUrl } from "@/lib/api";
import { getSessionToken, laravelFetch } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

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
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(value));
}

function getLineTotal(item) {
  return Number(item?.sale_price || 0) * Number(item?.qty || 0);
}

function getVariantText(item) {
  const parts = [];

  if (item?.product_size) {
    parts.push(`Size: ${item.product_size}`);
  }

  if (item?.product_color) {
    parts.push(`Color: ${item.product_color}`);
  }

  return parts.join(" | ");
}

function BarcodeBlock() {
  return (
    <div className="flex h-14 items-end gap-[3px]">
      {Array.from({ length: 24 }).map((_, index) => (
        <span
          key={index}
          className="block rounded-full bg-black"
          style={{
            width: index % 4 === 0 ? "4px" : "2px",
            height: `${26 + ((index * 11) % 28)}px`,
          }}
        />
      ))}
    </div>
  );
}

function SummaryRow({ label, value, strong }) {
  return (
    <div className="grid grid-cols-[1fr_120px] border-b border-slate-300 last:border-b-0">
      <div className="px-4 py-2 text-sm font-semibold text-slate-700">{label}</div>
      <div
        className={`border-l border-slate-300 px-4 py-2 text-right text-sm ${
          strong ? "font-bold text-slate-950" : "font-semibold text-slate-700"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default async function OrderInvoicePage({ params }) {
  const token = await getSessionToken();

  if (!token) {
    notFound();
  }

  const { id } = await params;
  let invoiceData = null;

  try {
    const { response, data } = await laravelFetch(`/customer/invoice/${id}`, { token });

    if (!response.ok || !data?.order) {
      notFound();
    }

    invoiceData = data;
  } catch {
    notFound();
  }

  const { order, owner, companyinfo } = invoiceData;
  const items = Array.isArray(order?.orderdetails) ? order.orderdetails : [];
  const subtotal = items.reduce((sum, item) => sum + getLineTotal(item), 0);
  const logo = getAssetUrl(owner?.dark_logo || owner?.white_logo);
  const transactionDate = formatDate(order?.payment?.created_at || order?.created_at);

  return (
    <div className="mx-auto max-w-[980px]">
      <div className="mb-3 flex items-center justify-between gap-3 print:hidden">
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-pry"
        >
          <FaArrowLeft />
          Back To Order
        </Link>
        <InvoiceActions />
      </div>

      <section className="overflow-hidden rounded-[1.25rem] border border-slate-300 bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none">
        <div className="px-5 py-6 text-slate-900 print:px-0 print:py-0">
          <div className="print:px-5 print:pt-4">
            <div className="grid gap-6 md:grid-cols-[1fr_220px]">
              <div className="relative h-20 w-44">
                <Image
                  src={logo}
                  alt={owner?.name || "Sell Pixer"}
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>

              <div className="text-right">
                <div className="mb-4 flex justify-end">
                  <BarcodeBlock />
                </div>
                <p className="text-sm font-semibold">
                  ইনভয়েস আইডি : <span className="font-bold">#{order?.invoice_id}</span>
                </p>
                <p className="mt-1 text-sm font-semibold">
                  অর্ডার টাইম : <span className="font-bold">{formatDate(order?.created_at)}</span>
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 text-sm leading-7 md:grid-cols-3">
              <div>
                <h3 className="mb-2 text-base font-bold">বিক্রেতা</h3>
                <p>{owner?.name || "Sell Pixer"}</p>
                <p>{companyinfo?.email || companyinfo?.hotmail || "N/A"}</p>
                <p>{companyinfo?.phone || companyinfo?.hotline || "N/A"}</p>
                <p>{companyinfo?.address || "Address unavailable"}</p>
              </div>

              <div className="md:px-2">
                <p className="mt-8 text-center text-sm md:mt-10">
                  <span className="font-semibold">Note :</span>{" "}
                  {order?.note || "No order note available"}
                </p>
              </div>

              <div className="text-left md:text-right">
                <h3 className="mb-2 text-base font-bold">পণ্য ডেলিভারি ঠিকানা</h3>
                <p>{order?.shipping?.name || order?.customer?.name || "Customer"}</p>
                <p>{order?.shipping?.phone || order?.customer?.phone || "N/A"}</p>
                <p>{order?.customer?.district || order?.shipping?.address || "N/A"}</p>
                <p>{order?.customer?.address || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-300 pt-3 print:px-5">
            <div className="grid grid-cols-[52px_minmax(0,1fr)_110px_110px] items-center gap-3 border-b border-slate-300 pb-2 text-xs font-bold text-slate-700">
              <p>ছবি</p>
              <p>বিবরণ</p>
              <p className="text-right">পরিমান</p>
              <p className="text-right">মোট মূল্য</p>
            </div>

            <div>
              {items.map((item) => {
                const productImage = getAssetUrl(item?.image?.image);
                const variantText = getVariantText(item);

                return (
                  <div
                    key={item.id}
                    className="grid break-inside-avoid grid-cols-[52px_minmax(0,1fr)_110px_110px] items-start gap-3 border-b border-slate-200 py-2.5 text-sm"
                  >
                    <div className="relative h-7 w-7 overflow-hidden rounded border border-slate-200 bg-slate-50">
                      <Image
                        src={productImage}
                        alt={item?.product_name || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="leading-5 text-slate-900">{item?.product_name}</p>
                      {variantText ? (
                        <p className="mt-1 text-xs leading-4 text-slate-500">{variantText}</p>
                      ) : null}
                    </div>

                    <div className="text-right leading-5 text-slate-700">
                      {item?.qty} x {formatCurrency(item?.sale_price)}
                    </div>

                    <div className="text-right leading-5 text-slate-700">
                      {formatCurrency(getLineTotal(item))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-2 grid gap-5 md:grid-cols-[1fr_280px] print:px-5">
            <div />

            <div className="overflow-hidden border border-slate-300">
              <SummaryRow label="পণ্যের মোট মূল্য" value={formatCurrency(subtotal)} />
              <SummaryRow
                label="ডেলিভারি চার্জ (+)"
                value={formatCurrency(order?.shipping_charge)}
              />
              <SummaryRow label="ছাড় (-)" value={formatCurrency(order?.discount)} />
              <SummaryRow label="সর্বমোট যোগ" value={formatCurrency(order?.amount)} />
              <SummaryRow label="পরিশোধ" value="৳ 0" />
              <SummaryRow label="বাকি" value={formatCurrency(order?.amount)} strong />
            </div>
          </div>

          <div className="mt-5 print:px-5">
            <div className="overflow-hidden border border-slate-300">
              <div className="grid grid-cols-5 bg-white text-xs text-slate-700">
                <div className="border-r border-slate-300 px-3 py-2 font-medium">
                  Transaction Date
                </div>
                <div className="border-r border-slate-300 px-3 py-2 font-medium">
                  Payment Gateway
                </div>
                <div className="border-r border-slate-300 px-3 py-2 font-medium">
                  Transaction ID
                </div>
                <div className="border-r border-slate-300 px-3 py-2 font-medium">
                  Account Number
                </div>
                <div className="px-3 py-2 text-right font-medium">Amount</div>
              </div>

              <div className="grid grid-cols-5 text-sm text-slate-800">
                <div className="border-r border-t border-slate-300 px-3 py-2.5">
                  {transactionDate}
                </div>
                <div className="border-r border-t border-slate-300 px-3 py-2.5">
                  {order?.payment?.payment_method || "N/A"}
                </div>
                <div className="border-r border-t border-slate-300 px-3 py-2.5">
                  {order?.payment?.trx_id || ""}
                </div>
                <div className="border-r border-t border-slate-300 px-3 py-2.5">
                  {order?.payment?.sender_number || ""}
                </div>
                <div className="border-t border-slate-300 px-3 py-2.5 text-right">
                  {formatCurrency(order?.payment?.amount || order?.amount)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-300 pt-5 text-center print:px-5 print:pb-5">
            <h3 className="text-[1.75rem] font-semibold italic text-slate-950">
              Terms &amp; Conditions
            </h3>
            <p className="mt-2 text-sm italic text-slate-700">
              This is a computer generated invoice, does not require any signature.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
