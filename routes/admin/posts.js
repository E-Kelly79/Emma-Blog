const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});

//Read data in database
router.get('/', (req, res)=>{
    Post.find({}).then(posts=>{
        res.render('admin/posts', {posts: posts});
    }).catch(err=>{
        console.log(err);
    });
});

//Create Route
router.get('/create', (req, res)=>{
    res.render('admin/posts/create');
});


//Save data to database
router.post('/create', (req, res)=>{
    let file = req.files.file;
    let filename = file.name;

    file.mv('./public/uploads/' + filename, (err)=>{
        if(err) throw err;
    });
    console.log(filename);
    // let allowComments = true;
    //
    // if(req.body.allowComments){
    //     allowComments = true;
    // }else{
    //     allowComments = false;
    // }
    //
    // //Get the data to be saved
    // const newPost = new Post({
    //     title: req.body.title,
    //     status: req.body.status,
    //     allowComments: allowComments,
    //     body: req.body.body
    // });
    //
    // //Save the data to database
    // newPost.save().then(savePost=>{
    //     res.redirect('/admin/posts')
    // }).catch(err=> consle.log(err));


});

//Edit Route
router.get('/edit/:id', (req, res)=>{
    Post.findOne({_id: req.params.id}).then(post=>{
        res.render('admin/posts/edit', {post: post});
    });
});

//Put Request
router.put('/edit/:id', (req, res)=>{
    //find id and then update data with new information coming form the edit text fields
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

        post.save().then(updatedPost=>{
            res.redirect('/admin/posts');
        });
    });
});

//Delete Posts route
router.delete('/:id', (req, res)=>{
    Post.remove({_id: req.params.id}).then(result=>{
        res.redirect('/admin/posts');
    });
});

module.exports = router;