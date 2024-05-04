//[GET]/admin/historyPayment

const HistoryPayment = require("../../models/historyPayment.model")

module.exports.index = async (req, res) => {
    const historyPayment = await HistoryPayment.find({});

 
//Function to format date to "dd/mm/yyyy"   
    function formatDate(date) {
        // if (!date) return 'khong ton tai!';
        // console.log(date.toDateString())
// 
        // return date.toDateString();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
      }

    const newHistoryPayment = historyPayment.map(item => {
        item.formatDateOfOrder = formatDate(item.dateOfOrder);
        item.formatDateOfPayment = formatDate(item.dateOfPayment);
        // console.log(item)
        return item;
    })
    // console.log(newDashboard[0].username);

    res.render("admin/pages/historyPayment/index", {
        pageTitle: "HISTORY PAYMENT DASHBOARD",
        col_1: "Username",
        col_2: "Date Of Order",
        col_3: "Address",
        col_4: "Total Spending",
        col_5: "Phone Number",
        col_6: "Actions",
        payments: newHistoryPayment
    });
}