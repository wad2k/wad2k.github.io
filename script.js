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

const USERNAME = "wad2k";
const API_KEY = "3d69d5290aa0b4c923d5ecc49b1ab22d";

async function fetchTopAlbums() {
    try {
        const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getTopAlbums&user=${USERNAME}&api_key=${API_KEY}&period=3month&limit=9&format=json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data); // Log the API response
        displayTopAlbums(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Display top albums in the music tab
function displayTopAlbums(data) {
    const albumGrid = document.querySelector('.album-grid');
    albumGrid.innerHTML = ''; // Clear previous content

    const albums = data.topalbums.album.slice(0, 9); // Limit to top 9 albums
    albums.forEach(album => {
        const albumItem = document.createElement('div');
        albumItem.classList.add('album'); // Add album class
        albumItem.innerHTML = `
            <strong>${album.name}</strong> by ${album.artist.name}<br>
            <img src="${album.image[2]['#text']}" alt="${album.name} cover" style="width:100%; height: auto;">
        `;
        albumGrid.appendChild(albumItem);
    });
}

// Fetch top tracks
async function fetchTopTracks() {
    try {
        const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${USERNAME}&api_key=${API_KEY}&period=3month&limit=10&format=json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data); // Log the API response
        displayTopTracks(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Display top tracks in the music tab
function displayTopTracks(data) {
    const trackList = document.querySelector('.track-list');
    trackList.innerHTML = ''; // Clear previous content

    const tracks = data.toptracks.track.slice(0, 10); // Limit to top 10 tracks
    tracks.forEach(track => {
        const listItem = document.createElement('li'); // Create list item for each track
        listItem.innerHTML = `
            <strong>${track.name}</strong> by ${track.artist.name}<br>
        `;
        trackList.appendChild(listItem); // Append the list item to the track list
    });
}

// Call the fetch function when the music tab is active
document.querySelector('[aria-controls="music"]').addEventListener('click', () => {
    const albumGrid = document.querySelector('.album-grid');
    if (!albumGrid.hasChildNodes()) { // Prevent multiple fetches
        fetchTopAlbums();
        fetchTopTracks(); // Fetch top tracks when the music tab is clicked
    }
});