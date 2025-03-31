const express = require("express");
const cors = require("cors");

const authMiddleware = require('./middleware/authMiddleware')
const main = require('./config/connection')
const userRoutes = require ("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")

const app = express();
const port = process.env.PORT || 8000;


app.use(express.json());
app.use(cors());

main();

app.use("/user", userRoutes);
app.use("/shop", productRoutes)


app.listen(port, () => console.log(`Server is listening on port ${port}`));