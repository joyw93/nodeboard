const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const { title } = require('nunjucks/src/filters');

const router = express.Router();


router.get('/', (req, res) => {
    res.render('post_list');
})

router.get('/create', (req, res) => {
    res.render('post_form');
})

router.post('/create', async(req, res) => {
    const { title, content } = req.body;
    try {
        const post = await Post.create({
            title: title,
            content: content,
            UserId: req.user.id,
        });
        
    }catch (error){
        console.error(error);
    }
    return res.redirect('/');
})

router.get('/:index', async (req, res) => {
    index = req.params.index;
    try {
        const post = await Post.findOne(
            {
             where: {id: index}
            });
        
        const comments = await Comment.findAll(
            {
                include: {
                model: User,
                attributes: ['name', 'email'],
            },
             where: {PostId: index}
             })
        res.render('post_detail', {
             post: post,
             comments: comments,
         });
    }catch(error) {
        console.error(error)
    }
})

router.post('/:index/comment', async(req, res) => {
    const { content } = req.body;
    index = req.params.index;
    try {
        const comment = await Comment.create({
            content: content,
            UserId: req.user.id,
            PostId: index
        });
        
    }catch (error){
        console.error(error);
    }
    return res.redirect('/');
})


module.exports = router;