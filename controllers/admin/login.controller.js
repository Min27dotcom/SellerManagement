
const Dashboard = require("../../models/dashboard.model");
const bcrypt = require("bcrypt");

module.exports.index = (req, res) => {
    // res.send("OK");
    res.render("admin/pages/login/index", {
        pageTitle: "Login"
    });
}

module.exports.register = (req, res) => {
    // res.send("OK");
    res.render("admin/pages/login/index", {
        pageTitle: "Login"
    });
}

module.exports.registerPost = async(req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);
        //create new admin
        const newUser = await new Dashboard({
            username: req.body.username,
            password: hashed,
            email: req.body.email,

        })

        //save to db
        const user = await newUser.save();
        res.status(200).json(user);
    } catch(e){
        res.status(500).json(e);
    }
}