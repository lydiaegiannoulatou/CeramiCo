import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your public key
const stripePromise = loadStripe('pk_test_51RCickP5MlnStApGEm2SdnAmS65Wh2jxkx7RP7PxCuEXdgXbMPwiju9EGciz8fkLlzUt4v0142OO2osCuztOTOod00q4JqycKH');

const CheckoutPage = ({ cart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if cart is empty
    if (!cart || cart.items.length === 0) {
      setError('Your cart is empty.');
    }
  }, [cart]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      
      const response = await axios.post('http://localhost:3050/cart/create-checkout-session', { cart }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const { sessionId } = response.data;

      // Redirect to Stripe checkout page
      const stripe = await stripePromise;
      stripe.redirectToCheckout({ sessionId });

    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError('Failed to start checkout.');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      {error && <div className="text-red-500 text-center mb-6">{error}</div>}

      {/* Cart summary */}
      <div className="space-y-6">
        {cart.items.map((item) => {
          const { product_id, quantity } = item;
          return (
            <div key={product_id._id} className="flex items-center border-b pb-4 mb-4">
              <img
                src={product_id.images[0]}
                alt={product_id.title}
                className="w-24 h-24 object-cover rounded-lg mr-6"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{product_id.title}</h2>
                <p className="text-lg text-gray-600">Price: €{product_id.price}</p>
                <p className="text-lg text-gray-600">Quantity: {quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  €{(product_id.price * quantity).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Price */}
      <div className="flex justify-between items-center py-4 mt-6 border-t">
        <h2 className="text-2xl font-semibold">Total:</h2>
        <p className="text-xl font-bold text-green-600">
          €{cart.items.reduce((acc, item) => acc + item.quantity * item.product_id.price, 0).toFixed(2)}
        </p>
      </div>

      {/* Checkout Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleCheckout}
          className="bg-blue-500 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
