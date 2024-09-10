import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js"
import {
    getDatabase,
    ref,
    push,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js"
const firebaseConfig = {
    databaseURL: "https://shopping-cart-56a7d-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")
// UI-EL
const inputEl = document.getElementById("input-el")
const addBtnEl = document.getElementById("add-btn-el")
const clearAllBtnEl = document.getElementById("clear-all-btn-el")
const shoppingListEl = document.getElementById("shoppingList-el")

addBtnEl.addEventListener("click", function () {
    push(shoppingListInDB, inputEl.value)
    inputEl.value = ""
})

onValue(shoppingListInDB, function (snapshot) {
    let snapshotExists = snapshot.exists()
    if (snapshotExists) {
            let itemsArray = Object.values(snapshot.val())
            shoppingListEl.innerHTML = ""
            for (let i = 0; i < itemsArray.length; i++) {
            appendItemsToShoppingListEL(itemsArray[i])
        }
    }
    
    
})

function appendItemsToShoppingListEL(item) {
    shoppingListEl.innerHTML += `<li>${item}</li>`
}





