const router = require('express').Router();
const { BlogPost, User, Comment } = require('../models');
const withAuth = require('../utils/withAuth');

router.get('/', async (req, res) => {
    try {
        // Fetch all blog posts with associated user data
        const blogPosts = await BlogPost.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'username']
                }
            ]
        });

        // Fetch all comments with associated user data
        const comments = await Comment.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'username']
                }
            ]
        });


        // Serialize the blog posts and comments to plain objects
        const serializedBlogPosts = blogPosts.map(post => post.get({ plain: true }));
        const serializedComments = comments.map(comment => comment.get({ plain: true }));

        const commentsByPostId = {};
        serializedComments.forEach(comment => {
            const postId = comment.blogPostId;
            if (!commentsByPostId[postId]) {
                commentsByPostId[postId] = [];
            }
            commentsByPostId[postId].push(comment);
        });


        console.log(serializedBlogPosts);
        console.log(serializedComments);

        // Pass the serialized blog posts, comments, and logged_in status to the view
        res.render('home', {
            blogPosts: serializedBlogPosts,
            comments: commentsByPostId,
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

router.get('/dashboard', withAuth, async (req, res) => {
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
