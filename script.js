const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function searchCity() {
    const city = searchInput.value.trim();
    if (city === "") {
        alert("Please enter a city name.");
        return;

    }
    window.location.href = `city.html?city=${encodeURIComponent(city)}`;

}
searchBtn.addEventListener("click", searchCity);
searchInput.addEventListener("keypress", function(e){
    if(e.key==="Enter"){
        searchCity();

    }

});