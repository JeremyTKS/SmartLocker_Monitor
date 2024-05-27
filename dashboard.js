// Add event listeners to sidebar links
const sidebarLinks = document.querySelectorAll('.sidebar-link');
sidebarLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const sectionId = event.target.getAttribute('data-section');
        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.style.display = 'none';
        });
        // Show the selected section
        document.getElementById(sectionId).style.display = 'block';
    });
});


const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
        window.location.href = 'index.html'; // Redirect to index.html on logout
        // Disable back button to prevent unauthorized access
        history.pushState(null, null, 'index.html');
        window.addEventListener('popstate', function(event) {
            history.pushState(null, null, 'index.html');
        });
    }
});
