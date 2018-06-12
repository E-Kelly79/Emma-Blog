//Setup mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Post Table
const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Users', UserSchema);