const app = document.querySelector('.appnew');
const sortId = document.querySelector('.sort-id');
const sortName = document.querySelector('.sort-name');
const sortCity = document.querySelector('.sort-city');
const sortTotal = document.querySelector('.sort-total');
const sortAverage = document.querySelector('.sort-average');
const sortLast = document.querySelector('.sort-last');
const searchInput = document.getElementById('search');

const companiesUrl = 'https://recruitment.hal.skygate.io/companies';
const incomesUrl = 'https://recruitment.hal.skygate.io/incomes/';

let companies = [];

const getIncome = param => {
  return fetch(`${incomesUrl}${param.id}`)
    .then(response => {
      return response.json();
    })
    .then(res => {
      // console.log(xd);
      console.log(companies);
      let totalIncome = res.incomes.reduce((a, b) => {
        return a + parseFloat(b.value);
      }, 0);
      let averageIncome = totalIncome / res.incomes.length;
      let el = companies.findIndex(el => el.id == param.id);
      // console.log(el);
      companies[el].totalIncomes = totalIncome.toFixed(2);
      companies[el].average = averageIncome.toFixed(2);
      // console.log(el);
      // console.log(companies);
      // render();
      return companies;
    })
    .then(() => {
      return companies;
    });
  // console.log(companies.id);
  return companies;

  //   console.log(xd);

  //   return;
};

const allData = () => {
  return fetch(companiesUrl)
    .then(response => {
      return response.json();
    })
    .then(res => {
      companies = [...res];
      return companies;
    })
    .then(() => {
      return companies;
    })
    .then(res => {
      for (let company of res) {
        getIncome(company).then(() => {
          //   console.log(companies);
          //   companies = companies;
          //   return response;
          displayData(companies, app, rows, currentPage);
          setupPagination(companies, paginationEl, rows);
        });
      }
    });
};

const paginationEl = document.querySelector('#pagination');
let currentPage = 1;
let rows = 50;
function displayData(items, wrapper, rowsPage, page) {
  wrapper.innerHTML = '';
  page--;
  let start = rowsPage * page;
  let end = start + rowsPage;
  let paginatedItems = items.slice(start, end);
  //   console.log(paginatedItems);
  for (let i = 0; i < paginatedItems.length; i++) {
    // console.log(items[i]);
    let item = paginatedItems[i];
    const tr = document.createElement('tr');
    // console.log(companies);
    // compare(res, id);
    let output = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.city}</td>
                <td>${item.totalIncomes}</td>
                <td>${item.average}</td>

                <td></td>
             `;

    tr.innerHTML = output;
    wrapper.appendChild(tr);
  }
}
function setupPagination(items, wrapper, rowsPage) {
  wrapper.innerHTML = '';

  let pageCount = Math.ceil(items.length / rowsPage);
  for (let i = 1; i < pageCount + 1; i++) {
    let btn = paginationButton(i, items);
    wrapper.appendChild(btn);
  }
}

function paginationButton(page, companies) {
  let button = document.createElement('button');
  button.innerText = page;

  if (currentPage == page) button.classList.add('active');

  button.addEventListener('click', function() {
    currentPage = page;
    displayData(companies, app, rows, currentPage);
    // console.log(currentPage, page);
    let currentBtn = document.querySelector('button.active');
    // console.log(currentBtn);
    currentBtn.classList.remove('active');

    button.classList.add('active');
  });

  return button;
}
//
//
//
//END OF PAGINATION
//
//
//
//
// DisplayList(list_items, list_element, rows, current_page);
// SetupPagination(list_items, pagination_element, rows);
//
//
//
//
//
//
//
// app.addEventListener('load', () => {
//   allData()
//     .then(() => {
//       return companies;
//     })
//     .then(() => {
//       displayData(companies, app, rows, currentPage);
//       setupPagination(companies, paginationEl, rows);
//     });
// });
//
//
//

// allData()
//   .then(() => {
//     return companies;
//   })
//   .then(() => {
//     displayData(companies, app, rows, currentPage);
//     setupPagination(companies, paginationEl, rows);
//   });

//
//
// allData();
document.addEventListener(
  'load',
  allData()
  // // .then(() => {
  // //   companies = companies;
  // //   return companies;
  // // })
  // .then(() => {
  //   displayData(companies, app, rows, currentPage);
  //   setupPagination(companies, paginationEl, rows);
  // })
);
//
//
//

// function sortData(param) {
//     companies.sort((a, b) => {
//       return a.param - b.param;
//     });
//     console.log(companies);
//   }

//
//
//
//
//
//
//
//
//
//
//
//
//

//
//
//
//
let orderId = false;
let orderName = false;
let orderCity = false;
let orderTotal = false;
let orderAverage = false;
let orderLast = false;

// function sortData(x, y) {
//   order = !order;
//   if (typeof x === Number)
//     companies = companies.sort((a, b) => {
//       if (order) {
//         return x - y;
//       } else {
//         return y - x;
//       }
//     });
//   else {
//     // order = !order;
//     companies = companies.sort((a, b) => {
//       if (order) {
//         return x.localeCompare(y);
//       } else {
//         return y.localeCompare(x);
//       }
//     });
//   }
// }

let order = false;
function sortFun(param, eventAdd) {
  //   var sortOrder = 1;
  //   if (param[0] === '-') {
  //     sortOrder = -1;
  //     param = param.substr(1);
  //   }
  order = !order;
  //   eventAdd.addEventListener('click', () => {
  //     order = !order;
  //     sortFun(param);
  //   });
  return function(a, b) {
    if (order) {
      return a[param] - b[param];
    } else {
      return b[param] - a[param];
    }
  };
}

function sortDyn(key, order = 'asc') {
  //   if (order === 'desc') {
  //     sort_order = -1;
  //   }
  return function(a, b) {
    var sort_order = 0;

    // a should come before b in the sorted order
    if (a[key] < b[key]) {
      return (sort_order = -1);
      // a should come after b in the sorted order
    } else if (a[key] > b[key]) {
      return (sort_order = 1);
      // a and b are the same
    }
    return order === 'desc' ? sort_order * -1 : sort_order;
  };
}

// console.log(companies);
sortId.addEventListener('click', () => {
  // {

  //   orderId = !orderId;
  //   companies = companies.sort((a, b) => {
  //     if (orderId) {
  //       return a.id - b.id;
  //     } else {
  //       return b.id - a.id;
  //     }
  //   sortFun('id');
  companies.sort(sortFun('id'));
  //   companies.sort(sortDyn('id'));
  // });

  //   sortData(a.id, b.id);
  displayData(companies, app, rows, currentPage);
  setupPagination(companies, paginationEl, rows);
});

sortName.addEventListener('click', () => {
  orderName = !orderName;
  companies = companies.sort((a, b) => {
    if (orderName) {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });
  displayData(companies, app, rows, currentPage);
  setupPagination(companies, paginationEl, rows);
});

sortCity.addEventListener('click', () => {
  orderCity = !orderCity;
  companies = companies.sort((a, b) => {
    if (orderCity) {
      return a.city.localeCompare(b.city);
    } else {
      return b.city.localeCompare(a.city);
    }
  });
  displayData(companies, app, rows, currentPage);
  setupPagination(companies, paginationEl, rows);
});

sortTotal.addEventListener('click', () => {
  //   orderTotal = !orderTotal;
  //   companies = companies.sort((a, b) => {
  //     if (orderTotal) {
  //       return a.totalIncomes - b.totalIncomes;
  //     } else {
  //       return b.totalIncomes - a.totalIncomes;
  //     }
  //   });
  companies.sort(sortFun('totalIncomes'));

  displayData(companies, app, rows, currentPage);
  setupPagination(companies, paginationEl, rows);
});

sortAverage.addEventListener('click', () => {
  orderAverage = !order;
  companies = companies.sort((a, b) => {
    if (order) {
      return a.average - b.average;
    } else {
      return b.average - a.average;
    }
  });
  displayData(companies, app, rows, currentPage);
  setupPagination(companies, paginationEl, rows);
});
// sortLast.addEventListener(
//   'click',
//   allData().then(companies => {
//     companies = companies.sort((a, b) => {
//       return a.lastIncome - b.lastIncome;
//     });
//     displayData(companies, app, rows, currentPage);
//     setupPagination(companies, paginationEl, rows);
//   })
// );

//
let result = [];
searchInput.addEventListener('keyup', () => {
  searchData();
  displayData(result, app, rows, currentPage);
  setupPagination(result, paginationEl, rows);
});

function searchData() {
  filterData = searchInput.value.toUpperCase();
  result = [];
  for (let i = 0; i < companies.length; i++) {
    for (let prop in companies[i]) {
      if (
        companies[i][prop]
          .toString()
          .toUpperCase()
          .includes(filterData) &&
        !result.includes(companies[i])
      ) {
        result.push(companies[i]);
      }
    }
  }
}
