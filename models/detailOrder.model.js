const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
// const Schema = mongoose.Schema;

const detailOrderSchema = mongoose.Schema(
    {
        product: {
            type: String,
            ref: 'products',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
        },
        orderHistory: {
            type: String,
            ref: 'orderHistory',
            required: true
        }
    },
    {
        timestamps: true,
    }
)

const DetailOrders = mongoose.model("detailOrder", detailOrderSchema,"detailOrder");
module.exports = DetailOrders;




