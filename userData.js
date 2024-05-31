// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Firebase configuration
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
const database = getDatabase(app);

// Reference to the User_Data directory in the database
const userDataRef = ref(database, 'User_Data');

let currentPageUserData = 1;
let rowsPerPageUserData = 5;
let userDataCache = [];

const userDataTableBody = document.getElementById('userDataTableBody');
const rowsPerPageSelectUserData = document.getElementById('rowsPerPageUserData');
const prevPageButtonUserData = document.getElementById('prevPageUserData');
const nextPageButtonUserData = document.getElementById('nextPageUserData');

rowsPerPageSelectUserData.addEventListener('change', (e) => {
    rowsPerPageUserData = parseInt(e.target.value);
    currentPageUserData = 1;  // Reset to first page whenever rows per page changes
    renderUserData();
});

prevPageButtonUserData.addEventListener('click', () => {
    if (currentPageUserData > 1) {
        currentPageUserData--;
        renderUserData();
    }
});

nextPageButtonUserData.addEventListener('click', () => {
    if (currentPageUserData < Math.ceil(userDataCache.length / rowsPerPageUserData)) {
        currentPageUserData++;
        renderUserData();
    }
});

function fetchUserData() {
    onValue(userDataRef, (snapshot) => {
        const userData = snapshot.val();
        userDataCache = [];

        for (const username in userData) {
            const user = userData[username];
            userDataCache.push({
                Username: username,
                Email: user.Email || 'N/A',
                PhoneNumber: user.PhoneNumber || 'N/A'
            });
        }

        renderUserData();
    }, (error) => {
        console.error("Error fetching user data:", error);
    });
}

function renderUserData() {
    userDataTableBody.innerHTML = '';  // Clear the table body

    const startIndex = (currentPageUserData - 1) * rowsPerPageUserData;
    const endIndex = Math.min(startIndex + rowsPerPageUserData, userDataCache.length);

    for (let i = startIndex; i < endIndex; i++) {
        const userData = userDataCache[i];
        const row = document.createElement('tr');

        const usernameCell = document.createElement('td');
        usernameCell.textContent = userData.Username || 'N/A';
        row.appendChild(usernameCell);

        const phoneNumberCell = document.createElement('td');
        phoneNumberCell.textContent = userData.PhoneNumber || 'N/A';
        row.appendChild(phoneNumberCell);

        const emailCell = document.createElement('td');
        emailCell.textContent = userData.Email || 'N/A';
        row.appendChild(emailCell);

        userDataTableBody.appendChild(row);
    }

    prevPageButtonUserData.disabled = currentPageUserData === 1;
    nextPageButtonUserData.disabled = currentPageUserData === Math.ceil(userDataCache.length / rowsPerPageUserData);
}

// Fetch user data on page load and then every 5 seconds
window.onload = () => {
    fetchUserData();
    setInterval(fetchUserData, 5000);  // Fetch data every 5000 milliseconds (5 seconds)
};

// Add event listener to export button for user data
const exportButtonUserData = document.getElementById('exportButtonUserData');
exportButtonUserData.addEventListener('click', () => {
    // Call a function to handle export logic for user data
    exportUserDataToCSV();
});

// Function to handle export logic for user data
function exportUserDataToCSV() {
    // Convert userDataCache to CSV format
    const csvContent = convertUserDataToCSV(userDataCache);

    // Create a Blob object to store the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Create a link element to trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'user_data.csv';

    // Simulate a click event to trigger download
    link.click();
}

// Function to convert user data to CSV format
function convertUserDataToCSV(userData) {
    let csv = [];
    // Add header row
    csv.push('Username,Phone Number,Email');

    // Add data rows
    userData.forEach(user => {
        const username = user.Username || 'N/A';
        const phoneNumber = user.PhoneNumber || 'N/A';
        const email = user.Email || 'N/A';

        csv.push(`${username},${phoneNumber},${email}`);
    });

    // Join rows with newline character and return CSV data
    return csv.join('\n');
}
