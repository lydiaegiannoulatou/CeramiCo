const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const saltRound = Number(process.env.SALT_ROUND);
const secretKey = process.env.SECRET_KEY
//LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = email || username;
    if (!identifier || !password) {
      return res
        .status(409)
        .send({ msg: "Username/Email and Password are required fields" });
    }
    let isUserRegistered = await User.findOne({ $or: [{ email }, { username }] });
    if (!isUserRegistered) {
      return res
        .status(400)
        .send({ msg: "User not found, please create an account first." });
    }
    let isPasswordCorrect = await bcrypt.compare(
      password,
      isUserRegistered.password
    );
    if (!isPasswordCorrect) {
      return res.status(500).send({ msg: "Wrong password. Please try again" });
    }
//__________token___________
let payload = {
  userId : isUserRegistered._id,
  email : isUserRegistered.email,
} 
let token = await jwt.sign(payload, secretKey )
console.log(token);

    return res.send({ msg: "Login Successfully!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error, msg: "Cannot login right now, please try later" });
  }
};

//USER REGISTRATION
const registerUser = async (req, res) => {
  try {
    const { name, email, password, username, address, phone, enrolled } =
      req.body;
    if (!name || !email || !password || !username) {
      return res
        .status(400)
        .send({ msg: "Please fill all the required fields" });
    }
    let isUserExist = await User.findOne({ $or: [{ email }, { username }] });
    if (isUserExist) {
      return res.status(409).send({
        msg: "This email/username is already used by a user. Please login, or register with a new email",
      });
    }
    let hashedPassword = await bcrypt.hash(password, saltRound);
    await User.create({
      name,
      email,
      password: hashedPassword,
      username,
      address,
      phone,
      enrolled,
    });
    console.log("registration successfully");

    return res.status(201).send({ msg: "Thank you for registering!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error, msg: "Cannot register user right now, please try later" });
  }
};

module.exports = { loginUser, registerUser };
