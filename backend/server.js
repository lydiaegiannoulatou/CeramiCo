const express = require("express");
const cors = require("cors");
// const path = require("path");

const main = require("./config/connection");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const newsletterRoutes = require("./routes/emailRoutes");
const galleryRoutes = require("./routes/galleryRoutes")
const exhibitionRoutes = require("./routes/exhibitionRoutes");
const workshopRoutes = require("./routes/workshopRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const { stripeWebhook } = require("./controllers/paymentController");

const app = express();
const port = process.env.PORT || 8000;


app.post(
  "/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);


app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://ceramico.onrender.com'], 
  credentials: true,
}));

main();


app.use("/user", userRoutes);
app.use("/shop", productRoutes);
app.use("/cart", cartRoutes);
app.use("/payment", paymentRoutes);
app.use("/order", orderRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/gallery", galleryRoutes)
app.use("/exhibitions", exhibitionRoutes);
app.use("/workshops", workshopRoutes);
app.use("/bookings", bookingRoutes);




require("./cron/completeBookings");

app.listen(port, () => console.log(`Server is listening on port ${port}`));
