const router = require('express').Router();
const { Comment, User } = require('../../models');

router.post('/new-comment', async (req, res) => {
    try {
        const { content, blogPostId } = req.body;

        console.log(`content: ${content}, id: ${blogPostId}`);

        const userId = req.session.user_id;

        const newComment = await Comment.create({
            content: content,
            userId: userId,
            blogPostId: blogPostId
        });

        // Fetch the associated user data
        const user = await User.findByPk(userId);

        // Serialize the user data
        const serializedUser = user.get({ plain: true });

        res.status(201).json({ message: 'Comment created successfully', comment: newComment, user: serializedUser });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get-comments/:postId', async (req, res) => {
    const postId = req.params.postId;

    try {
        // Find all comments related to the given postId
        const comments = await Comment.findAll({
            where:
                { blogPostId: postId },
                include: User,
        });

        // If there are no comments found for the postId, return an empty array
        if (!comments || comments.length === 0) {
            return res.status(200).json([]);
        }

        // Return the comments
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }

});
module.exports = router;
