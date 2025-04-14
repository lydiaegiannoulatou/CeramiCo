import React from 'react';

const OrderSummary = ({ order }) => {
  if (!order) return null;

  const {
    _id,
    createdAt,
    paymentStatus,
    orderStatus,
    shippingAddress,
    items,
    totalCost,
    currency,
  } = order;

  return (
    <div className="border p-6 rounded-lg shadow-md bg-white mt-6">
      <h2 className="text-2xl font-bold mb-4">Order #{_id}</h2>
      <p><strong>Placed on:</strong> {new Date(createdAt).toLocaleDateString()}</p>
      <p><strong>Payment Status:</strong> {paymentStatus}</p>
      <p><strong>Order Status:</strong> {orderStatus}</p>

      <div className="my-4">
        <h3 className="font-semibold">Shipping Address:</h3>
        <p>{shippingAddress.fullName}</p>
        <p>{shippingAddress.addressLine1}</p>
        {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
        <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
        <p>{shippingAddress.country}</p>
        {shippingAddress.phone && <p>Phone: {shippingAddress.phone}</p>}
      </div>

      <div className="my-4">
        <h3 className="font-semibold mb-2">Items:</h3>
        {items.map((item, index) => (
          <div key={index} className="flex items-center border-b py-2">
            <img
              src={item.product_id.images[0]}
              alt={item.product_id.title}
              className="w-16 h-16 object-cover rounded mr-4"
            />
            <div className="flex-1">
              <p className="font-semibold">{item.product_id.title}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: €{item.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-bold text-green-600">
                €{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-right mt-6">
        <p className="text-xl font-bold">Total: €{totalCost.toFixed(2)} {currency}</p>
      </div>
    </div>
  );
};

export default OrderSummary;
