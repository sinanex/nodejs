const express = require("express");


const userRouts = require("./routs/userRouts");

const app = express();
app.use(express.json());
app.use("/users", userRouts);


app.get("/", (req, res) => {
  res.send("server running success");
});
app.listen(9000, () => console.log("server running"));
