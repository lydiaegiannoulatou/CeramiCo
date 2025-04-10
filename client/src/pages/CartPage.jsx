import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cart, setCart] = useState(null); // Store the cart data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch the cart when the component mounts
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token'); // Get the token from localStorage

      try {
        const response = await axios.get('/api/cart/get-cart', {
          headers: {
            'Authorization': `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        if (response.data.success) {
          setCart(response.data.cart); // Set the cart data to state
        } else {
          setError(response.data.msg); // Set error message if cart retrieval failed
        }
      } catch (err) {
        console.log(err);
        
        setError('Error fetching cart data.'); // Set general error message
      } finally {
        setLoading(false); // Set loading to false after the request
      }
    };

    fetchCart(); // Call the fetch function
  }, []);

  // If cart is still loading, display a loading message
  if (loading) {
    return <div>Loading your cart...</div>;
  }

  // If there is an error, display the error message
  if (error) {
    return <div>{error}</div>;
  }

  // If no cart data found
  if (!cart || cart.items.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {/* Cart items */}
      <div className="cart-items">
        {cart.items.map((item) => {
          const { product_id, quantity } = item;
          return (
            <div key={product_id._id} className="cart-item">
              <img
                src={product_id.images[0]} // Display the first image of the product
                alt={product_id.title}
                className="product-image"
              />
              <div className="cart-item-details">
                <h2>{product_id.title}</h2>
                <p>Price: ${product_id.price}</p>
                <p>Quantity: {quantity}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Price */}
      <div className="cart-total">
        <h2>Total: ${cart.items.reduce((acc, item) => acc + item.quantity * item.product_id.price, 0).toFixed(2)}</h2>
      </div>

      {/* Checkout Button */}
      <div className="cart-actions">
        <button className="checkout-button">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
