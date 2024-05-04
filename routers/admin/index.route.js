const dashboardRoute = require("./dashboard.route");
const listBlockedRoute = require("./listBlocked.route");
const historyPaymentRoute = require("./historyPayment.route");
const homeRoute = require("./home.route");
const loginRoute = require("./login.route");
const systemConfig = require("../../config/system");
module.exports = (app) => {
    const PATH_DASHBOARD = systemConfig.prefixDashboard;
    app.use("/home", homeRoute);

    app.use(PATH_DASHBOARD, dashboardRoute);
    app.use(PATH_DASHBOARD + "/listBlocked", listBlockedRoute);
    app.use("/historyPayment", historyPaymentRoute);
    app.use("/", loginRoute);
    
}

