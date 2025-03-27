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

// // 🔥 **Prevent Duplicate Bookings**
// bookingSchema.index({ user_id: 1, class_id: 1 }, { unique: true });

// // 💾 **Set Booking Date to Class Date (if applicable)**
// bookingSchema.pre("save", async function (next) {
//     if (!this.date) {
//         const Class = mongoose.model("Class");
//         const classData = await Class.findById(this.class_id);
//         if (classData?.date) {
//             this.date = classData.date; // Set booking date to class date
//         }
//     }
//     next();
// });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking