// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD_dTdWejxi9Uq6qnMHFqjoL2s4_WdXfWk",
    authDomain: "smart-locker-cb27d.firebaseapp.com",
    databaseURL: "https://smart-locker-cb27d-default-rtdb.firebaseio.com",
    projectId: "smart-locker-cb27d",
    storageBucket: "smart-locker-cb27d.appspot.com",
    messagingSenderId: "507297342371",
    appId: "1:507297342371:web:a86c6839429191faf77016"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get references to Firebase services
const db = getDatabase(app);

document.getElementById("login").addEventListener('click', async function(e){
    e.preventDefault();

    // Store a reference to the form and input fields
    const form = document.querySelector('form');
    const submitButton = document.getElementById("login");

    const passwordInput = document.getElementById('password');

    // Check if any of the required fields are empty
    if (passwordInput.value === "" ) {
        alert("Please fill out the password.");

        // Re-enable the submit button
        submitButton.disabled = false;
    } else {
        // Check if the entered password matches the one in the database
        const passwordRef = ref(db, 'Admin/Security/Password');
        const passwordSnapshot = await get(passwordRef);

        if (passwordSnapshot.exists() && passwordSnapshot.val() === passwordInput.value) {
            alert("Password is correct! Proceed to Admin Page.");
            // Password matches, you can proceed with your logic or redirect to another page
            window.location.href = 'dashboard.html';
        } else {
            alert("Incorrect password. Please try again.");
            // Clear the password input
            passwordInput.value = "";

            // Re-enable the submit button
            submitButton.disabled = false;
        }
    }
});

// Add event listener to eye icon
document.getElementById("eyeIcon").addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    // Toggle password visibility
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.src = 'img/eye_icon_open.png'; // Change the eye icon to open
    } else {
        passwordInput.type = 'password';
        eyeIcon.src = 'img/eye_icon_close.png'; // Change the eye icon to closed
    }
});

// Disable back button functionality
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};
