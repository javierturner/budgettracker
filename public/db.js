let db;
//create a new database named budget
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = request(event) {
    const db = event.target.result;
    db.createObjectStore("pending", {autoIncrement: true});
};

