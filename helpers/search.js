module.exports = (query) => {
    let objectSearch = {
        keyword: ""
        // regex: "",
    }
    if(query.keyword){
        objectSearch.keyword = query.keyword;
        //tìm kiếm username bằng regex
        const regex = new RegExp(keyword, "i");
        // find.username =  regex;
        objectSearch.regex = regex;
    }

    return objectSearch;
}