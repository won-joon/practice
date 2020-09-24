const express = require('express');
const { Post, Hashtag } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
    try{
        const post = await Post.create({
            content: req.body.content,
            userId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s]*/g);
        if(hashtags){
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where: { title: tag.slice(1).toLowerCase() },
            })));
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;