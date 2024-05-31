import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";

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

// Function to fetch history data
function fetchHistoryData() {
    return new Promise((resolve, reject) => {
        const historyRef = ref(database, 'History');
        onValue(historyRef, (snapshot) => {
            const data = snapshot.val();
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
}

// Function to process the data for the Locker Number
function processLockerNumber(data) {
    const lockerUsage = { "Locker1": 0, "Locker2": 0, "Locker3": 0, "Locker4": 0 };
    for (const timestamp in data) {
        if (data.hasOwnProperty(timestamp)) {
            const record = data[timestamp];
            lockerUsage[record.Locker]++;
        }
    }
    return {
        labels: Object.keys(lockerUsage),
        datasets: [{
            label: 'Locker Usage',
            data: Object.values(lockerUsage),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }]
    };
}

function processDuration(data) {
    const durationBuckets = { "0-30 mins": 0, "30 mins - 1 hr": 0, "1-2 hrs": 0, "2+ hrs": 0 };
    
    // Define an array of colors for each segment
    const segmentColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

    for (const timestamp in data) {
        if (data.hasOwnProperty(timestamp)) {
            const record = data[timestamp];
            const durationMinutes = parseInt(record.duration);
            if (durationMinutes <= 30) {
                durationBuckets["0-30 mins"]++;
            } else if (durationMinutes <= 60) {
                durationBuckets["30 mins - 1 hr"]++;
            } else if (durationMinutes <= 120) {
                durationBuckets["1-2 hrs"]++;
            } else {
                durationBuckets["2+ hrs"]++;
            }
        }
    }
    
    // Convert durationBuckets object into an array of objects for pie chart data
    const pieData = Object.keys(durationBuckets).map((label, index) => ({
        label,
        data: durationBuckets[label],
        backgroundColor: segmentColors[index], // Assign a color from the segmentColors array
    }));

    return {
        labels: pieData.map(data => data.label),
        datasets: [{
            label: 'Usage Duration',
            data: pieData.map(data => data.data),
            backgroundColor: pieData.map(data => data.backgroundColor),
        }]
    };
}

function renderSelectedChart(data) {
    const selecteddataType = document.getElementById('dataType').value;
    let chartData;

    if (selecteddataType === 'lockerNumber') {
        chartData = processLockerNumber(data); // Process data for locker number pie chart
    } else if (selecteddataType === 'duration') {
        chartData = processDuration(data); // Process data for duration pie chart
    }

    const selectedChartCtx = document.getElementById('selectedChart').getContext('2d');
    
    // Destroy the previous chart instance if it exists
    if (window.selectedChartInstance) {
        window.selectedChartInstance.destroy();
    }

    const selectedChart = new Chart(selectedChartCtx, {
        type: 'pie',
        data: chartData,
    });

    window.selectedChartInstance = selectedChart;
}


// Event listener for the dropdown change event
document.getElementById('dataType').addEventListener('change', () => {
    fetchHistoryData().then((data) => {
        renderSelectedChart(data);
    }).catch((error) => {
        console.error('Error fetching data:', error);
    });
});

// Fetch data and render selected chart on load
fetchHistoryData().then((data) => {
    renderSelectedChart(data);
}).catch((error) => {
    console.error('Error fetching data:', error);
});

