const mongoose = require("mongoose");

const registration = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    
  },
  birthday: {
    type: String,
    required: true,
    trim: true,
    
  },
  gender: {
    type: String,
    required: true,
    trim: true,
    
  },
  email: {
    type: String,
    required: true,
    trim: true,
    
  },
  phonenumber: {
    type: String,
    required: true,
    trim: true,
    
  },
  profilePicUrl : String
});

const registrationModel = mongoose.model("registration", registration);

module.exports = registrationModel;