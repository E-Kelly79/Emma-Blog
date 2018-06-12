//Setup mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Post Table
const CategorySchema = new Schema({
    name:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Categories', CategorySchema);
