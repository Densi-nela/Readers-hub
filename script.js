//get the form element
const form = document.getElementById("search-form");
//get the search element
const input = document.getElementById("search-input");
//where results is displayed
const results = document.getElementById("results");
///Error message container
const errorDiv = document.getElementById("error");
//sections selection for the pages
const homeSection = document.getElementById("home-section");
const favSection = document.getElementById("fav-section");
//navbar
document.getElementById("home-btn").addEventListener("click", () => {
  homeSection.classList.remove("hidden");
  favSection.classList.add("hidden");
});
document.getElementById("fav-btn").addEventListener("click", () => {
  homeSection.classList.add("hidden");
  favSection.classList.remove("hidden");
  loadFavorites();
});
//function to fetch books
async function fetchBooks(query) {
  try {
    results.innerHTML = "<p>Loading...</p>";
    errorDiv.classList.add("hidden");

    const res = await fetch(`https://openlibrary.org/search.json?q=${query}`);

    if (!res.ok) throw new Error("Failed to fetch books");

    const data = await res.json();
    displayBooks(data.docs);
  } catch (error) {
    showError(error.message);
  }
}

//search button
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = input.value.trim();

  if (!query) {
    showError("Please enter a book name");
    return;
  }

  fetchBooks(query); //call fetchbook function
  input.value = "";
});
//function to show error
function showError(message) {
  results.innerHTML = "";
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}
//function to display the books
function displayBooks(books) {
  results.innerHTML = "";

  if (!books.length) {
    results.innerHTML = "<p>No books found</p>";
    return;
  }

  books.slice(0, 6).forEach((book) => {
    const title = book.title || "No title";
    const author = book.author_name?.[0] || "Unknown";
    const cover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "";

    const card = document.createElement("div");
    card.classList.add("card2");

    card.innerHTML = `
      <h5>${title}</h5>
      <p><strong>Author:</strong> ${author}</p>
      ${cover ? `<img src="${cover}" width="120">` : ""}
      <br>
      <button onclick="speak('${title}')">🔊 Listen</button>
      <button onclick="saveFav('${title}')">⭐ Save</button>
    `;

    results.appendChild(card);
  });
}
//function for speech
function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speechSynthesis.speak(speech);}
  //function load Favourites