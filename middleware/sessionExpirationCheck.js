module.exports = function sessionExpirationCheck(req, res, next) {
    if (req.session && req.session.cookie && !req.session.cookie.expires) {
        // Session has expired, redirect the user to the login page
        return res.redirect('/login');
    }
    next();
};