//[GET]/admin/historyPayment
const { populate } = require("dotenv");
const Account = require("../../models/dashboard.model");
const OrderDetail = require("../../models/detailOrder.model");
const OrderHistory = require("../../models/orderHistory.model");
const Product = require("../../models/products.model");
const paginationHelper = require("../../helpers/pagination.js");
module.exports.index = async (req, res) => {
    const orderDetail = await OrderDetail.find({}).populate({
        path: "product"
    }).populate({
        path: "orderHistory",
        populate: {
            path: "buyer"
        }
    });
    var result = {};
    // pagination

    const countAccs =  await OrderHistory.countDocuments();

    let objectPagination = paginationHelper({
        limitItems: 5,
        currentPage: 1,
    }, req.query, countAccs);

    const payments = await OrderHistory.find().populate({
        path: "buyer"
    }).limit(objectPagination.limitItems).skip(objectPagination.skip);
    result = payments;

    //search
    let find = {};
    let keyword = "";
    if(req.query.keyword){
        keyword = req.query.keyword;
        const regex = new RegExp(keyword, "i");
        find.username = regex;
        let array = []
        payments.forEach(item => {
            const username = item.buyer.username;
            if(username == keyword){
                array.push(item);
            }
        });
        result = array;
    }



    //total price
    const orderHistoryMap = new Map();
    orderDetail.forEach((detail) => {
        const orderHistoryId = detail.orderHistory._id.toString();
        if (orderHistoryMap.has(orderHistoryId)) {
        orderHistoryMap.get(orderHistoryId).push(detail);
        } else {
        orderHistoryMap.set(orderHistoryId, [detail]);
        }
    });
    orderHistoryMap.forEach((value, key) => {
        let totalPrice = 0;
        value.forEach(item => {
            totalPrice += item.product.price * item.quantity;            
        })
        orderHistoryMap.set(key, totalPrice);
    });
    payments.map(item => {
        const orderHistoryId = item._id.toString();
        if(orderHistoryMap.has(orderHistoryId)) {
            let totalPrice = orderHistoryMap.get(orderHistoryId);
            totalPrice = (totalPrice + item.shippingPrice - (totalPrice * item.voucher)).toFixed(2);
            orderHistoryMap.set(orderHistoryId, totalPrice);
            item.totalPrice = totalPrice;
        }
        return item;
    })

    //filter by totalSpending
    let filter = "";
    let totalSpendingFilter = [];
    if(req.query.filter){
        filter=req.query.filter;
        // filter = req.query.totalSpendingFilter;
        if(filter == 1) {
            payments.forEach(item => {
                const totalPrice = item.totalPrice; 
                if(totalPrice >= 500 && filter < 1000){
                    totalSpendingFilter.push(item);
                }
            });
            result = totalSpendingFilter;
        } else if(filter == 2) {
            payments.forEach(item => {
                const totalPrice = item.totalPrice;
                if(totalPrice >= 1000){
                    totalSpendingFilter.push(item);
                }
            });
        }
        result = totalSpendingFilter;
    }

    //sort by name

    function sortByNameASC(arr) {
        return arr.sort(function(a, b) {
          return a.buyer.username.localeCompare(b.buyer.username);
        });
    }
    
    function sortByNameDESC(arr) {
        return arr.sort(function(a, b) {
            return b.buyer.username.localeCompare(a.buyer.username);
        });
    }
    // let sort = ""
    if(req.query.sort){
        let sort = req.query.sort
        if (sort == 1){
            totalSpendingFilter = sortByNameASC(result);
        }
        else if (sort == 2){
            totalSpendingFilter = sortByNameDESC(result);  
        }
        result = totalSpendingFilter;
    }

    //render route
    res.render("admin/pages/historyPayment/index", {
        pageTitle: "HISTORY PAYMENT PAGE",
        col_1: "Username",
        col_2: "Date Of Order",
        col_3: "Address",
        col_4: "Total Spending",
        col_5: "Phone Number",
        col_6: "Date Of Payment",
        pagination: objectPagination,
        keyword: keyword,
        payments: result
    });
};


module.exports.detail = async (req, res) => {
    try {
        const findPayment = {
            _id: req.params.id
        }
        // console.log(findPayment);

        const accInfo = await OrderHistory.findOne(findPayment).populate({
            path: "buyer"
        });

        let payment = {};
        const payments = await OrderHistory.find({}).populate({
            path: "buyer"
        });

        const orderDetail = await OrderDetail.find({}).populate({
            path: "product"
        }).populate({
            path: "orderHistory",
            populate: {
                path: "buyer"
            }
        });

            //total price
    const orderHistoryMap = new Map();
    orderDetail.forEach((detail) => {
        const orderHistoryId = detail.orderHistory._id.toString();
        if (orderHistoryMap.has(orderHistoryId)) {
        orderHistoryMap.get(orderHistoryId).push(detail);
        } else {
        orderHistoryMap.set(orderHistoryId, [detail]);
        }
    });
    orderHistoryMap.forEach((value, key) => {
        let totalPrice = 0;
        value.forEach(item => {
            totalPrice += item.product.price * item.quantity;            
        })
        orderHistoryMap.set(key, totalPrice);
    });
    payments.map(item => {
        const orderHistoryId = item._id.toString();
        if(orderHistoryMap.has(orderHistoryId)) {
            let totalPrice = orderHistoryMap.get(orderHistoryId);
            item.priceUnderVoucher = totalPrice;
            totalPrice = (totalPrice + item.shippingPrice - (totalPrice * item.voucher)).toFixed(2);
            orderHistoryMap.set(orderHistoryId, totalPrice);
            item.totalPrice = totalPrice;
        }
        return item;
    })

        const orderHistoryMap2 = new Map();
        orderDetail.forEach((detail) => {
            const orderHistoryId = detail.orderHistory._id.toString();
            if (orderHistoryMap2.has(orderHistoryId)) {
            orderHistoryMap2.get(orderHistoryId).push(detail);
            } else {
            orderHistoryMap2.set(orderHistoryId, [detail]);
            }
        });
    
        payments.map(item => {
            const orderHistoryId = item._id.toString();
            if(orderHistoryMap2.has(orderHistoryId)) {
                const values = orderHistoryMap2.get(orderHistoryId);
                // console.log(values);
                item.orderDetails = values;
                // item.totalPrice = totalPrice;
                // console.log(item.orderDetails);
            }
            return item;
        });
        
        payments.forEach(item => {
            if(item._id == req.params.id){
                payment = item;
            }
        })

        

        res.render("admin/pages/historyPayment/detail", {
            pageTitle: "Detail History Payment",
            payment: payment,
                accInfo: accInfo,
            col_1: "Name",
            col_2: "Color",
            col_3: "Size",
            col_4: "Quantity",
            col_5: "Price $",
            col_6: "Image",
            
        });
    }catch(err){
        req.flash("error", "Not Found!");
        res.redirect("/historyPayment");
    }
}