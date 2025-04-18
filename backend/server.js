const express = require("express");
require("dotenv").config();
const cors = require("cors");

const main = require("./config/connection");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const exhibitionRoutes = require("./routes/exhibitionRoutes");
const classRoutes = require("./routes/classRoutes")
const bookingRoutes = require("./routes/bookingRoutes")
const { stripeWebhook } = require("./controllers/paymentController");
const app = express();
const port = process.env.PORT || 8000;

app.post(
  "/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());
app.use(cors());

main();

app.use("/user", userRoutes);
app.use("/shop", productRoutes);
app.use("/cart", cartRoutes);
app.use("/payment", paymentRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/exhibitions", exhibitionRoutes);
app.use("/workshops",classRoutes)
app.use("/bookings", bookingRoutes)

app.listen(port, () => console.log(`Server is listening on port ${port}`));
