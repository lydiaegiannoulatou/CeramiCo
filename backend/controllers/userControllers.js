const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const saltsRound = Number(process.env.SALT_ROUND);






const loginUser = async (req,res) => {
try {
    
} catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error, msg: "Cannot login right now, please try later" });
  }
}


//USER REGISTRATION
const registerUser = async (req, res) => {
  try {
    const { name, email, password, userName, address, phone, enrolled } =
      req.body;
    if (!name || !email || !password || !userName) {
      return res
        .status(400)
        .send({ msg: "Please fill all the required fields" });
    }
    let isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res
        .status(409)
        .send({
          msg: "This email is already used by a user. Please login, or register with a new email",
        });
    }
    let hashedPassword = await bcrypt.hash(password, saltsRound);
    await User.create({
      name,
      email,
      password: hashedPassword,
      userName,
      address,
      phone,
      enrolled,
    });
    console.log("registration successfully");

    return res.send({ msg: "Thank you for registering!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error, msg: "Cannot register user right now, please try later" });
  }
};

module.exports = { loginUser, registerUser };
