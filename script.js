// defining tabs and panels
const tabs = document.querySelectorAll('[role="tablist"] button');
const panels = document.querySelectorAll('[role="tabpanel"]');

// adding event listeners for tab buttons

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove 'active' class from all panels
        panels.forEach(panel => panel.classList.remove('active'));

        // Set 'aria-selected' to false for all tabs
        tabs.forEach(t => t.setAttribute('aria-selected', 'false'));

        // Add 'active' class to the clicked tab's panel
        const panelId = tab.getAttribute('aria-controls');
        document.getElementById(panelId).classList.add('active');

        // Set 'aria-selected' to true for the clicked tab
        tab.setAttribute('aria-selected', 'true');
    });
});
