//[GET]/admin/listBlocked

const Dashboard = require("../../models/dashboard.model")

module.exports.listBlocked = async (req, res) => {
    const dashboard = await Dashboard.find({
        blocked: true
    });

 
// Function to format date to "dd/mm/yyyy"   
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

    const newDashboard = dashboard.map(item => {
        item.formatDateOfBirth = formatDate(item.dateOfBirth);
        item.formatDateCreated = formatDate(item.dateCreated);
        // console.log(item)
        return item;
    })
    // console.log(newDashboard[0].username);

    res.render("admin/pages/dashboard/listBlocked", {
        pageTitle: "List Blocked Accounts",
        userName: "John Doe",
        col_1: "Username",
        col_2: "Phone Number",
        col_3: "Date Created",
        col_4: "Address",
        col_5: "Date Of Birth",
        col_6: "Actions",
        accounts: newDashboard
    });
}