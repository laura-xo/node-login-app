const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  username: {
      type: String,
      required: true,
      min:4
  },

  email: {
    type: String,
    required: true,
},

password: {
    type: String,
    required: true,
    min:8,
    
},
});

module.exports = mongoose.model('User', userSchema)