const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Workshop = require("../models/WorkshopModel");
const Cart = require("../models/cartModel");

// Create Checkout Session
const createCheckoutSession = async (req, res) => {
  const { items, shippingAddress } = req.body;
  const userId = req.user.userId;

  try {
    // Validate and format line_items
    const line_items = await Promise.all(
      items.map(async (item) => {
        if (item.type === "product") {
          const product = await Product.findById(item.id);
          if (!product) throw new Error(`Product not found: ${item.id}`);

          if (!product.stripePriceId) {
            throw new Error(
              `Product ${item.id} does not have a valid Stripe price ID.`
            );
          }

          if (item.quantity > product.stock) {
            throw new Error(
              `Requested quantity for ${product.title} exceeds available stock.`
            );
          }

          return {
            price: product.stripePriceId,
            quantity: item.quantity,
          };
        } else if (item.type === "workshop") {
          const workshop = await Workshop.findById(item.id);
          if (!workshop) throw new Error(`Workshop not found: ${item.id}`);

          return {
            price_data: {
              currency: "EUR",
              product_data: {
                name: workshop.title,
                description: `Workshop on ${workshop.sessionDate}`,
              },
              unit_amount: item.price * 100,
            },
            quantity: item.quantity,
          };
        } else {
          throw new Error(`Invalid item type: ${item.type}`);
        }
      })
    );

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      customer_email: req.user.email,
      success_url: `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/cancel`,
    });

    // Save order to DB
    const newOrder = new Order({
      user_id: userId,
      items: items.map((item) => ({
        type: item.type,
        quantity: item.quantity,
        price: item.price,
        ...(item.type === 'product' && { product_id: item.id }),
        ...(item.type === 'workshop' && { workshop_id: item.id }),
      })),
      totalCost: items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      paymentStatus: "pending",
      shippingAddress,
      stripeSessionId: session.id,
      currency: "EUR",
    });

    await newOrder.save();

    // Respond with session URL for redirect
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ msg: err.message || "Error creating checkout session" });
  }
};

// Stripe Webhook (to handle payment updates)
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("✅ Webhook received:", event.type);
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const order = await Order.findOne({ stripeSessionId: session.id });

      if (order) {
        order.paymentStatus = "paid";
        order.stripePaymentIntentId = session.payment_intent;
        await order.save();
        console.log(order.items);

        //  Update stock
        for (const item of order.items) {
          const product = await Product.findById(item.product_id);
          if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
            await product.save();
          }
        }

        if (item.type === "workshop") {
          const workshop = await Workshop.findById(item.workshop_id);
          if (workshop) {
            workshop.bookedSpots = Math.max(
              0,
              workshop.bookedSpots + item.quantity
            );
            await workshop.save();
          }
        }

        // Clear cart
        await Cart.findOneAndDelete({ user_id: order.user_id });

        console.log(
          `✅ Payment succeeded, stock updated and cart cleared for user: ${order.user_id}`
        );
      }
    } catch (err) {
      console.error("Error during webhook processing:", err);
    }
  }

  res.status(200).send("Webhook received");
};

module.exports = {
  createCheckoutSession,
  stripeWebhook,
};
