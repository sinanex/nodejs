const mongoose = require('mongoose'); // Use 'mongoose' instead of 'db'

const userSchema = new mongoose.Schema({  // Corrected Schema definition
    name: String,
    email: String,
    age: Number
});

module.exports = mongoose.model('User', userSchema); 
