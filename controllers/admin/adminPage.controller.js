module.exports.index = (req, res) => {
    res.render("admin/pages/adminPage/index", {
        pageTitle: "Login"
    });
}