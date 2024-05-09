const { ObjectId } = require("mongodb");
const Dashboard = require("../../models/dashboard.model");
//[GET] /adminPage/:id
module.exports.index = async (req, res) => {
    try {
        //find account to update
        const admin = await Dashboard.findOne({
            _id: '663c4add81adc04e32b8e285'
        });
        console.log(admin)

        res.render("admin/pages/adminPage/index", {
            pageTitle: "Admin Page",
            admin: admin
        });
    } catch (err) {
        req.flash("error", "Account not found!");
        res.redirect("/");
    }  

}
//[PATCH]] /adminPage/:id
module.exports.adminPatch = async (req, res) => {
    console.log(req.params)
    const id = req.params.id;
    if(req.file){
        req.body.avatar = `/uploads/${req.file.filename}`
    }
    const existingUser = await Dashboard.find({
        _id: {$ne: id}
    });

    const username = await Dashboard.findOne({
        username: req.body.username,
        deleted: false
    });
    let ok = 0;
    existingUser.forEach(acc => {
        if(username.username === acc.username || username.bankAccountNumber === acc.bankAccountNumber){
            req.flash("error", "Username/Bank Account Number Already Exists!");
            ok = 1;
        }
    })

    if(ok === 1){
        res.redirect("back");
    } else {
        try {
            await Dashboard.updateOne({_id: id}, req.body);
            req.flash("success", "Update success!");
    
        }catch(e) {
            req.flash("error", "Update fail!");
        }
    
        res.redirect("back");
    }
}