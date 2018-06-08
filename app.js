const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');



mongoose.connect('mongodb://localhost:27017/blog').then(db=>{
    console.log('Mongo Connected')
}).catch(err=> console.log(err));





//Config server to use handlebars
const {select, formatDate} =require('./helpers/handlebars-helpers');
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs({
    defaultLayout: 'home',
    helpers: {select: select,
              formatDate: formatDate
    }
}));
app.set('view engine', 'handlebars');


//Upload Middleware
app.use(fileUpload());

//Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Method Override
app.use(methodOverride('_method'));


app.use(session({
    secret: 'eoinkelly123ilovecoding',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());
//Local Varaibles using middleware
app.use((req, res, next)=>{
    res.locals.success_message = req.flash('success_message');
    next();
})

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