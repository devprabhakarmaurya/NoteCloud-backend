const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt'); // used to hash the password before saving with salt

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
    },
   email: {
    type: String ,
    required: true,
    unique: true,
   },
   password:{
    type: String ,
    required: true,
   },
   timestamp: {
    type : Date,
    default: Date.now,
   }  
});

// Hash and salt the password before saving the user
UserSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')){
    return next();
  } 

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;

