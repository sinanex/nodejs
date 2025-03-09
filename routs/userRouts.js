const User = require('../model/usermodel');
const express = require('express');
const routes = express.Router();

routes.post('/add', async (req, res) => {
    try {
        console.log("Request Body:", req.body); // ✅ Debugging log

        if (!req.body) {
            return res.status(400).send({ message: "Request body is missing" });
        }

        const { name, email, age } = req.body;

        if (!name || !email || !age) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const newUser = new User({ name, email, age });
        await newUser.save();

        return res.status(201).send({ message: "User created successfully", user: newUser });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});



routes.get('/all',async(req,res)=>{
    try {
        const users = await User.find();

  return res.json(users);
    } catch (error) {
       return res.send({error:error.message}) 
    }
})
module.exports = routes;
