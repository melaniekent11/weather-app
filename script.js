const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const locationName = document.getElementById("locationName");
const temperature = document.getElementById("temperature");
const windSpeed = document.getElementById("windSpeed");
const weatherTime = document.getElementById("weatherTime");
const message = document.getElementById("message");

async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    message.textContent = "Please enter a city name.";
    weatherCard.classList.add("hidden");
    return;
  }

  message.textContent = "Loading...";
  weatherCard.classList.add("hidden");

  try {
    // Step 1: Get coordinates from city name
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found.");
    }

    const place = geoData.results[0];
    const { latitude, longitude, name, country } = place;

    // Step 2: Get current weather from coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const current = weatherData.current;

    locationName.textContent = `${name}, ${country}`;
    temperature.textContent = `${current.temperature_2m} °C`;
    windSpeed.textContent = `${current.wind_speed_10m} km/h`;
    weatherTime.textContent = current.time;

    weatherCard.classList.remove("hidden");
    message.textContent = "";
  } catch (error) {
    message.textContent = error.message || "Something went wrong.";
    weatherCard.classList.add("hidden");
  }
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});

// Load default city on page open
getWeather();