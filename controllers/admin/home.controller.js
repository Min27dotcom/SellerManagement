//[GET]/admin/home
//truyền data động bằng cách render thêm một object

module.exports.index = (req, res) => {
    res.render("admin/pages/home/index", {
        pageTitle: "Admin Dashboard",
        page_1: "Your Account",
        page_2: "Account Dashboard",
        page_3: "History Payment Dashboard"
    });
}