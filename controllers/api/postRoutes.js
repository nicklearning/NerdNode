const router = require('express').Router();
const { BlogPost, Comment, User } = require('../../models');

router.post('/create-post', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = await BlogPost.create({
            title,
            content,
            userId: req.session.user_id
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creating new post:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET a single post by ID
router.get('/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        // Find the post by ID
        const post = await BlogPost.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // Return the post data
        res.status(200).json(post);
        console.log(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put('/update-post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content } = req.body;

        // Find the post by ID
        const post = await BlogPost.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Update the post
        post.title = title;
        post.content = content;
        await post.save();

        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete('/delete-post/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        // Find the post by ID
        const post = await BlogPost.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Delete the post
        await post.destroy();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        // Fetch comments associated with the specified blog post ID
        const comments = await Comment.findAll({
            where: { blogPostId: id },
            include: {
                model: User,
                attributes: ['username'] // Include only the username attribute
            }
        });
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

module.exports = router;