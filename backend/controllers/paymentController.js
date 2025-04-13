const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

// Create Checkout Session
const createCheckoutSession = async (req, res) => {
  const { items, shippingAddress } = req.body;
  const userId = req.user.userId; 

  try {
    // Validate and format line_items
    const line_items = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product_id);
        if (!product) throw new Error(`Product not found: ${item.product_id}`);
        
        if (!product.stripePriceId) {
          throw new Error(`Product ${item.product_id} does not have a valid Stripe price ID.`);
        }

        return {
          price: product.stripePriceId,
          quantity: item.quantity,
        };
      })
    );

    // Calculate total cost
    const totalCost = items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Create a PaymentIntent (this will generate a client secret)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100, // Convert to smallest unit (e.g., cents for USD)
      currency: 'eur', // or your currency of choice
      metadata: { userId, items: JSON.stringify(items), shippingAddress: JSON.stringify(shippingAddress) },
    });

    // Save the order to the database (with the payment intent)
    const newOrder = new Order({
      user_id: userId,
      items,
      totalCost,
      paymentStatus: 'pending',
      shippingAddress,
      stripePaymentIntentId: paymentIntent.id,
    });

    await newOrder.save();

    // Send the client secret and session URL to the frontend
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,  // Return the client secret to use on the frontend
      url: `${process.env.DOMAIN}/success?session_id=${paymentIntent.id}`,  // You can customize this success URL
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message || 'Error creating checkout session' });
  }
};

// Stripe Webhook (to handle payment updates)
const stripeWebhook = async (req, res) => {
  console.log('🚨 Stripe webhook received');
  console.log('Headers:', req.headers);
  console.log('Raw body:', req.rawBody?.toString?.());

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('✅ Verified webhook event:', event.type);
  } catch (err) {
    console.error('❌ Stripe webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log(`💰 PaymentIntent for ${paymentIntent.amount_received} was successful!`);

    // Update the order status to 'succeeded' in your database
    try {
      const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
      if (order) {
        order.paymentStatus = 'succeeded';
        await order.save();

        // Clear the cart for the user after successful payment
        await Cart.findOneAndDelete({ user_id: order.user_id });
      }
    } catch (err) {
      console.error('Error during webhook processing:', err);
    }
  }

  res.status(200).send('Webhook received');
};

module.exports = {
  createCheckoutSession,
  stripeWebhook,
};
