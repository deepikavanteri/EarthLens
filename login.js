const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (email === "" || password === "") {
    alert("Please enter email and password.");
    return;
  }

  localStorage.setItem("isLoggedIn", "true");
  localStorage.removeItem("searchCount");
  alert("Login successful! You can now explore unlimited cities.");

  const pendingCity = localStorage.getItem("pendingCity");
  if (pendingCity) {
    localStorage.removeItem("pendingCity");

    window.location.href = `city.html?city=${encodeURIComponent(pendingCity)}`;
  } else {
    window.location.href = "index.html";
  }
});
