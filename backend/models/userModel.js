const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true},
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
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