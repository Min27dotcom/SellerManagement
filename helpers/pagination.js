module.exports = (objectPagination, query, countAccs) => {
    if(query.page){
        objectPagination.currentPage = parseInt(query.page);
    }
    
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    //lấy ra tổng số acc
    const totalPages = Math.ceil(countAccs / objectPagination.limitItems);
    objectPagination.totalPages = totalPages;
    return objectPagination;
}