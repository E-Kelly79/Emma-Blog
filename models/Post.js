//Setup mongoose
const mongoose = require('mongoose');
const UrlSlugs = require('mongoose-url-slugs');
const Schema = mongoose.Schema;


//Post Table
const PostSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },

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

    slug:{
        type: String
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }]
},{usePushEach: true});

PostSchema.plugin(UrlSlugs('title', {field: 'slug'}));
module.exports = mongoose.model('Posts', PostSchema);



