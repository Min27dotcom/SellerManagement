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
    const countAccs = await Dashboard.countDocuments(find);

    let objectPagination = paginationHelper({
        limitItems: 5,
        currentPage: 1,
    }, req.query, countAccs);

    const dashboard = await Dashboard.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
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



//render route
    res.render("admin/pages/dashboard/index", {
        pageTitle: "Dashboard",
        userName: "John Doe",
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
    console.log(ids);

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

// //[GET] /dashboard/create
// module.exports.create = async (req, res) => {
//     res.render("admin/pages/dashboard/create", {
//         pageTitle: "Add Account",
//     });
// }

//[POST] /dashboard/create
module.exports.createPost = async (req, res) => {
    if(req.file){
        req.body.avatar = `/uploads/${req.file.filename}`
    }
    const newAcc = new Dashboard(req.body);
    await newAcc.save();
    res.redirect("/dashboard");
}

//[GET] /dashboard/update/:id
module.exports.update = async (req, res) => {
    try {
        //find account to update
        const findAcc = {
            _id: req.params.id
        }
        const acc = await Dashboard.findOne(findAcc);
        console.log(acc);
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
    try {
        await Dashboard.updateOne({_id: id}, req.body);
        req.flash("success", "Update success!");

    }catch(e) {
        req.flash("error", "Update fail!");
    }
    res.redirect("back");
}

//[DELETE]/delete/:id
module.exports.deleteAcc = async (req, res) => {
    const id = req.params.id;
    //xóa cứng
    // await Dashboard.deleteOne({ _id: id});
    //xóa mềm
    await Dashboard.updateOne({ _id: id}, {
        deleted: true,
        deletedAt: new Date()
    });
    //hiển thị thông báo thành công
    req.flash("success", "Update status success!");

    res.redirect("back");
}


