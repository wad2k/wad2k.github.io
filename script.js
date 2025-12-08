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

// ---- BOOKS (Open Library + local JSON) ----

// Fetch books.json
async function fetchBooks() {
  try {
    const response = await fetch("books.json");
    const books = await response.json();

    displayBooks(books);
  } catch (error) {
    console.error("Error loading books.json:", error);
  }
}

// Display books in XP tables
async function displayBooks(books) {
  const crTable = document.querySelector("#currently-reading-table tbody");
  const readTable = document.querySelector("#read-table tbody");

  crTable.innerHTML = "";
  readTable.innerHTML = "";

  for (const book of books) {
    const bookData = await fetchOpenLibrary(book.isbn);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><img src="${bookData.cover}" style="width:40px;height:auto;border:1px solid #888;"></td>
      <td><a href="${bookData.link}" target="_blank">${book.title}</a></td>
      <td>${book.author}</td>
    `;

    if (book.status === "reading") {
      crTable.appendChild(tr);
    } else {
      readTable.appendChild(tr);
    }
  }
}

// Fetch metadata from Open Library
async function fetchOpenLibrary(isbn) {
  try {
    const res = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
    const data = await res.json();

    const cover = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;

    return {
      cover,
      link: `https://openlibrary.org${data.key}`
    };

  } catch {
    return {
      cover: "",
      link: "#"
    };
  }
}

// Load books only when Books tab first shown
document.querySelector('[aria-controls="books"]').addEventListener("click", () => {
  const table = document.querySelector("#read-table tbody");
  if (!table.hasChildNodes()) fetchBooks();
});
