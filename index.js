import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js"
import {
    getDatabase,
    ref,
    push,
    onValue,
    remove } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js"

import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js"


const firebaseConfig = {
    databaseURL: "https://shopping-cart-56a7d-default-rtdb.asia-southeast1.firebasedatabase.app/",
    apiKey: "AIzaSyCxhFA2fB9cjOS6MJMIRAJqoa4ycyzTaXA",
    authDomain: "shopping-cart-56a7d.firebaseapp.com",
}


const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


const inputEl = document.getElementById("input-el")
const addBtnEl = document.getElementById("add-btn-el")
const shoppingListEl = document.getElementById("shoppingList-el")
const loggedOutView = document.getElementById("logged-out-view")
const loggedInView = document.getElementById("logged-in-view")
const continueWithGoogle = document.getElementById('continue-with-google')
const userName = document.getElementById('user-name')
const logOut = document.getElementById("log-out")

onAuthStateChanged(auth, function (user) {
    if (user) {
        loggedInView.style.display = "block"
        loggedOutView.style.display = "none"
        fetchFromDB()
        showUserName(userName, user)
    } else {
        loggedInView.style.display = "none"
        loggedOutView.style.display = "block"
    }
})

continueWithGoogle.addEventListener('click', function() {
    signInWithPopup(auth, provider)
        .then((result) => {
        })
        .catch((error) => {
            console.error(error.message)
        }) 
})

addBtnEl.addEventListener("click", function () {
    if (inputEl.value) {
        const userShoppingListInDB = ref(database, `users/${auth.currentUser.uid}/shoppingList`)
        push(userShoppingListInDB, inputEl.value)
        clearInputField()
    }
})

logOut.addEventListener('click', function() {
    signOut(auth)
})

function fetchFromDB() {
    clearItemsFromShoppingList()
    const userShoppingListInDB = ref(database, `users/${auth.currentUser.uid}/shoppingList`)
    onValue(userShoppingListInDB, function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearItemsFromShoppingList()
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemId = currentItem[0]
            let currentItemValue = currentItem[1]
            appendItemsToShoppingListEL(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "<h2 class='shopping-message'>No items here yet! Please input an item and hit the 'Add to cart' button.</h2>"
    }
    })
}

function appendItemsToShoppingListEL(item) {
    let itemId = item[0]
    let itemValue = item[1]
    let newEl = document.createElement('li')
    newEl.textContent = itemValue
    newEl.addEventListener('click', function () {
        let exactItemLocationInDB = ref(database, `users/${auth.currentUser.uid}/shoppingList/${itemId}`)
        remove(exactItemLocationInDB)
    })
    shoppingListEl.append(newEl)
}

function showUserName(userElement, user) {
    const displayName = user.displayName
    if(displayName) {
        const userFirstName = displayName.split(" ")[0]
        userElement.textContent = `Hi, ${userFirstName}`
    } else {
        userElement.textContent = `New User`
    }
}

function clearInputField() {
    inputEl.value = ""
}

function clearItemsFromShoppingList() {
    shoppingListEl.innerHTML = ""
}







