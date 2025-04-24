import React from "react";
import clsx from "clsx";

const OrderSummary = ({ order }) => {
  if (!order) return null;

  const {
    orderNumber,
    orderStatus,
    paymentStatus,
    totalCost,
    currency,
    user_id,
    items = [],
    shippingAddress,
    createdAt,
  } = order;

  /* ---------- helpers ---------- */
  const badge = (state) =>
    clsx(
      "inline-block rounded-full px-3 py-0.5 text-xs font-medium ring-1",
      {
        pending:  "bg-yellow-50 text-yellow-700 ring-yellow-300",
        paid:     "bg-emerald-50 text-emerald-700 ring-emerald-300",
        shipped:  "bg-sky-50 text-sky-700 ring-sky-300",
        delivered:"bg-purple-50 text-purple-700 ring-purple-300",
        cancelled:"bg-rose-50 text-rose-700 ring-rose-300",
      }[state] || "bg-gray-100 text-gray-600 ring-gray-300"
    );

  /* ---------- component ---------- */
  return (
    <section className="relative mx-auto max-w-5xl bg-white/70 p-8 rounded-3xl backdrop-blur-lg">
      {/* top‑right frosted blob */}
      <div className="absolute right-0 top-0 -z-10 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* header */}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-800">
          Order&nbsp;#{orderNumber}
        </h2>
        <h3 className="text-lg font-semibold text-gray-700">Payment Successful!</h3>
        <div className="flex gap-2">
          <span className={badge(orderStatus)}>{orderStatus}</span>
          <span className={badge(paymentStatus)}>{paymentStatus}</span>
        </div>
      </header>

      {/* meta grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-sm">
        <Meta label="Date">
          {new Date(createdAt).toLocaleString()}
        </Meta>
        <Meta label="Total">
          {totalCost.toFixed(2)} {currency}
        </Meta>
        <Meta label="Customer">
          {user_id?.name}
          <br />
          <span className="text-gray-500">{user_id?.email}</span>
        </Meta>
        {shippingAddress && (
          <Meta label="Ship to">
            {shippingAddress.fullName}
            <br />
            {shippingAddress.addressLine1}
            {shippingAddress.addressLine2 && <>, {shippingAddress.addressLine2}</>}
            <br />
            {shippingAddress.city}, {shippingAddress.postalCode}
            <br />
            {shippingAddress.country}
          </Meta>
        )}
      </div>

      {/* items list */}
      <h3 className="mt-12 mb-4 text-lg font-semibold tracking-tight text-gray-700">
        Items&nbsp;<span className="text-gray-400">({items.length})</span>
      </h3>

      <ul className="divide-y divide-gray-200">
        {items.map((item, idx) => {
          const product = item.product_id;
          return (
            <li
              key={idx}
              className="group flex flex-wrap items-center gap-4 py-6 transition-colors hover:bg-gray-50/60"
            >
              <img
                src={
                  product?.images?.[0] ??
                  "https://via.placeholder.com/120?text=No+Image"
                }
                alt={product?.title ?? "Product"}
                className="h-24 w-24 flex-none rounded-xl object-cover"
              />

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="truncate text-base font-medium text-gray-800">
                  {product?.title ?? "Untitled product"}
                </p>
                <p className="text-sm text-gray-500">
                  Qty&nbsp;{item.quantity}
                </p>
              </div>

              <p className="ml-auto text-base font-semibold tracking-wide">
                {item.price.toFixed(2)}&nbsp;{currency}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

/* ========= sub‑components ========= */
const Meta = ({ label, children }) => (
  <div>
    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <div className="text-gray-800">{children}</div>
  </div>
);

export default OrderSummary;
