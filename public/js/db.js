let db;

const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function (event) {
    const db =  event.target.result;
    db.createObjectStore('pending', {autoIncrement: true});
};

request.onsuccess = function (event) {
    db = event.target.result;

    if(navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function (event) {
    // log error
    console.log('ERROR!' + event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction('pending', 'readwrite');
    const store = transaction.objectStore('pending');
    store.add(record);
}
// test note 
function checkDatabase() {
    const transaction = db.transaction('pending', 'readwrite');
    const store = transaction.objectStore('pending');
    const getAll = store.getAll();

getAll.result.forEach((element) => {
        fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(element),
        headers: {
        Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
        }).then((response) => {
        console.log("successfully added data");
        return response.json();
    });
});

}

window.addEventListener('online', checkDatabase);