//Setup mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Post Table
const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },

    body: {
      type: String,
      required: true
    },

    date:{
       type: Date,
       default: Date.now()
    }

});

module.exports = mongoose.model('Comments', CommentSchema);