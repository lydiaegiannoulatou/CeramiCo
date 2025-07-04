const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const saltRound = Number(process.env.SALT_ROUND);
const secretKey = process.env.SECRET_KEY;
//LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = email || username;
    if (!identifier || !password) {
      return res
        .status(400)
        .send({ msg: "Username/Email and Password are required fields" });
    }
    let isUserRegistered = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (!isUserRegistered) {
      return res.status(400).send({
        msg: "User not found. Please check your Username/Email or create a new account.",
      });
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
      userId: isUserRegistered._id,
      email: isUserRegistered.email,
      role: isUserRegistered.role,
    };
    let token = await jwt.sign(payload, secretKey, { expiresIn: "2h" });
    console.log(token);

    return res.send({ msg: "Login Successfully!", token });
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
    const { name, email, password, username, enrolled, role } = req.body;
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
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      username,
      enrolled,
      role,
    });

    //Generate token
    const payload = {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: "4h" });

    console.log("registration successfully");

    return res.status(201).send({ msg: "Thank you for registering!", token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error, msg: "Cannot register user right now, please try later" });
  }
};

//GET USER

const userProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).send({ msg: "User not found." });
    }

    res.json({
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Server error." });
  }
};

module.exports = { loginUser, registerUser, userProfile };
