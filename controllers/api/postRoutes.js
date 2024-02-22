const router = require('express').Router();
const { BlogPost } = require('../../models');

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

// router.get('/user-posts', async (req, res) => {
//     try {
//         const userId = req.session.user_id;

//         const userPosts = await BlogPost.findAll({
//             where: { userId: userId }
//         });

//         res.json(userPosts); 
//     } catch (error) {
//         console.error("Error fetching user's blog posts:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });


module.exports = router;