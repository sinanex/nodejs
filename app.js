const express = require("express");
const mongoose = require("mongoose");

const userRouts = require("./routs/userRouts");
mongoose
  .connect("mongodb://localhost:27017/users")
  .then(() => {
    console.log("db conncted success");
  })
  .catch((err) => console.log("db connection error", err));

const app = express();
app.use(express.json());
app.use("/users", userRouts);


app.get("/", (req, res) => {
  res.send("server running success");
});
app.listen(9000, () => console.log("server running"));
