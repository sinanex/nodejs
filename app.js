const express = require("express");
const pool = require("./config/db");

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

app.listen(9000, () => {
  console.log(`Server running on port`);
});
