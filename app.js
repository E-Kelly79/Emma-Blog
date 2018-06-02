const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');

//Load Routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');


//Config server to use handlebars
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs({
    defaultLayout: 'home'
}));
app.set('view engine', 'handlebars');


//Use Routes
app.use('/', home);
app.use('/admin', admin);


//Start the server
app.listen(4500, ()=>{
    console.log(`listening on port 4500`);
});