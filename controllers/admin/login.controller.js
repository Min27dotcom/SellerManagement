//[GET]/admin/login

//truyền data động bằng cách render thêm một object

module.exports.index = (req, res) => {
    res.render("admin/pages/login/index", {
        pageTitle: "Login"
    });
}