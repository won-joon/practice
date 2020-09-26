const express = require('express');
const { Post, Hashtag, User } = require('../models');

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

router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if(!query){
        return res.redirect('/');
    }
    try{
        const hashtag = await Hashtag.findOne({ where: { title: query }});
        let posts = [];
        if(hashtag){
            posts = await hashtag.getPosts({ include: [{ model: User }]});
        }
        return res.render('main', {
            title: `${query} | NodeBird`,
            user: req.user,
            twits: posts,
        });
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.post('/:id/like', async(req, res, next) =>{
    try{
        const post = await Post.findOne({ where: { id: req.user.id }});
        await post.addLiker(req.params.id);
        res.send('Ok');
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.delete('/:id/like', async(req, res, next) => {
    try{
        const post = await Post.findOne({ where: { id: req.user.id }});
        await post.removeLiker(req.params.id);
        res.send('Ok');
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.delete('/:id', async(req, res, next) => {
    try{
        await Post.destroy({ where: { id: req.params.id, userId: req.user.id }});
        res.send('OK');
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;