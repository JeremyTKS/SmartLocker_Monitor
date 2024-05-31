document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.dashboard-section');
    const links = document.querySelectorAll('.sidebar-link');
    const logoutButton = document.getElementById('logoutButton');

    // Show the home page by default
    showSection('homePage');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            showSection(sectionId);
        });
    });

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

    function showSection(sectionId) {
        sections.forEach(section => {
            section.style.display = 'none';
        });
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.style.display = 'block';
        }
    }
});
