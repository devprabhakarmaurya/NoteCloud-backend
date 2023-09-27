require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.Mongo_URI;

const connectToMongo = () =>{
mongoose.connect(mongoURI);
console.log("Connected to Mongo Succesfully")
}

module.exports = connectToMongo;