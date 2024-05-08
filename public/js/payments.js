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



// const paymentDetails = document.querySelectorAll(".payment-detail");
// paymentDetails.forEach(payment => {
//     payment.addEventListener("click", () => {
//         const modalDetailPayment = document.querySelector(".modal_detail_payment");
//         modalDetailPayment.classList.remove("d-none");
//         const modelOverlay = document.querySelector(".modal__overlay");
//         const btnClose = document.querySelector(".btn-close");
//         modelOverlay.addEventListener("click", () => {
//             modalDetailPayment.classList.add('d-none');
//         });
//         btnClose.addEventListener("click", () => {
//             modalDetailPayment.classList.add('d-none');
//         });
//     })
// });

// bắt sự kiện chuyển trang
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

//pagination
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

//filter
const btnDropdown1 = document.querySelector(".btn-dropdown1");
const filterForm = document.querySelector(".filter__form");
const btnDropdown2 = document.querySelector(".btn-dropdown2");
const sortForm = document.querySelector(".sort__form");
const filterRadioBtns = document.querySelectorAll("input[name='filter__method']");
const filterByTotalSpendingForm = document.querySelector(".form-group-totalSpending");
const formSubmitDisplay = document.querySelector(".form-submit-display");


btnDropdown1.addEventListener("click", () => {
    filterForm.classList.add("show");
});
document.addEventListener("click", (e) => {
    if(!e.target.closest('.filter__form') && e.target !== btnDropdown1) {
        filterForm.classList.remove('show');
    }
});

btnDropdown2.addEventListener("click", () => {
    sortForm.classList.add("show");
});
document.addEventListener("click", (e) => {
    if(!e.target.closest('.sort__form') && e.target !== btnDropdown2) {
        sortForm.classList.remove('show');
    }
});
const filterTotalSpendingBtns = document.querySelectorAll("input[name='totalSpending']");
const filterBtn = document.querySelector(".filter__btn");

if(filterTotalSpendingBtns.length > 0) {
    let url = new URL(window.location.href);
    new_url = new URL(url.origin + url.pathname);
    filterTotalSpendingBtns.forEach(btn => {
        btn.addEventListener("change", () => {
            const value = btn.getAttribute("value");
            if(value == "500"){
                filterBtn.setAttribute("value", value);
            } else if(value == "1000"){
                filterBtn.setAttribute("value", value);
            }
            filterBtn.addEventListener("click", () => {
                const filterSelect = filterBtn.getAttribute("value");
                if(filterSelect === "500") {
                    new_url.searchParams.set("filter", "1");
                } else if(filterSelect === "1000"){
                    new_url.searchParams.set("filter", "2");
                } else if(filterSelect === ""){
                    new_url.searchParams.delete("filter");
                }
                window.location.href = new_url.href;
            });
        
        })
    })

}
// console.log("ok");
//sort 
const sortRadios = document.querySelectorAll("input[name='sortByName']");
const sortBtn = document.querySelector(".sort__btn");

if(sortRadios.length > 0){
    let url = new URL(window.location.href);
    new_url = new URL(url.origin + url.pathname);
    sortRadios.forEach(btn => {
        btn.addEventListener("change", () => {
            const value = btn.getAttribute("value");
            if(value == "asc"){
                sortBtn.setAttribute("value", value);
            } else if(value == "desc"){
                sortBtn.setAttribute("value", value);
            }
            sortBtn.addEventListener("click", () => {
                const sortSelect = sortBtn.getAttribute("value");
                if(sortSelect === "asc") {
                    new_url.searchParams.set("sort", "1");
                } else if(sortSelect === "desc"){
                    new_url.searchParams.set("sort", "2");
                } else if(sortSelect === ""){
                    new_url.searchParams.delete("sort");
                }
                window.location.href = new_url.href;
            });
        
        })
    })
}

// console.log("ok");