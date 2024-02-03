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
        // Serialize the blogposts to pass them to Handlebars
        const blogPosts = blogPostData.map((post) => post.get({ plain: true }));
        // Pass the serialized blog posts data and the logged_in status to the view
        res.render('home', { blogPosts, logged_in: req.session.logged_in });

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

module.exports = router;
