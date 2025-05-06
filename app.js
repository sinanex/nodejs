const express = require("express");
const pool = require("./config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET = "default_secret";

// ===================== PRODUCTS =====================

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM product"); // Fixed table name
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).send("Server error");
  }
});

app.post("/products", async (req, res) => {
  try {
    const { name, price, category, color, image, size, description, gender } =
      req.body;

    const query = `
      INSERT INTO product (name, price, category, color, image, size, description, gender)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      name,
      price,
      category,
      color,
      image,
      size,
      description,
      gender,
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting product:", error.message);
    res.status(500).send("Server error");
  }
});

// ===================== AUTH =====================

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    const token = jwt.sign({ userId: newUser.rows[0].id }, SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).send("Server error");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ===================== MIDDLEWARE =====================

function authenticate(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  jwt.verify(token, SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token." });
    req.user = user;
    next();
  });
}

// ===================== CART =====================

app.post("/cart", authenticate, async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.userId;
  console.log(user_id);
  try {
    await pool.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)",
      [user_id, product_id, quantity]
    );
    res.status(201).json({ message: "Added to cart" });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).send("Server error");
  }
});

app.get("/cart", authenticate, async (req, res) => {
  const user_id = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT c.id, p.name, p.price, c.quantity
       FROM cart c
       JOIN product p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get cart error:", error.message);
    res.status(500).send("Server error");
  }
});

// ===================== SERVER =====================

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
