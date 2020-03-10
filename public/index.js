if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("serviceWorker.js").then(reg => {
            console.log("We found your service worker file", reg);
        });
    });
};

let transactions = [];
let myChart;

fetch("/api/transaction").then(response => response.json())
.then(data => {
    //save database information
    transactions = data;
    populateTotal();
    populateTable();
    populateChart();
});

function populateTotal() {
    const total = transactions.reduce((total, t) => {
        return total + parseInt(t.value);
    }, 0);

    const totalEl = document.querySelector("#total");
    totalEl.textContent = total;
}

function populateTable() {
    const tbody = document.querySelector("#transactionBody");
    tbody.innerHTML = "";

    transactions.forEach(transaction => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${transaction.name}</td>
        <td>${transaction.value}</td>`;

        tbody.appendChild(tr);
    });
};

function populateChart() {
    //copy the array and reverse
    const reversed = transactions.slice().reverse();
    let sum = 0;

    //creating dates for chart
    const labels = reversed.map(t => {
        const date = new Date(t.date);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    });

    const data = reversed(t => {
        sum += parseInt(t.value);
        return sum;
    });

    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById("myChart").getContext("2d");

    myChart = new myChart(ctx, {
        type: "line",
        date: {
            labels,
            datasets: [
                {
                    label: "Total over time",
                    fill: true,
                    backgroundColor: "#6666ff",
                    data
                }
            ]
        }
    })
}

function sendTransaction(isAdding) {
    const nameEl = document.querySelector("#transactionName");
    const amountEl = dacument.querySelector("#transactionAmount");
    const errorEl = document.querySelector("#form .error");

    if (nameEl.value === "" || amountEl.value === "") {
        errorEl.textContent = "You are missing information";
        return;
    } else {
        errorEl.textContent = ""
    }
}

const transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString()
};

if (!isAdding) {
    transaction.value *= -1;
}

//add to the beginning of the current data array
transactions.unshift(transaction);

populateChart();
populateTable();
populateTotal();

fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
    }
}).then(response => response.json())
.then(data => {
    if (data.errors) {
        errorEl.textContent = "You are missing information";
    } else {
        nameEl.value = "";
        amountEl.value = "";
    }
}).catch(err => {
    saveRecord(transaction);

    nameEl.value = "";
    amountEl.value = "";
});

document.querySelector("#addBtn").addEventListener("click", function(event) {
    event.preventDefault();
    sendTransaction(true);
});

document.querySelector("#subtractBtn").addEventListener("click", function(event) {
    event.preventDefault();
    sendTransaction(false);
});