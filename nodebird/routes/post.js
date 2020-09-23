const express = require('express');
const { Post } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
    try{
        const post = await Post.create({
            content: req.body.content,
            userId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s]*/g);
        if(hashtags){
            await Promise.all(hashtags.map(tag))
        }
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;