const dashboardRoute = require("./dashboard.route");
const historyPaymentRoute = require("./historyPayment.route");
const homeRoute = require("./home.route");
const loginRoute = require("./login.route");
const adminPageRoute = require("./adminPage.route");
const systemConfig = require("../../config/system");
module.exports = (app) => {
    const PATH_DASHBOARD = systemConfig.prefixDashboard;
    app.use("/home", homeRoute);
    app.use(PATH_DASHBOARD, dashboardRoute);
    app.use("/historyPayment", historyPaymentRoute);
    app.use("/", loginRoute);
    app.use("/adminPage", adminPageRoute);
    
}

