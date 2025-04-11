const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/paymentModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel'); // Import the Order model

// Create checkout session
const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch the user's cart
    const cart = await Cart.findOne({ user_id: userId }).populate(
      'items.product_id',
      'price title'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).send({ msg: 'Your cart is empty' });
    }

    // Prepare the line items for Stripe Checkout
    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product_id.title,
        },
        unit_amount: Math.round(item.product_id.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }));

    // Create the Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId: userId,
      },
    });

    // Return the session URL to redirect the user to Stripe Checkout
    res.status(200).send({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send({ msg: 'Error creating checkout session' });
  }
};

// Handle Stripe webhook to verify payment success
const handleStripeWebhook = async (req, res) => {
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log('Webhook signature verification failed.');
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;

    // Fetch the cart and create a payment record
    const cart = await Cart.findOne({ user_id: userId }).populate(
      'items.product_id',
      'price title'
    );

    const orderItems = cart.items.map(item => ({
      product_id: item.product_id._id,
      quantity: item.quantity,
      price: item.product_id.price,
    }));

    const totalCost = cart.items.reduce((acc, item) => acc + (item.quantity * item.product_id.price), 0);

    // Create the payment record
    const payment = new Payment({
      user_id: userId,
      orderItems,
      paymentMethod: 'stripe',
      totalCost,
      currency: 'EUR',
      paymentStatus: 'succeeded',
    });

    await payment.save();

    // Create the order record
    const order = new Order({
      user_id: userId,
      items: orderItems,
      totalCost,
      paymentStatus: 'succeeded',
      orderStatus: 'processing', // Can be updated later
    });

    await order.save();

    // Empty the cart after a successful order
    cart.items = [];
    await cart.save();
  }

  res.status(200).send({ received: true });
};

module.exports = {
  createCheckoutSession,
  handleStripeWebhook,
};
