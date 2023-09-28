require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.Mongo_URI;

const connectToMongo = () =>{
mongoose.connect(mongoURI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    });
console.log("Connected to Mongo Succesfully")
}

module.exports = connectToMongo;