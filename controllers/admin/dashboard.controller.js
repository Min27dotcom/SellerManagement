//[GET]/dashboard
const Dashboard = require("../../models/dashboard.model");
const paginationHelper = require("../../helpers/pagination.js");
module.exports.index = async (req, res) => {
//filter
    let find = {
        deleted: false
    };
    var result = {};
    if(req.query.blocked){
        find.blocked = req.query.blocked;
    }

//search
    let keyword = "";
    if(req.query.keyword){
        keyword = req.query.keyword;
        const regex = new RegExp(keyword, "i");
        find.username = regex;
    }

//pagination
    const countAccs = await Dashboard.countDocuments();
    let objectPagination = paginationHelper({
        limitItems: 5,
        currentPage: 1,
    }, req.query, countAccs);

    const dashboard = await Dashboard.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);

//not found when seach
    const x = await Dashboard.find({username: keyword});
    if(x.length == 0){
         req.flash("error", "Account not found!");
    }
// Function to check age of client
    function calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }
 
// Function to format date to "dd/mm/yyyy"  
    function formatDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year}/${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`;
    }

//format date
    const newDashboard = dashboard.map(item => {
        // item.formatDateOfBirth = formatDate(item.dateOfBirth);
        item.formatLastEdited = formatDate(item.updatedAt);
        item.age = calculateAge(item.dateOfBirth);
        return item;
    })
    result = newDashboard;
//filter by age
    let filter = "";
    if(req.query.agefilter){
        filter = req.query.agefilter
        let ageFilter = [];
        if (filter == 1){
            dashboard.forEach(item => { 
                let age = calculateAge(item.dateOfBirth);
                if (age <= 25) {
                    ageFilter.push(item);
                }
            })
            result = ageFilter;
        }
        if (filter == 2){
            dashboard.forEach(item => { 
                let age = calculateAge(item.dateOfBirth);
                if (age >= 26 && age <= 45) {
                    ageFilter.push(item);
                }
            })
            result = ageFilter;
        }
        if (filter == 3){
            dashboard.forEach(item => { 
                let age = calculateAge(item.dateOfBirth);
                if (age >=46) {
                    ageFilter.push(item);
                }
            })
            result = ageFilter;
        }
        
    }

//sort by name

function sortByNameASC(arr) {
    return arr.sort(function(a, b) {
      return a.username.localeCompare(b.username);
    });
}

function sortByNameDESC(arr) {
    return arr.sort(function(a, b) {
      return b.username.localeCompare(a.username);
    });
}

if(req.query.sort){
    sort = req.query.sort
    if (sort == 1){
        let nameSort = sortByNameASC(dashboard);
        result = nameSort;
    }
    else if (sort == 2){
        let nameSort = sortByNameDESC(dashboard);   
        result = nameSort;
    }
}

//render route
    res.render("admin/pages/dashboard/index", {
        pageTitle: "Dashboard",
        col_1: "Username",        
        col_2: "Phone Number",
        col_3: "Address",
        col_4: "Date Created",
        col_5: "Date Of Birth",
        col_6: "Actions",
        accounts: result,
        pagination: objectPagination,
        keyword: keyword
    });
}

//[PATCH]/changeBlocked/:blocked/:id
module.exports.changeBlocked = async (req, res) => {
    const blocked = req.params.blocked;
    const id = req.params.id;
    await Dashboard.updateOne({ _id: id}, {blocked: blocked});
    //hiển thị thông báo thành công
    req.flash("success", "Update status success!");

    res.redirect("back");
}

//[PATCH]/changeMulti
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Dashboard.updateMany({ _id: {$in: ids}}, {blocked: false});
            req.flash("success", `Update ${ids.length} status success!`);
            break;
        case "inactive":
            await Dashboard.updateMany({ _id: {$in: ids}}, {blocked: true});
            req.flash("success", `Update ${ids.length} status success!`);
            break;
        case "delete-all":
            await Dashboard.updateMany(
                { _id: {$in: ids}}, 
                {deleted: true},
                {deletedAt: new Date()}
            );
            req.flash("success", `Update ${ids.length} status success!`);
            break;
        default:
            break;
    }
    res.redirect("back");
}

//[GET] /dashboard/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/dashboard/create", {
        pageTitle: "Add Account",
    });
}

//[POST] /dashboard/create
module.exports.createPost = async (req, res) => {    
    // Kiểm tra xem username hoặc số tài khoản ngân hàng đã tồn tại hay chưa
    const username = await Dashboard.findOne({
        username: req.body.username,
        deleted: false
    });

    const bankAccountNumber = await Dashboard.findOne({
        bankAccountNumber: req.body.bankAccountNumber,
        deleted: false
    });

    if (username) {
        req.flash("error", " Username Already Exists!");
        return res.redirect("/dashboard/create");
    } 

    if (bankAccountNumber) {
        req.flash("error", "Bank Account Already Exists!");
        return res.redirect("/dashboard/create");
    } 

    if (req.file) {
        req.body.avatar = `/uploads/${req.file.filename}`
    }

    const newAcc = new Dashboard(req.body);

    try {
        await newAcc.save();
        req.flash("success", "Add Account Success!");
        res.redirect("/dashboard/create");
    } catch (error) {
        req.flash("error", "Add Account Failed!");
        res.redirect("/dashboard/create");
    }
}


//[GET] /dashboard/update/:id
module.exports.update = async (req, res) => {
    try {
        //find account to update
        const findAcc = {
            _id: req.params.id
        }
        const acc = await Dashboard.findOne(findAcc);


        res.render("admin/pages/dashboard/update", {
            pageTitle: "Update account",
            acc: acc
        })
    } catch (err) {
        req.flash("error", "Account not found!");
        res.redirect("/dashboard");
    }
}

//[PATCH]] /dashboard/update/:id
module.exports.updatePatch = async (req, res) => {
    const id = req.params.id;
    if(req.file){
        req.body.avatar = `/uploads/${req.file.filename}`
    }

    const existingUser = await Dashboard.find({
        _id: {$ne: id}
    });
    console.log(req.body.avatar);
    const username = await Dashboard.findOne({
        username: req.body.username,
        deleted: false
    });
    let ok = 0;
    existingUser.forEach(acc => {
        if(username.username === acc.username || username.bankAccountNumber === acc.bankAccountNumber){
            req.flash("error", "Username/Bank Account Number Already Exists!");
            ok = 1;
        }
    })

    if(ok === 1){
        res.redirect("back");
    } else {
        try {
            await Dashboard.updateOne({_id: id}, req.body);
            req.flash("success", "Update success!");
    
        }catch(e) {
            req.flash("error", "Update fail!");
        }
    
        res.redirect("back");
    }

}

//[DELETE]/delete/:id
module.exports.deleteAcc = async (req, res) => {
    const id = req.params.id;
    //xóa cứng
    await Dashboard.deleteOne({ _id: id});
    //xóa mềm
    // await Dashboard.updateOne({ _id: id}, {
    //     deleted: true,
    //     deletedAt: new Date()
    // });
    //hiển thị thông báo thành công
    req.flash("success", "Delete Account Success!");

    res.redirect("back");
}


