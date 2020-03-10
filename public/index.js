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
    const tbody = document.querySelector("#tbody");
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

