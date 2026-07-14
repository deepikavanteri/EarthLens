const citySearch = document.getElementById("searchCity");
const citySearchBtn = document.getElementById("searchBtn");

function searchAnotherCity() {
  const cityInput = citySearch.value.trim();
  if (cityInput === "") {
    alert("Please enter city name");
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
  window.location.href = `city.html?city=${encodeURIComponent(cityInput)}`;
}
citySearchBtn.addEventListener("click", searchAnotherCity);
citySearch.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchAnotherCity();
  }
});

const params = new URLSearchParams(window.location.search);
const city = params.get("city") || "Tokyo";
const PEXELS_API_KEY =
  "q2GprPuH6BrLr7BiYvWzzhXDeYsNNkiqbbBFCkElYe83hqK4JMFyrAvu";
async function getCityImages() {
  try {
    const queries = [
      `${city} famous landmark`,
      `${city} famous places`,
      `${city} tourism`,
      `${city} city skyline`,
      `${city} architecture`,
    ];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    const randomPage = Math.floor(Math.random() * 10) + 1;
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(randomQuery)}&orientation=landscape&per_page=20&page=${randomPage}`,

      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      },
    );
    const data = await response.json();
    data.photos.sort(() => Math.random() - 0.5);
    displayImages(data.photos);
  } catch (error) {
    console.log("Image Error:", error);
  }
}
function displayImages(photos) {
  if (!photos || photos.length === 0) {
    return;
  }
  document.getElementById("cityImage").src = photos[0].src.landscape;
  for (let i = 1; i <= 6; i++) {
    let img = document.getElementById(`gallery${i}`);
    if (img) {
      img.src = photos[i]?.src.large || photos[0].src.large;
    }
  }
}
getCityImages();

async function getCoordinates() {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`,
    );
    const data = await response.json();
    if (data.length > 0) {
      loadMap(data[0].lat, data[0].lon);
    }
  } catch (error) {
    console.log("Map Error:", error);
  }
}

function loadMap(lat, lon) {
  const map = L.map("map").setView([lat, lon], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  L.marker([lat, lon]).addTo(map).bindPopup(city).openPopup();
}
getCoordinates();

const WEATHER_API_KEY = "517d9880e40a5d9d9760b94fdea2157e";
async function getWeather() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`,
    );
    if (!response.ok) {
      throw new Error("Weather not found");
    }
    const data = await response.json();
    console.log(data);
    updateHero(data);
    updateWeatherCard(data);
    updateTimeSection(data);
  } catch (error) {
    console.log("Weather Error:", error);
  }
}

function updateHero(data) {
  document.getElementById("cityName").textContent = city;
  document.getElementById("countryName").textContent = data.sys.country;
  document.getElementById("heroTemp").textContent =
    Math.round(data.main.temp) + "°C";
  document.getElementById("heroWeather").textContent = data.weather[0].main;
}

function updateWeatherCard(data) {
  document.getElementById("temperature").textContent =
    Math.round(data.main.temp) + "°C";

  document.getElementById("weatherCondition").textContent =
    data.weather[0].description;

  document.getElementById("feelsLike").textContent =
    Math.round(data.main.feels_like) + "°C";

  document.getElementById("humidity").textContent = data.main.humidity + "%";

  document.getElementById("wind").textContent = data.wind.speed + " m/s";

  document.getElementById("visibility").textContent =
    data.visibility / 1000 + " km";

  document.getElementById("pressure").textContent = data.main.pressure + " hPa";

  document.getElementById("clouds").textContent = data.clouds.all + "%";

  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  const weather = data.weather[0].main;

  const weatherCard = document.getElementById("weather-card");
  switch (weather) {
    case "Clear":
      weatherCard.style.backgroundImage = "url('images/sunny.jpg')";
      break;

    case "Clouds":
      weatherCard.style.backgroundImage = "url('images/cloudy.jpg')";
      break;

    case "Rain":
      weatherCard.style.backgroundImage = "url('images/rain.jpg')";
      break;

    case "Snow":
      weatherCard.style.backgroundImage = "url('images/snow.jpg')";
      break;

    case "Thunderstorm":
      weatherCard.style.backgroundImage = "url('images/thunder.jpg')";
      break;

    case "Drizzle":
      weatherCard.style.backgroundImage = "url('images/drizzle.jpg')";
      break;

    case "Mist":
    case "Fog":
    case "Haze":
      weatherCard.style.backgroundImage = "url('images/fog.jpg')";
      break;

    default:
      weatherCard.style.backgroundImage = "url('images/default.jpg')";
  }
}

function updateTimeSection(data) {
  const timezone = data.timezone;

  function convertTime(timestamp) {
    const date = new Date((timestamp + timezone) * 1000);

    return date.toUTCString().slice(17, 22);
  }
  document.getElementById("sunrise").textContent = convertTime(
    data.sys.sunrise,
  );
  document.getElementById("sunset").textContent = convertTime(data.sys.sunset);
  updateClock(timezone);
}
let clockInterval;

function updateClock(offset) {
  if (!offset) {
    console.log("Timezone missing:", offset);
    return;
  }

  clearInterval(clockInterval);

  function tick() {
    const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
    const cityTime = new Date(utc + offset * 1000);
    document.getElementById("localTime").textContent =
      cityTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
  }
  tick();
  clockInterval = setInterval(tick, 1000);
}
getWeather();
