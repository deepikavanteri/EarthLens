const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function searchCity() {
  const city = searchInput.value.trim();

  if (city === "") {
    alert("Please enter a city name.");
    return;
  }
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn !== "true") {
    let searchCount = Number(localStorage.getItem("searchCount")) || 0;
    if (searchCount >= 2) {
      alert("Please login to explore more cities.");
      window.location.href = "login.html";
      return;
    }
    searchCount++;
    localStorage.setItem("searchCount", searchCount);
  }
  window.location.href = `city.html?city=${encodeURIComponent(city)}`;
}
searchBtn.addEventListener("click", searchCity);
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchCity();
  }
});
const authBtn = document.getElementById("authBtn");
if (authBtn) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    authBtn.textContent = "Logout";
    authBtn.href = "#";
    authBtn.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("searchCount");
      localStorage.removeItem("pendingCity");
      alert("Logged out successfully.");
      window.location.reload();
    });
  } else {
    authBtn.textContent = "Login";
    authBtn.href = "login.html";
  }
}
const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
  if (localStorage.getItem("isLoggedIn") === "true") {
    loginBtn.textContent = "Logout";
    loginBtn.href = "#";
    loginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("searchCount");
      localStorage.removeItem("pendingCity");
      alert("Logged out successfully!");
      window.location.reload();
    });
  } else {
    loginBtn.textContent = "Login";
    loginBtn.href = "./login.html";
  }
}
