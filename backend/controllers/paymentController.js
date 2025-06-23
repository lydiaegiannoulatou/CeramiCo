const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const {
  sendOrderConfirmationEmail,
  sendWorkshopBookingConfirmationEmail,
} = require("../controllers/emailController");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Workshop = require("../models/workshopModel");
const Cart = require("../models/cartModel");
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");


const createCheckoutSession = async (req, res) => {
  const { items, shippingAddress } = req.body;
  const userId = req.user.userId;
  const userEmail = req.user.email;

  try {
    const line_items = [];
    const productItems = [];
    const bookings = [];

    let sessionType = "";

    for (const item of items) {
      if (item.type === "product") {
        const product = await Product.findById(item.id);
        if (!product || !product.stripePriceId) {
          throw new Error(`Invalid product or missing Stripe price ID`);
        }
        if (item.quantity > product.stock) {
          throw new Error(`Insufficient stock for product: ${product.title}`);
        }

        line_items.push({
          price: product.stripePriceId,
          quantity: item.quantity,
        });

        productItems.push({
          type: "product",
          product_id: product._id,
          quantity: item.quantity,
          price: product.price,
        });
        sessionType = "product";
      } else if (item.type === "workshop") {
        const workshop = await Workshop.findById(item.id);
        const session = workshop.sessions.id(item.sessionId);

        if (!workshop || !session) {
          throw new Error("Invalid workshop or session");
        }

        line_items.push({
          price_data: {
            currency: "EUR",
            product_data: {
              name: `${workshop.title} - ${new Date(
                session.sessionDate
              ).toLocaleString()}`,
              description: "Workshop booking",
            },
            unit_amount: Math.round(workshop.price * 100),
          },
          quantity: 1,
        });

        bookings.push({
          user_id: userId,
          workshop_id: workshop._id,
          sessionId: session.id,
          image: workshop.image,
          date: session.sessionDate,
          price: workshop.price,
        });
        sessionType = "workshop";
      }
    }

    const totalCost =
      [...productItems].reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ) + bookings.reduce((acc, b) => acc + b.price * 100, 0);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: userEmail,
      success_url: `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}&type=${sessionType}`,
      cancel_url: `${process.env.DOMAIN}/cancel`,
    });

    if (productItems.length > 0) {
      const newOrder = new Order({
        user_id: userId,
        items: productItems,
        shippingAddress,
        totalCost,
        paymentStatus: "pending",
        stripeSessionId: session.id,
        currency: "EUR",
      });
      await newOrder.save();
    }

    for (const b of bookings) {
      const booking = new Booking({
        ...b,
        stripeSessionId: session.id,
        status: "pending",
        paymentStatus: "pending",
      });
      await booking.save();
    }

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ msg: "Error creating checkout session" });
  }
};

const stripeWebhook = async (req, res) => {

  const sig = req.headers["stripe-signature"];

  
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
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

        for (const item of order.items) {
          if (item.type === "product") {
            const product = await Product.findById(item.product_id);
            if (product) {
              product.stock = Math.max(0, product.stock - item.quantity);
              await product.save();
            }
          }
        }
      }

      const userId =
        order?.user_id ||
        (await User.findOne({ email: session.customer_email }))?._id;
      const bookings = await Booking.find({ stripeSessionId: session.id });

      for (const booking of bookings) {
        const workshop = await Workshop.findById(booking.workshop_id);
        const sessionIndex = workshop.sessions.findIndex(
          (s) =>
            new Date(s.sessionDate).getTime() ===
            new Date(booking.date).getTime()
        );

        if (sessionIndex !== -1) {
          workshop.sessions[sessionIndex].bookedSpots += 1;
          await workshop.save();

          booking.status = "confirmed";
          booking.paymentStatus = "paid";
          booking.paymentIntentId = session.payment_intent;
          await booking.save();
        }
      }
      const user = await User.findOne({ email: session.customer_email });
      if (order && user) {
        const orderDetails = order.items
          .map((item) => `• ${item.quantity} x Product ID: ${item.product_id}`)
          .join("\n");

        await sendOrderConfirmationEmail(user, orderDetails);
      }

      if (bookings.length > 0 && user) {
        const bookingDetails = bookings
          .map(
            (b) =>
              `• ${new Date(b.date).toLocaleString()} - Workshop ID: ${
                b.workshop_id
              }`
          )
          .join("\n");

        await sendWorkshopBookingConfirmationEmail(user, bookingDetails);
      }

      await Cart.findOneAndDelete({ user_id: userId });
    } catch (err) {
      console.error("❌ Error handling webhook:", err);
    }
  }

  res.status(200).send("Webhook processed");
};

module.exports = {
  createCheckoutSession,
  stripeWebhook,
};
