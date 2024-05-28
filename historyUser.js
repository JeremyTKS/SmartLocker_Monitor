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

// Reference to the History directory in the database
const historyRef = ref(database, 'History');

let currentPage = 1;
let rowsPerPage = 5;
let dataCache = [];

const tbody = document.getElementById('historyTableBody');
const rowsPerPageSelect = document.getElementById('rowsPerPage');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');

rowsPerPageSelect.addEventListener('change', (e) => {
    rowsPerPage = parseInt(e.target.value);
    currentPage = 1;  // Reset to first page whenever rows per page changes
    renderTable();
});

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

nextPageButton.addEventListener('click', () => {
    if (currentPage < Math.ceil(dataCache.length / rowsPerPage)) {
        currentPage++;
        renderTable();
    }
});

// Function to fetch and display data
function fetchData() {
    onValue(historyRef, (snapshot) => {
        const data = snapshot.val();
        dataCache = [];
        for (const dateTime in data) {
            dataCache.push({ dateTime, ...data[dateTime] });
        }
        renderTable();
    }, (error) => {
        console.error("Error fetching data:", error);
    });
}

// Function to render table with pagination
function renderTable() {
    tbody.innerHTML = '';  // Clear the table body

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, dataCache.length);

    for (let i = startIndex; i < endIndex; i++) {
        const info = dataCache[i];
        const row = document.createElement('tr');

        const dateTimeCell = document.createElement('td');
        const dateOnly = info.dateTime.split(' ')[0]; // Extract date part
        dateTimeCell.textContent = dateOnly;
        row.appendChild(dateTimeCell);

        const userCell = document.createElement('td');
        userCell.textContent = info.User || 'N/A';
        row.appendChild(userCell);

        const startTimeCell = document.createElement('td');
        startTimeCell.textContent = info.dateTime.split(' ')[1] || 'N/A';
        row.appendChild(startTimeCell);

        const endTimeCell = document.createElement('td');
        endTimeCell.textContent = info.endtime || 'N/A';
        row.appendChild(endTimeCell);

        const durationCell = document.createElement('td');
        durationCell.textContent = info.duration || 'N/A';
        row.appendChild(durationCell);

        const lockerCell = document.createElement('td');
        lockerCell.textContent = info.Locker || 'N/A';
        row.appendChild(lockerCell);

        const otpCell = document.createElement('td');
        otpCell.textContent = info.otp || 'N/A';
        row.appendChild(otpCell);

        tbody.appendChild(row);
    }

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === Math.ceil(dataCache.length / rowsPerPage);
}


// Fetch data on page load and then every 5 seconds
window.onload = () => {
    fetchData();
    setInterval(fetchData, 5000);  // Fetch data every 5000 milliseconds (5 seconds)
};

// Add event listener to export button
const exportButton = document.getElementById('exportButton');
exportButton.addEventListener('click', () => {
    // Call a function to handle export logic
    exportDataToCSV();
});

// Function to handle export logic
function exportDataToCSV() {
    // Convert dataCache to CSV format
    const csvContent = convertDataToCSV(dataCache);

    // Create a Blob object to store the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Create a link element to trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'history_data.csv';

    // Simulate a click event to trigger download
    link.click();
}

// Function to convert data to CSV format
function convertDataToCSV(data) {
    let csv = [];
    // Add header row
    csv.push('Date,User,Start Time,End Time,Duration,Locker,OTP');

    // Add data rows
    data.forEach(info => {
        const dateOnly = info.dateTime.split(' ')[0];
        const startTime = info.dateTime.split(' ')[1] || 'N/A';
        const endTime = info.endtime || 'N/A';
        const duration = info.duration || 'N/A';
        const locker = info.Locker || 'N/A';
        const otp = info.otp || 'N/A';

        csv.push(`${dateOnly},${info.User},${startTime},${endTime},${duration},${locker},${otp}`);
    });

    // Join rows with newline character and return CSV data
    return csv.join('\n');
}
