const express = require("express");
const pool = require("./config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM product");
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

app.post("/products", async (req, res) => {
  try {
    const { name, price, catogary, color, image, size, description, gender } =
      req.body;

    const query = `
        INSERT INTO product (name, price, catogary, color, image, size, description, gender)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
    const values = [
      name,
      price,
      catogary,
      color,
      image,
      size,
      description,
      gender,
    ];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting product:", error.message);
    res.status(500).send(error.message);
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );
    const token = jwt.sign(
      { id: newUser.rows[0].id },
      "process.env.JWT_SECRET",
      { expiresIn: "1h" }
    );
    res
      .status(201)
      .json({ message: "User registered successfully", token: token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
app.listen(9000, () => {
  console.log(`Server running on port`);
});
