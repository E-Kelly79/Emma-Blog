const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const {isEmpty, uploadDir} = require('../../helpers/upload-helper');
const fs = require('fs');
const path = require('path');
const {userAuth} = require('../../helpers/auth');




//Make all routes start with admin
router.all('/*',  (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});

//Read data in database
router.get('/', (req, res)=>{
    Post.find({}).populate('category').then(posts=>{
        res.render('admin/posts', {posts: posts});
    }).catch(err=>{
        console.log(err);
    });
});

//Create Route
router.get('/create', (req, res)=>{
    Category.find({}).then(categories=>{
        res.render('admin/posts/create', {categories: categories});
    });

});


//Save data to database
router.post('/create', (req, res)=>{

    //check forms for errors and validate them
    let errors = [];
    if(!req.body.title){
        errors.push({message: 'Please add a title'});
    }else if(!req.body.body){
        errors.push({message: 'Please add some description to that post'});
    }

    if(errors.length > 0){
        res.render('admin/posts/create',{
            errors: errors
        });
        //if no errors are found then save the post to the database
    }else {
        let filename = 'ask-luddites-british-museum-AN00126245_001_l-E.jpeg';
        /*check to see if a file has been upload
         if it has then mv file to uploads folder*/

        if (!isEmpty(req.files)) {
            let file = req.files.file;
            filename = Date.now() + '-' + file.name;
            file.mv('./public/uploads/' + filename, (err) => {
                if (err) throw err;
            });
        }

        let allowComments = true;
        if (req.body.allowComments) {
            allowComments = true;
        } else {
            allowComments = false;
        }

        //Get the data from the form to be saved
        const newPost = new Post({
            title: req.body.title,
            status: req.body.status,
            allowComments: allowComments,
            body: req.body.body,
            category: req.body.category,
            file: filename
        });

        //Save the data to database and redirect to all posts
        newPost.save().then(savePost => {
            req.flash('success_message', `Post with the title ${savePost.title} was created successfully`);

            res.redirect('/admin/posts')
        }).catch(err => consle.log(err));

    }
});



//Edit Route find the id of the post to update it
router.get('/edit/:id', (req, res)=>{
    Post.findOne({_id: req.params.id}).then(post=>{
        Category.find({}).then(categories=>{
            res.render('admin/posts/edit', {post: post, categories: categories});
        });
    });
});

//Put Request
router.put('/edit/:id', (req, res)=>{
    /*find id and then update data
     with new information coming form the edit text fields*/
    Post.findOne({_id: req.params.id}).then(post=>{
        if(req.body.allowComments){
            allowComments = true;
        }else{
            allowComments = false;
        }

        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;
        post.category = req.body.category;

        if (!isEmpty(req.files)) {
            let file = req.files.file;
            filename = Date.now() + '-' + file.name;
            post.file = filename;
            file.mv('./public/uploads/' + filename, (err) => {
                if (err) throw err;
            });
        }

        post.save().then(updatedPost=>{
            req.flash('success_message', `Post with the title ${updatedPost.title} was edited successfully`);
            res.redirect('/admin/posts');
        });
    });
});

//Delete Posts
router.delete('/:id', (req, res)=>{
    Post.findOne({_id: req.params.id}).populate('comments').then(post=>{
        fs.unlink(uploadDir + post.file, (err)=>{
            if(!post.comments.length < 1){
                post.comments.forEach(comment=>{
                    comment.remove();
                });
            }
            post.remove().then(postRemoved=>{
                req.flash('success_message', `Post was deleted successfully`);
                res.redirect('/admin/posts');
            });

        });

    });
});

module.exports = router;