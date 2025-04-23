import React from "react";

const OrderSummary = ({ order }) => {
  if (!order) return null;

  const {
    orderNumber,
    orderStatus,
    paymentStatus,
    totalCost,
    currency,
    user_id,
    items,
    createdAt,
  } = order;

  console.log("user_id:", user_id);
  
  return (
    <div className="border p-6 rounded-lg shadow-md bg-white mt-6">
      <h2 className="text-2xl font-bold mb-4">Order Confirmation</h2>
      <p>
        <strong>Order Number:</strong> {orderNumber}
      </p>
      <p>
        <strong>Status:</strong> {orderStatus}
      </p>
      <p>
        <strong>Payment Status:</strong> {paymentStatus}
      </p>
      <p>
        <strong>Total Cost:</strong> {totalCost} {currency}
      </p>
      <p>
        <strong>Order Date:</strong> {new Date(createdAt).toLocaleString()}
      </p>
      <h3 className="font-semibold mt-4">User Details:</h3>
      <p>
        <strong>Name:</strong> {user_id.name }
      </p>
      <p>
        <strong>Email:</strong> {user_id.email}
      </p>
      <h3 className="font-semibold mt-4">Items:</h3>
{Array.isArray(items) && items.length > 0 ? (
  <ul>
    {items.map((item, index) => (
      <li key={index} className="mb-2">
        <p><strong>Product:</strong> {item.product_id?.title || "N/A"}</p>
        <p>
          <img
            src={item.product_id?.images?.[0] || "https://via.placeholder.com/150"}
            alt={item.product_id?.title || "Product"}
            className="w-32 h-auto"
          />
        </p>
        <p><strong>Quantity:</strong> {item.quantity}</p>
        <p><strong>Price:</strong> {item.price} {currency}</p>
      </li>
    ))}
  </ul>
) : (
  <p>No items found in this order.</p>
)
}
</div>
)}


export default OrderSummary;
