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

document.addEventListener('DOMContentLoaded', () => {
    const userDataSection = document.getElementById('userData');
    const userRowsPerPage = document.getElementById('userRowsPerPage');
    const userDataTableBody = document.getElementById('userDataTableBody');
    const userPrevPage = document.getElementById('userPrevPage');
    const userNextPage = document.getElementById('userNextPage');
    const userExportButton = document.getElementById('userExportButton');

    let currentPage = 1;
    let rowsPerPage = parseInt(userRowsPerPage.value);
    let userData = [];

    // Fetch user data from Firebase
    const fetchUserData = () => {
        const userDataRef = ref(database, 'User_Data');
        onValue(userDataRef, (snapshot) => {
            const data = snapshot.val();
            userData = [];
            for (const userId in data) {
                if (data.hasOwnProperty(userId)) {
                    const user = data[userId];
                    userData.push({
                        username: user.Username,
                        phone: user.PhoneNumber,
                        email: user.Email
                    });
                }
            }
            renderTable();
        });
    };

    const renderTable = () => {
        userDataTableBody.innerHTML = '';
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = userData.slice(start, end);

        pageData.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.phone}</td>
                <td>${user.email}</td>
            `;
            userDataTableBody.appendChild(row);
        });

        userPrevPage.disabled = currentPage === 1;
        userNextPage.disabled = end >= userData.length;
    };

    userRowsPerPage.addEventListener('change', () => {
        rowsPerPage = parseInt(userRowsPerPage.value);
        currentPage = 1;
        renderTable();
    });

    userPrevPage.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    userNextPage.addEventListener('click', () => {
        if ((currentPage * rowsPerPage) < userData.length) {
            currentPage++;
            renderTable();
        }
    });

    userExportButton.addEventListener('click', () => {
        // Add export functionality here
        exportUserDataToCSV(userData);
    });

    fetchUserData();
});

// Function to export user data to CSV
function exportUserDataToCSV(userData) {
    const csvContent = "data:text/csv;charset=utf-8,"
        + userData.map(user => `${user.username},${user.phone},${user.email}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_data.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
}

