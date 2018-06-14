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
const {mongoDBUrl} = require('./config/database');
const passport = require('passport');




mongoose.connect(mongoDBUrl).then(db=>{
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
//passport
app.use(passport.initialize());
app.use(passport.session());

//Local Varaibles using middleware
app.use((req, res, next)=>{
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
})

//Load Routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const cats = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

//Use Routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', cats);
app.use('/admin/comments', comments);


//Start the server
app.listen(4500, ()=>{
    console.log(`listening on port 4500`);
});