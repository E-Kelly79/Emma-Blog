const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blog').then(db=>{
    console.log('Mongo Connected')
}).catch(err=> console.log(err));



//Config server to use handlebars
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs({
    defaultLayout: 'home'
}));
app.set('view engine', 'handlebars');

//Load Routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');

//Use Routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);


//Start the server
app.listen(4500, ()=>{
    console.log(`listening on port 4500`);
});