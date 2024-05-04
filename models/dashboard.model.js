const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const DashboardSchema = new mongoose.Schema({
    username: String,
    password: String,
    address: String,
    phoneNumber: String,
    dateOfBirth: String,
    gender: String,
    avatar: String,
    email: String,
    bankAccountName: String,
    bankAccountNumber: String,
    bank: String,
    deletedAt: Date,
    blocked: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        slug: "username",
        unique: true
    }
}, {
    timestamps: true
});

//Dashboard đầu tiên là tên biến, Dashboard thứ 2 là tên model, accounts là tên bảng connection trong mongodb
const Dashboard = mongoose.model("Dashboard", DashboardSchema, "accounts");
module.exports = Dashboard;