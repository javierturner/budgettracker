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