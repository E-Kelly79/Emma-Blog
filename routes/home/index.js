const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res)=>{
    const perPage = 10;
    const page = req.query.page || 1;
    Post.find({}).skip((perPage * page) - perPage).limit(perPage).then(posts=>{
        Post.count().then(postCount=>{
            Category.find({}).then(categories=>{
                res.render('home/index', {posts: posts,
                                          categories: categories,
                                          current: parseInt(page),
                                          pages: Math.ceil(postCount /perPage)
                });
            });
        });
    }).catch(err=>{
        console.log(err);
    });
});

router.get('/about', (req, res)=>{

    res.render('home/about');
});

router.get('/register', (req, res)=>{

    res.render('home/register');
});

router.post('/register', (req, res)=>{
    let errors = [];
    //check forms for errors and validate them
    if(!req.body.name){
        errors.push({message: 'Please add a title'});
    }

    if(!req.body.email) {
        errors.push({message: 'Please add an email'});
    }

    if(!req.body.password) {
        errors.push({message: 'Please add a password'});
    }

    if(errors.length > 0) {
        res.render('home/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email

        });
    }else{
        User.findOne({email: req.body.email}).then(user=>{
            if(!user){
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(user.password, salt, (err, hash)=>{
                        user.password = hash;
                        user.save().then(savedUser=>{
                            req.flash('success_message', 'You have registered you can now login');
                            res.redirect('/home/login');
                        });
                        console.log(hash);
                    });
                });
            }else{
                req.flash('error_message', "That email already exist please login");
                res.redirect('/login');
            }
        });

    }
});

router.get('/login', (req, res)=>{

    res.render('home/login');
});

//Login
passport.use(new LocalStrategy({
    usernameField: 'email'},
    (email, password, done)=>{
    //find the user if user is found then log them in else send an error message
    User.findOne({email: email}).then(user=>{
        if(!user){
            return done(null, false, {message:'No user found'});
        }

        //compare the password filed with the password in the database
        bcrypt.compare(password, user.password, (err, matched)=>{
            if(err) return err;

            if(matched){
                return done(null, user);
            }else{
                return done(null, false, {message: 'Incorrect Password'});
            }
        });
    });
}));

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
   User.findById(id, function(err, user){
       done(err, user);
   }) ;
});


router.post('/login', (req, res, next)=>{
    passport.authenticate('local',{
       successRedirect: '/admin',
       failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);

});

router.get('/logout', (req, res)=>{
   req.logout();
   res.redirect('/login');
});

router.get('/post/:slug', (req, res)=>{
    Post.findOne({slug: req.params.slug})
        .populate({path: 'comments', populate: {path: 'user', model: 'Users'}})
        .populate('user')
        .then(post=>{
            Category.find({}).then(categories=>{
                res.render('home/post', {post: post, categories: categories});
            });

        });

});

module.exports = router;