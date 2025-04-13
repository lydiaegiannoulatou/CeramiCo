const express = require("express");
const cors = require("cors");

const main = require("./config/connection");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const {stripeWebhook} = require("./controllers/paymentController")
const app = express();
const port = process.env.PORT || 8000;



app.post('/payment/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    console.log('Webhook hit!');
    console.log('Request body:', req.body);  // Logs body of incoming request
    res.status(200).send('OK');
  });
  
  
// app.post('/payment/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());
app.use(cors());

main();

app.use("/user", userRoutes);
app.use("/shop", productRoutes);
app.use("/cart", cartRoutes);
app.use("/payment", paymentRoutes);

app.listen(port, () => console.log(`Server is listening on port ${port}`));
