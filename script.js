const app = document.querySelector('.appnew');
const paginationEl = document.querySelector('#pagination');
const searchInput = document.querySelector('#search');
let menuElements = document.getElementsByTagName('th');

const companiesUrl = 'https://recruitment.hal.skygate.io/companies';
const incomesUrl = 'https://recruitment.hal.skygate.io/incomes/';

let companies = [];
let lastMonth = [];
let result = [];
//Get incomes for currency company
const getIncome = param => {
  return fetch(`${incomesUrl}${param.id}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then(res => {
      let totalIncome = res.incomes.reduce((a, b) => {
        return a + parseFloat(b.value);
      }, 0);
      let averageIncome = totalIncome / res.incomes.length;
      let elem = companies.findIndex(el => el.id == param.id);
      let latestData = new Date(
        Math.max.apply(
          null,
          res.incomes.map(el => {
            return new Date(el.date);
          })
        )
      );
      lastMonth = [];
      res.incomes.map(el => {
        if (
          new Date(el.date).getMonth() === latestData.getMonth() &&
          new Date(el.date).getFullYear() == latestData.getFullYear()
        ) {
          lastMonth.push(el);
        }
      });
      let lastMonthValue = lastMonth.reduce((a, b) => {
        return a + parseFloat(b.value);
      }, 0);
      companies[elem].totalIncomes = totalIncome.toFixed(2);
      companies[elem].average = averageIncome.toFixed(2);
      companies[elem].lastMonth = lastMonthValue.toFixed(2);
    })
    .catch(error => console.log(error));
};

//Get all info about companies
const allData = () => {
  return fetch(companiesUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then(res => {
      companies = [...res];
      return companies;
    })
    .then(res => {
      for (let company of res) {
        getIncome(company).then(() => {
          displayData(companies, app, rows, currentPage);
          setupPagination(companies, paginationEl, rows);
        });
      }
    })
    .catch(error => console.log(error));
};

// Display data with pagination
let currentPage = 1;
let rows = 50;
function displayData(items, wrapper, rowsPage, page) {
  wrapper.innerHTML = '';
  page--;
  let start = rowsPage * page;
  let end = start + rowsPage;
  let paginatedItems = items.slice(start, end);
  for (let i = 0; i < paginatedItems.length; i++) {
    let item = paginatedItems[i];
    const tr = document.createElement('tr');
    let output = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.city}</td>
                <td>${item.totalIncomes}</td>
                <td>${item.average}</td>
                <td>${item.lastMonth}</td>
             `;
    tr.innerHTML = output;
    wrapper.appendChild(tr);
  }
}

//Pagintation
function setupPagination(items, wrapper, rowsPage) {
  wrapper.innerHTML = '';
  let pageCount = Math.ceil(items.length / rowsPage);
  for (let i = 1; i < pageCount + 1; i++) {
    let btn = paginationButton(i, items);
    wrapper.appendChild(btn);
  }
}

//Pagination buttons
function paginationButton(page, companies) {
  let button = document.createElement('button');
  button.innerText = page;
  if (currentPage == page) button.classList.add('active');
  button.addEventListener('click', function() {
    currentPage = page;
    displayData(companies, app, rows, currentPage);
    let currentBtn = document.querySelector('button.active');
    currentBtn.classList.remove('active');
    button.classList.add('active');
  });
  return button;
}

//Sort
function sortFun(param, key, order) {
  currentPage = 1;
  page = 1;
  param = param.sort((a, b) => {
    if (typeof a[key] === 'number') {
      if (order) {
        return a[key] - b[key];
      } else {
        return b[key] - a[key];
      }
    } else if (typeof a[key] === 'string') {
      if (order) {
        return a[key].localeCompare(b[key]);
      } else {
        return b[key].localeCompare(a[key]);
      }
    }
  });
}

//Search
function searchData() {
  currentPage = 1;
  page = 1;
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

// Added event listeners
document.addEventListener('load', allData());

searchInput.addEventListener('keyup', () => {
  searchData();
  displayData(result, app, rows, currentPage);
  setupPagination(result, paginationEl, rows);
});

for (let c = 0; c < menuElements.length; c++) {
  let order = false;
  let sortIcon = menuElements[c].querySelector('.sort-icon');
  menuElements[c].addEventListener('click', () => {
    let keys = Object.keys(companies[0]);
    let accurateKey = keys[c];
    for (let i = 0; i < menuElements.length; i++) {
      if (
        menuElements[i].querySelector('i') &&
        menuElements[i] != menuElements[c]
      ) {
        menuElements[i].querySelector('.sort-icon').innerHTML = '';
        order = false;
      }
    }
    order = !order;
    if (order) {
      sortIcon.innerHTML = '<i class="fas fa-sort-up"></i>';
    }
    if (!order) {
      sortIcon.innerHTML = '<i class="fas fa-sort-down"></i>';
    }

    if (result.length > 0) {
      sortFun(result, accurateKey, order);
      displayData(result, app, rows, currentPage);
      setupPagination(result, paginationEl, rows);
    } else {
      sortFun(companies, accurateKey, order);
      displayData(companies, app, rows, currentPage);
      setupPagination(companies, paginationEl, rows);
    }
  });
}
