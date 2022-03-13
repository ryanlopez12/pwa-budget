// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'PWA-budgetTracker-' and set it to version 1
const request = indexedDB.open("PWA-budgetTracker-", 1);

request.onupgradeneeded = function (event) {
  //save a reference to the database
  const db = event.target.result;
  //create an object (transaction) 
  db.createObjectStore("new_transaction", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    uploadTransaction();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};
//save local transaction
function saveRecord(record) {
  const transaction = db.transaction(["new_transaction"], "readwrite");
  const budgetObjectStore = transaction.objectStore("new_transaction");

  budgetObjectStore.add(record);
}
//upload
function uploadTransaction() {
  const transaction = db.transaction(["new_transaction"], "readwrite");
  const budgetObjectStore = transaction.objectStore("new_transaction");
  const getAll = budgetObjectStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(["new_transaction"], "readwrite");
          const budgetObjectStore = transaction.objectStore("new_transaction");
          budgetObjectStore.clear();

          alert("All saved transactions submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

window.addEventListener("online", uploadTransaction);
