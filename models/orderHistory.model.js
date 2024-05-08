const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const orderSchema = mongoose.Schema(
    {
        voucher: {
            type: Number,
            required: true,
        },
        shippingPrice: {
            type: Number,
            required: true
        },
        dateDelivery: {
            type: String,
            required: true,
        },
        dateOrder: {
            type: String,
            required: true,
        },
        datePayment: {
            type: String,
            required: true,
        },
        buyer: {
            type: String,
            ref: "accounts",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const OrderModel = mongoose.model("orderHistory", orderSchema, "orderHistory");

module.exports = OrderModel;