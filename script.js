// ---- WEBSITE INTERACTIVITY ----


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


// ---- LAST FM API ----

const USERNAME = "wad2k"
const API_KEY = "3d69d5290aa0b4c923d5ecc49b1ab22d"

async function fetchTopAlbums() {
    try {
        const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getTopAlbums&user=${USERNAME}&api_key=${API_KEY}&format=json&period=3month`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data); // Log the API response
        displayTopAlbums(data); // Display albums
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Display top albums in the music tab
function displayTopAlbums(data) {
    const musicPanel = document.getElementById('music'); // Define musicPanel here
    const albums = data.topalbums.album.slice(0,9);


    const albumGrid = document.createElement('div');
    albumGrid.classList.add('album-grid'); 

    albums.forEach(album => {
        const albumItem = document.createElement('div');
        albumItem.classList.add('album'); // Add album class
        albumItem.innerHTML = `
            <strong>${album.name}</strong> by ${album.artist.name}<br>
            <img src="${album.image[2]['#text']}" alt="${album.name} cover" style="width:100%;">
        `;
        albumGrid.appendChild(albumItem);
    });

    musicPanel.appendChild(albumGrid);
}

// Call the fetch function when the music tab is active
document.querySelector('[aria-controls="music"]').addEventListener('click', () => {
    console.log("Music tab clicked."); // Confirm the click is registered
    fetchTopAlbums(); // Call the function directly
});

