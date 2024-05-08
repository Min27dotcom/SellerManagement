const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = Schema({
    name: {
      type: String,
      required: true
    },    
    color: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    importPrice: {
        type: Number,
        required: true
    },
    price: {
      type: Number,
      required: true
    },
    productImg: {
      type: String,
      required: true
    },
    slug: {
        type: String,
        slug: "name",
        unique: true
    }
  }, {
    timestamps: false
  });
const Product = mongoose.model("products", productSchema, "products");
module.exports = Product;