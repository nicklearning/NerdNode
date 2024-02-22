const router = require('express').Router();
const { BlogPost, User } = require('../models');
const withAuth = require('../utils/withAuth');

router.get('/', async (req, res) => {
    try {
        const blogPostData = await BlogPost.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });
        // Serialize the blogposts to pass them to Handlebars
        const blogPosts = blogPostData.map((post) => post.get({ plain: true }));


        // Pass the serialized blog posts data and the logged_in status to the view
        res.render('home', {
            blogPosts,
            logged_in: req.session.logged_in,
            pageTitle: 'The Tech Blog'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('sign-up');
})

router.get('/dashboard', async (req, res) => {
    try {
        const userId = req.session.user_id;

        const userPosts = await BlogPost.findAll({
            where: { userId: userId }
        });

        console.log(userPosts);

        res.render('dashboard', {
            dashboard: true,
            logged_in: req.session.logged_in,
            userPosts: userPosts
        });
    } catch (error) {
        console.error("Error fetching user's blog posts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
