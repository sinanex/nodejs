const express = require("express");
const userController = require("../controller/userController");

const routes = express.Router();

routes.post("/register", userController.register);
routes.post("/login", userController.login);
routes.get("/all", userController.getAllUsers);

module.exports = routes;
