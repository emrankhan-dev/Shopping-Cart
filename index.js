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

const inputEl = document.getElementById("input-el")
const addBtnEl = document.getElementById("add-btn-el")
const shoppingListEl = document.getElementById("shoppingList-el")

addBtnEl.addEventListener("click", function () {
    push(shoppingListInDB, inputEl.value)
    clearInputField()
})

onValue(shoppingListInDB, function (snapshot) {
    if(snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearItemsFromShoppingList()
        for(let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemId = currentItem[0]
            let currentItemValue = currentItem[1]
            appendItemsToShoppingListEL(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items here ....yet"
    }
})

function appendItemsToShoppingListEL(item) {
    let itemId = item[0]
    let itemValue = item[1]
    let newEl = document.createElement('li')
    newEl.textContent = itemValue
    newEl.addEventListener('dblclick', function() {
        let exactItemLocationInDB = ref(database, `shoppingList/${itemId}`)
        remove(exactItemLocationInDB)
    })
    shoppingListEl.append(newEl)
}

function clearInputField() {
    inputEl.value = ""
}

function clearItemsFromShoppingList() {
    shoppingListEl.innerHTML = ""
}





