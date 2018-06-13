//Setup mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Post Table
const PostSchema = new Schema({
    title:{
        type: String,
        required: true
    },

    status:{
        type: String,
        default: 'public',
    },

    allowComments:{
        type: Boolean,
        required: true
    },

    body:{
        type: String,
        required: true
    },

    file:{
        type: String
    },

    date:{
        type: Date,
        default: Date.now()
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categories'
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }]
});

module.exports = mongoose.model('Posts', PostSchema);
