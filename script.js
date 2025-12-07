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

document.querySelectorAll('.social-btn').forEach(button => {
  button.addEventListener('click', () => {
    const url = button.dataset.url;
    if (!url) return;
    window.open(url, '_blank'); // always open in new tab
  });
});


// ---- LAST FM API ----

const USERNAME = "wad2k";
const API_KEY = "3d69d5290aa0b4c923d5ecc49b1ab22d";

async function fetchTopAlbums() {
    try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getTopAlbums&user=${USERNAME}&api_key=${API_KEY}&format=json&period=3month`);
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
    albumGrid.innerHTML = '';

    const albums = data.topalbums.album.slice(0, 9); // top 9

    albums.forEach(album => {
        const albumItem = document.createElement('div');
        albumItem.classList.add('album');

        const imgUrl = album.image[2]['#text'] || album.image[1]['#text'] || '';

        albumItem.innerHTML = `
            <img src="${imgUrl}" alt="${album.name} cover">
            <div><strong>${album.name}</strong></div>
            <div>${album.artist.name}</div>
        `;

        albumGrid.appendChild(albumItem);
    });
}


// Fetch top tracks
async function fetchTopTracks() {
    try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${USERNAME}&api_key=${API_KEY}&period=3month&limit=10&format=json`);
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
    const tbody = document.querySelector('.track-table tbody');
    tbody.innerHTML = ''; // Clear previous content

    const tracks = data.toptracks.track.slice(0, 10); // top 10 tracks

    tracks.forEach((track, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${track.name}</td>
            <td>${track.artist.name}</td>
        `;

        tbody.appendChild(row);
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


// ---- GOODREADS RSS FEEDS ----

async function fetchBooks() {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const currentlyReadingUrl = 'https://www.goodreads.com/review/list_rss/146960271?key=S9HAyydJiF2o_T85NAU70PPmysbn0m2v6V1qN3gNDdKYiR0f&shelf=currently-reading';
    const readUrl = 'https://www.goodreads.com/review/list_rss/146960271?key=S9HAyydJiF2o_T85NAU70PPmysbn0m2v6V1qN3gNDdKYiR0f&shelf=read';

    try {
        // Fetch Currently Reading books
        const currentlyReadingResponse = await fetch(proxyUrl + encodeURIComponent(currentlyReadingUrl));
        const currentlyReadingData = await currentlyReadingResponse.json();
        const currentlyReadingDoc = new DOMParser().parseFromString(currentlyReadingData.contents, "text/xml");
        const currentlyReadingItems = currentlyReadingDoc.querySelectorAll("item");

        const currentlyReadingBooks = Array.from(currentlyReadingItems).map(item => ({
            title: item.querySelector("title").textContent,
            link: item.querySelector("link").textContent,
        }));

        // Log currently reading books
        console.log('Currently Reading:', currentlyReadingBooks);

        // Fetch Read books
        const readResponse = await fetch(proxyUrl + encodeURIComponent(readUrl));
        const readData = await readResponse.json();
        const readDoc = new DOMParser().parseFromString(readData.contents, "text/xml");
        const readItems = readDoc.querySelectorAll("item");

        const readBooks = Array.from(readItems).map(item => ({
            title: item.querySelector("title").textContent,
            link: item.querySelector("link").textContent,
        }));

        // Log read books
        console.log('Read Books:', readBooks);

        // Call display function
        displayBooks(currentlyReadingBooks, readBooks);
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
    }
}

// Function to load books when the page is ready or when the books tab is clicked
function loadBooks() {
    fetchBooks(); // Call the fetchBooks function
}

// Call loadBooks when the page is fully loaded
window.onload = loadBooks;

// Display the books in the UI
function displayBooks(currentlyReading, read) {
    const currentlyReadingContainer = document.getElementById('currently-reading');
    const readContainer = document.getElementById('read');

    // Clear previous content
    currentlyReadingContainer.innerHTML = '';
    readContainer.innerHTML = '';

    // Display Currently Reading
    currentlyReading.forEach(book => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${book.link}" target="_blank">${book.title}</a>`;
        currentlyReadingContainer.appendChild(listItem);
    });

    // Display Read Books
    read.forEach(book => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${book.link}" target="_blank">${book.title}</a>`;
        readContainer.appendChild(listItem);
    });
}

