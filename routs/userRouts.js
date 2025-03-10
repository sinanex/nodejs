const User = require("../model/usermodel");
const express = require("express");
const bcrypt = require("bcryptjs"); // ✅ Import bcryptjs

const routes = express.Router();

routes.post("/register", async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    if (!req.body) {
      return res.status(400).send({ message: "Request body is missing" });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();

    return res
      .status(201)
      .send({ message: "User created successfully", user: newUser });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

routes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send({ message: "email and password is required" });
    }
    const userEmail = await User.findOne({ email });
    if (!userEmail) {
      return res.status(400).send({ message: "no user found" });
    }
    const isMatch = await bcrypt.compare(password, userEmail.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    return res.status(200).send({ message: "Login successful" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

routes.get("/all", async (req, res) => {
  try {
    const users = await User.find();

    return res.json(users);
  } catch (error) {
    return res.send({ error: error.message });
  }
});
module.exports = routes;
