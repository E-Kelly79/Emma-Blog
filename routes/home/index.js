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
    Post.find({}).then(posts=>{
        Category.find({}).then(categories=>{
            res.render('home/index', {posts: posts, categories: categories});
        })

        //console.log(posts);
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
    usernameField: 'email'
},(email, password, done)=>{
    console.log(password);

    User.findOne({email: email}).then(user=>{
        if(!user){
            return done(null, false, {message:'No user found'});
        }

        if()
    });


}));


router.post('/login', (req, res, next)=>{
    passport.authenticate('local',{
       successRedirect: '/admin',
       failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);

});

router.get('/post/:id', (req, res)=>{
    Post.findOne({_id: req.params.id})
        .then(post=>{
            Category.find({}).then(categories=>{
                res.render('home/post', {post: post, categories: categories});
            })

        });

});

module.exports = router;