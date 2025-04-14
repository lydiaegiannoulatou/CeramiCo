const Order = require("../models/orderModel");

const getOrder = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const order = await Order.findOne({ stripeSessionId: sessionId })
      .populate("items.product_id", "title images price");

    if (!order) {
      return res.status(404).send({ msg: "Order not found" });
    }

    res.status(200).send({ msg: "Order fetched successfully", order });
  } catch (error) {
    console.error("Error fetching order by sessionId:", error);
    res.status(500).send({ msg: "Something went wrong" });
  }
};

module.exports = { getOrder };
