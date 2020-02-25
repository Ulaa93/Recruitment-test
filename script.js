const app = document.querySelector('.appnew');

const companies = 'https://recruitment.hal.skygate.io/companies';
const incomes = 'https://recruitment.hal.skygate.io/incomes/';
fetch(companies)
  .then(response => {
    return response.json();
  })

  .then(res => {
    for (let company of res) {
      fetch(`${incomes}${company.id}`)
        .then(response => {
          return response.json();
        })
        .then(res => {
          console.log(res);

          let totalIncome = res.incomes.reduce((a, b) => {
            return a + parseFloat(b.value);
          }, 0);

          let averageIncome = totalIncome / res.incomes.length;
          console.log(averageIncome);
          const tr = document.createElement('tr');

          let output = `
            
            <th class="company-id">${company.id}</th>
            <th>${company.name}</th>
            <th>${company.city}</th>
            <th>${totalIncome.toFixed(2)}</th>
            <th>${averageIncome.toFixed(2)}</th>
            <th></th>
         `;

          tr.innerHTML = output;
          app.appendChild(tr);
        });
    }
  });
