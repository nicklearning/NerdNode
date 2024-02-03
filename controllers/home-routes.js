const router = require('express').Router();
const { BlogPost, Comment } = require('../models');

router.get('/', async (req, res) => {
    try {
        const blogPostData = await BlogPost.findAll({
            include: [
                {
                    model: Comment,
                    attributes: ['content'],
                },
            ],
        });
        res.json(blogPostData);
        // TODO serialize the data
        // TODO render the homepage and pass in the serialize blog post data
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

module.exports = router;
