// DOM
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const errorDiv = document.getElementById("error");

const homeSection = document.getElementById("home-section");
const favSection = document.getElementById("fav-section");

// NAV
document.getElementById("home-btn").onclick = () => {
  homeSection.classList.remove("hidden");
  favSection.classList.add("hidden");
};

document.getElementById("fav-btn").onclick = () => {
  homeSection.classList.add("hidden");
  favSection.classList.remove("hidden");
  loadFavorites();
};

// SEARCH
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const query = input.value.trim();
  if (!query) return showError("Please enter a book name");

  fetchBooks(query);
  input.value = "";
});

// FETCH BOOKS
async function fetchBooks(query) {
  try {
    results.innerHTML = "<p>Loading...</p>";
    errorDiv.classList.add("hidden");

    const res = await fetch(`https://openlibrary.org/search.json?q=${query}`);
    if (!res.ok) throw new Error("Failed to fetch books");

    const data = await res.json();
    displayBooks(data.docs || []);
  } catch (err) {
    showError(err.message);
  }
}

// DISPLAY BOOKS (SAFE VERSION)
function displayBooks(books) {
  results.innerHTML = "";

  if (!books.length) {
    results.innerHTML = "<p>No books found</p>";
    return;
  }

  books.slice(0, 6).forEach((book) => {
    // SAFE DATA (NO undefined EVER)
    const title = book.title || "No title available";

    const author =
      book.author_name && book.author_name.length > 0
        ? book.author_name[0]
        : "Unknown author";

    const cover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "https://placehold.co/120x180?text=No+Image";

    // CARD
    const card = document.createElement("div");
    card.classList.add("card2");

    card.innerHTML = `
      <img src="${cover}" class="cover">
      <h5>${title}</h5>
      <p>${author}</p>

      <button class="listen-btn">🔊 Listen</button>
      <button class="save-btn">⭐ Save</button>
    `;

    // EVENTS
    card.querySelector(".listen-btn").onclick = () => {
      speak(title);
    };

    card.querySelector(".save-btn").onclick = () => {
      saveFav({ title, author, cover });
    };

    results.appendChild(card);
  });
}

// SPEECH
function speak(text) {
  if (!text) return;

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speechSynthesis.speak(speech);
}

// SAVE FAVORITES
function saveFav(book) {
  let favs = JSON.parse(localStorage.getItem("novels")) || [];

  if (!book || !book.title) return;

  const exists = favs.some((b) => b.title === book.title);
  if (!exists) {
    favs.push(book);
    localStorage.setItem("novels", JSON.stringify(favs));
  }
}

// LOAD FAVORITES
function loadFavorites() {
  const container = document.getElementById("favorites");
  container.innerHTML = "";

  const favs = JSON.parse(localStorage.getItem("novels")) || [];

  if (favs.length === 0) {
    container.innerHTML = "<p>No favorites yet ⭐</p>";
    return;
  }

  favs.forEach((book) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const title = book.title || "No title";
    const author = book.author || "Unknown author";
    const cover = book.cover || "https://via.placeholder.com/120x180";

    card.innerHTML = `
      <img src="${cover}" class="cover">
      <h3>${title}</h3>
      <p>${author}</p>
    `;

    container.appendChild(card);
  });
}

// ERROR HANDLER
function showError(msg) {
  results.innerHTML = "";
  errorDiv.textContent = msg;
  errorDiv.classList.remove("hidden");
}
