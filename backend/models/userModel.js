const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        address: String,
        phone: String,
        enrolled: { type: Boolean, default: false },
        role: { 
            type: String, 
            enum: ["user", "admin"],  // Only allows "user" or "admin"
            default: "user" 
        }
    },
    {
        timestamps: true, 
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;