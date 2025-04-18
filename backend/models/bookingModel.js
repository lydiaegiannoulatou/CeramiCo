const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema (
    {
        user_id:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // References User model
        class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true }, // References Class model
        date: { type: Date, required: true, default: Date.now }, // Defaults to current date
        status: { 
            type: String, 
            enum: ["pending", "confirmed", "canceled"], 
            default: "pending" 
        },
        paymentStatus: { 
            type: String, 
            enum: ["pending", "paid", "failed"], 
            default: "pending" 
        }
    },
    {
        timestamps:true
    }
)

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking