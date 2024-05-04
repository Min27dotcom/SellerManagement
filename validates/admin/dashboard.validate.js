module.exports.createPost = (req, res, next) => {
    if(!req.body.username) {
        req.flash("error", "Enter your username!");
        res.redirect("back");
        return;
    }
    next();
}