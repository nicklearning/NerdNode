const router = require('express').Router();
const { Comment } = require('../../models');

router.post('/new-comment', async (req, res) => {
    try {
        const { content, blogPostId } = req.body;

        const userId = req.session.user_id;
        console.log(userId);

        const newComment = await Comment.create({
            content: content,
            userId: userId,
            blogPostId: blogPostId
        });

        res.status(201).json({ message: 'Comment created successfully', comment: newComment });
    } catch (error) {
        // If there's an error, send an error response
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});


router.get





module.exports = router;