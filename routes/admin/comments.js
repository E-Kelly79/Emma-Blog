const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

//Make all routes start with admin
router.all('/*',  (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res)=>{
    Comment.find({user: req.user.id}).populate('user').then(comments=>{
        res.render('admin/comments', {comments: comments});
    })

});

router.post('/', (req, res)=>{
    Post.findOne({_id: req.body.id}).then(post=>{
        console.log(post);
        const newComment = new Comment({
            user: req.user.id,
            body: req.body.comment
        });

        post.comments.push(newComment);
        post.save().then(savedPost=>{
            newComment.save().then(savedComment=>{
                res.redirect(`/post/${post.id}`)
            })

        });


    });

});

router.delete('/:id', (req, res)=>{
    Comment.remove({_id: req.params.id}).then(deletedComment=>{
        Post.findOneAndUpdate({comments: req.params.id},
            {$pull:{comments: req.params.id}},
            (err, data)=>{
                if(err) console.log(err);
                req.flash('success_message', `Comment was deleted successfully`);
                res.redirect('/admin/comments');
        });

    });
});

module.exports = router;