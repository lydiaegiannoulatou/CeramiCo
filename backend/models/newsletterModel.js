const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});

const NewsletterSubscription = mongoose.model("NewsletterSubscription", subscriptionSchema);
module.exports = NewsletterSubscription;
