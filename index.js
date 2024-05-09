const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const multer  = require('multer')//upload image
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

//nhúng mongoose
const database = require("./config/database");

//nhúng biến system config
const systemConfig = require("./config/system");
//nhúng env
require("dotenv").config();
//install dotenv: npm i dotenv
const port = process.env.PORT;
// nhúng route
const route = require("./routers/admin/index.route");
// kết thúc nhúng route

//connect mongoose
database.connect();
//
app.use(methodOverride('_method'))
//cấu hình pug
app.set("views", "./views");
app.set("view engine", "pug");
//kết thúc cấu hình pug

//app local variables
app.locals.prefixDashboard = systemConfig.prefixDashboard;

//nhúng file tĩnh
app.use(express.static("public"));

//flash-in ra thông báo
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//routes
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

