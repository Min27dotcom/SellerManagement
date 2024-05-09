function Validator(options) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;

        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];
        
        // Lặp qua từng rule & kiểm tra
        // Nếu có lỗi thì dừng việc kiểm
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }
        
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // Khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();
            var isFormValid = true;

            // Lặp qua từng rules và validate
            options.rules.forEach(function (rule) {

                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Trường hợp submit với javascript
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        
                        switch(input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                // console.log(values[input.name]);
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }
                // Trường hợp submit với hành vi mặc định
                else {
                    formElement.submit();
                }
            }
        }

        // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
        options.rules.forEach(function (rule) {

            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function (inputElement) {
               // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                } 
            });
        });
    }

}

// Định nghĩa rules
// Nguyên tắc của các rules:
// 1. Khi có lỗi => Trả ra message lỗi
// 2. Khi hợp lệ => Không trả ra cái gì cả (undefined)
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined :  message || 'Enter this field!'
        }
    };
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined :  message || 'This field must be email!';
        }
    };
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined :  message || `Enter min ${min} chars!`;
        }
    };
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Value incorrect!';
        }
    }
}
//xử lý ẩn/ hiện filter/ sort form
const btnDropdown1 = document.querySelector(".btn-dropdown1");
const btnDropdown2 = document.querySelector(".btn-dropdown2");
const filterForm = document.querySelector(".filter__form");
const sortForm = document.querySelector(".sort__form");
const app = document.querySelector(".app");

function ToggleFilterForm(){
    filterForm.classList.toggle("show");
}

function ToggleSortForm(){
    sortForm.classList.toggle("show");
}

btnDropdown1.addEventListener("click", () => {
    ToggleFilterForm();
});
btnDropdown2.addEventListener("click", ToggleSortForm);

document.addEventListener("click", (e) => {
    if(!e.target.closest('.filter__form') && e.target !== btnDropdown1) {
        filterForm.classList.remove('show');
    }
});

document.addEventListener("click", (e) => {
    if(!e.target.closest('.sort__form') && e.target !== btnDropdown2) {
        sortForm.classList.remove('show');
    }
});
// kết thúc xử lý ẩn/ hiện filter/ sort form
// xử lý ẩn hiện filter selections
const filterRadioBtns = document.querySelectorAll("input[name='filter__method']");
const filterByAgeForm = document.querySelector(".form-group-age");
const filterByStatusForm = document.querySelector(".form-group-status");
const formSubmitDisplay = document.querySelector(".form-submit-display");

const findSelected = () => {
    const methodSelected = document.querySelector("input[name='filter__method']:checked").value;
    if(methodSelected === 'by_age'){
        filterByAgeForm.classList.add("show");
        filterByStatusForm.classList.remove("show");
        const ageBtns = document.querySelectorAll("input[name='age']");
        ageBtns.forEach(ageBtn => {
            ageBtn.addEventListener("change", ()=>{
                const ageSelected = document.querySelector("input[name='age']:checked").value;
                if(ageSelected === 'Age <= 25' || ageSelected === '26 <= Age <= 45' || ageSelected === 'Age >= 46'){
                    formSubmitDisplay.classList.add("show");
                }
            });

        });

    } 
    else if(methodSelected === 'by_status'){
        filterByStatusForm.classList.add("show");
        filterByAgeForm.classList.remove("show");
        const statusBtns = document.querySelectorAll("input[name='status']");
        statusBtns.forEach(statusBtn => {
            statusBtn.addEventListener("change", ()=>{
                const statusSelected = document.querySelector("input[name='status']:checked").value;
                if(statusSelected === 'active' || statusSelected === 'inactive' ){
                    formSubmitDisplay.classList.add("show");
                }
            });

        });
    } 
}

filterRadioBtns.forEach(radioBtn => {
    radioBtn.addEventListener("change", findSelected);
})
// xử lý ẩn hiện sort selections
const usernameSortRadioBtns = document.querySelectorAll("input[name='username']");
const formSubmitDisplay2 = document.querySelector(".form-submit-display2");

usernameSortRadioBtns.forEach(radioBtn => {
    radioBtn.addEventListener("change", () => {
        const usernameSelected = document.querySelector("input[name='username']:checked").value;
        if(usernameSelected === 'desc' || usernameSelected === 'asc') {
            formSubmitDisplay2.classList.add("show");
        }
    });
});
// kết thúc xử lý ẩn hiện filter selections
// bắt sự kiện lọc
//lọc theo trạng thái & lọc theo độ tuổi khách hàng
const filterMethodBtns = document.querySelectorAll("input[name='filter__method']");
const filterStatusBtns = document.querySelectorAll("input[name='status']");
const filterAgeBtns = document.querySelectorAll("input[name='age']");
const filterBtn = document.querySelector(".filter__btn");

if(filterMethodBtns.length > 0){
    let url = new URL(window.location.href);
    new_url = new URL(url.origin + url.pathname)
    filterMethodBtns.forEach(btn => {
        btn.addEventListener("change", () => {
            const value = btn.getAttribute("value");
            if(value === 'by_status'){
                filterStatusBtns.forEach(status => {
                    status.addEventListener("change", () => {
                        const statusValue = status.getAttribute("value");
                        filterBtn.setAttribute("value", statusValue);
                        filterBtn.addEventListener("click", () => {
                            const statusFilterBtnClick = filterBtn.getAttribute("value");
                            if(statusFilterBtnClick === 'blocked') {
                                url.searchParams.set("blocked", true);
                            } else if(statusFilterBtnClick === 'unblocked') {
                                url.searchParams.set("blocked", false);
                            } else {
                                url.searchParams.delete("blocked");
                            }
                            window.location.href = url.href;
                        })
                    });
                });
            } else if(value === 'by_age') {
                filterAgeBtns.forEach(age => {
                    age.addEventListener("change", () => {
                        const statusValue = age.getAttribute("filter");
                        filterBtn.setAttribute("filter", statusValue);
                        filterBtn.addEventListener("click", () => {
                            const statusFilterBtnClick = filterBtn.getAttribute("filter");
                            if(statusFilterBtnClick === 'age <= 25') {
                                url.searchParams.set("agefilter", "1");
                            } else if(statusFilterBtnClick === '26 <= age <= 45') {
                                url.searchParams.set("agefilter", "2");
                            } else if(statusFilterBtnClick === 'age >= 46'){
                                url.searchParams.set("agefilter", "3");
                            } else {
                                url.searchParams.delete("agefilter");
                            }
                            window.location.href = url.href;
                        })
                    });
                });
            }
        });
    })
}

//sort by username
const sortRadios = document.querySelectorAll("input[name='sortByName']");
const sortBtn = document.querySelector(".sort__btn");

if(sortRadios.length > 0){
    let url = new URL(window.location.href);
    new_url = new URL(url.origin + url.pathname)
    sortRadios.forEach(btn => {
        btn.addEventListener("change", () => {
            const value = btn.getAttribute("value");
            sortBtn.setAttribute("value", value);
            sortBtn.addEventListener("click", () => {
                const valueSortClick = sortBtn.getAttribute("value");
                console.log(valueSortClick);
                if(valueSortClick === 'asc') {
                    url.searchParams.set("sort", "1");
                } else if(valueSortClick === 'desc') {
                    url.searchParams.set("sort", "2");
                } else {
                    url.searchParams.delete("sort");
                }
                window.location.href = url.href;
            })
        });
    })
}

//form search
const formSearch = document.querySelector("#form-search");
const searchBtn = document.querySelector(".header__search-btn");
if(formSearch){
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        new_url = new URL(url.origin + url.pathname);
        const keyword = e.target.elements.keyword.value;
        if(keyword){
            new_url.searchParams.set("keyword", keyword);
        } else {
            new_url.searchParams.delete("keyword");
        }
        
        window.location.href = new_url.href;        
    });
}

//change block
const btnChangeBlockeds = document.querySelectorAll("[btn-change-blocked]");
if(btnChangeBlockeds.length > 0){
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");
    btnChangeBlockeds.forEach(btn => {
        btn.addEventListener("click", () => {
            const blockCurrent = btn.getAttribute("data-status");
            const id = btn.getAttribute("data-id");
            let blockChange = "";
            if(blockCurrent == 'inactive'){
                blockChange = false;
            } else {
                blockChange = true;
            }
            const action = path + `/${blockChange}/${id}?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
        })
    });
}

//check box: bắt sự kiện khi click vào các checkbox-status
const table = document.querySelector('[checkbox-multi]');
if(table){
    const inputCheckAll = table.querySelector("input[name='checkall']");
    const inputIds = table.querySelectorAll("input[name='id'");

    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked){
            inputIds.forEach(input => {
                input.checked = true;
            })
        } else {
            inputIds.forEach(input => {
                input.checked = false;
            })
        }
    })

    inputIds.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = table.querySelectorAll("input[name='id']:checked").length;
            if(countChecked == inputIds.length){
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    })
}

//change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const table = document.querySelector('[checkbox-multi]');
        const inputChecked = table.querySelectorAll("input[name='id']:checked");
        
        const typeChange = e.target.elements.type.value;
        if(typeChange == "delete-all"){
            const isConfirm = confirm("Are you sure you want to delete all");
            if(!isConfirm){
                return;
            }
        }
        if(inputChecked.length > 0) {
            let ids = [];
            const inputIds = table.querySelector("input[name='ids']");

            inputChecked.forEach(input => {
                const id = input.value;
                ids.push(id);
            })

            inputIds.value = ids.join(", ");

            formChangeMulti.submit();
        } else {
            alert("Please select min a record")
        }
    });
}

//show alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
    const closeAlert = document.querySelector('[close-alert]');
    const time = parseInt(showAlert.getAttribute('data-time'));
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
}

//upload image
// console.log("ok");
// const uploadImage = document.querySelector('[upload-image]');
// if(uploadImage) {
//     const uploadImageInput = document.querySelector('[upload-image-input]');
//     const uploadImagePreview = document.querySelector('[upload-image-preview]');
//     uploadImageInput.addEventListener("change", (e) => {
//         const file = e.target.files[0];
//         if(file) {
//             uploadImagePreview.src = URL.createObjectURL(file);
//         }
//     })
// }
// console.log("ok");

//delete acc
const buttonDeletes = document.querySelectorAll("[button-delete]");
if(buttonDeletes.length > 0) {
    const formDeleteAcc = document.querySelector("#form-delete-acc");
    const path = formDeleteAcc.getAttribute("data-path");
    buttonDeletes.forEach(btn => {
        btn.addEventListener("click", () => {
            const isConfirm = confirm("Are you sure to delete?");
            if(isConfirm) {
                const id = btn.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;
                // console.log(action);
                formDeleteAcc.action = action;
                formDeleteAcc.submit();
            }
        });
    });
};


// pagination
// Lấy tất cả các thẻ li có class pagination-item
var paginationItems = document.querySelectorAll('.pagination-item');

// Lặp qua mỗi thẻ li
paginationItems.forEach(function(item) {
    // Lắng nghe sự kiện click trên thẻ a bên trong thẻ li
    item.querySelector('.pagination-item__link').addEventListener('click', function(event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ a
        
        // Loại bỏ class 'pagination-active' khỏi tất cả các thẻ li
        paginationItems.forEach(function(item) {
            item.classList.remove('pagination-item--active');
        });
        
        // Thêm class 'pagination-active' vào thẻ li được nhấp vào
        item.classList.add('pagination-item--active');
    });
});
const linkPaginations = document.querySelectorAll("[link-pagination]");
if(linkPaginations){
    let url = new URL(window.location.href);
    linkPaginations.forEach(link => {
        link.addEventListener("click", () => {
            const page = link.getAttribute("link-pagination");
            url.searchParams.set("page", page);
            window.location.href = url.href;
        })
    })
}