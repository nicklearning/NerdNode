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

router.get('/dashboard', withAuth, (req, res) => {

    const dashboard = true;
    res.render('dashboard',
        {
            dashboard,
            logged_in: req.session.logged_in
        });
})


module.exports = router;
