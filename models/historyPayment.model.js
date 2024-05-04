const mongoose = require('mongoose');

const Product = new mongoose.Schema({
    name: String,
    color: String,
    size: String,
    quantity: Number,
    price: Number,
    productImg: String
});

const HistoryPaymentSchema = new mongoose.Schema({
    username: String,
    address: String,
    phoneNumber: String,
    avatar: String,
    bankAccountName: String,
    bankAccountNumber: String,
    bank: String,
    blocked: Boolean,
    dateOfOrder: Date,
    dateOfPayment: Date,
    products: [Product]
});

//HistoryPayment đầu tiên là tên biến, HistoryPayment thứ 2 là tên model, historyPayments là tên bảng connection trong mongodb
const HistoryPayment = mongoose.model("HistoryPayment", HistoryPaymentSchema, "historyPayments");
module.exports = HistoryPayment;