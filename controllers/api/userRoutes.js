const router = require('express').Router();
const { User } = require('../../models');

router.post('/login', async (req, res) => {
    try {
        // Find the user who matches the posted e-mail address
        const userData = await User.findOne({ where: { username: req.body.username } });

        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect username or password, please try again' });
            return;
        }

        // Verify the posted password with the password store in the database
        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect username or password, please try again' });
            return;
        }

        req.session.logged_in = true;
        req.session.user_id = userData.id;


        // Create session variables based on the logged in user
        req.session.save(() => {
            res.json({ user: userData, message: 'You are now logged in!' });
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        // Remove the session variables
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(204).end();
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists, please choose a different one' });
        }
        const newUser = await User.create({ username, password });

        req.session.logged_in = true;
        req.session.user_id = newUser.id;

        req.session.save(() => {
            res.json({ user: newUser, message: 'Signup successful. You are now logged in!' });
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


module.exports = router;
