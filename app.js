const apiKey = 'aa0e52003c657b5eac69a3262e0097dd';
const cityInputEl = document.getElementById("city-input");
const formEl = document.querySelector("form");
const weatherDataEl = document.getElementById("weather-data");
const typeOfUnits = document.getElementById("type-of-units");

const savedUnits = localStorage.getItem("typeOfUnits");
if (savedUnits) {
  typeOfUnits.value = savedUnits;
}

async function getWeatherData(cityValue) {
  let units = "metric";
  let symbol = "°C";
  let speed = "m/s";

  if (typeOfUnits.value === "imperial") {
    units = "imperial";
    symbol = "°F";
    speed = "mph";
  } else {
    units = "metric";
    symbol = "°C";
    speed = "m/s";
  }
  
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apiKey}&units=${units}`)

    if(!response.ok) {
      throw new Error("Network response was not ok")
    }

    const data = await response.json()

    const temperature = Math.round(data.main.temp)
    const description = data.weather[0].description
    const icon = data.weather[0].icon
    const details = [
      `Feels like: ${Math.round(data.main.feels_like)}`,
      `Humidity: ${data.main.humidity}%`,
      `Wind speed: ${data.wind.speed} ${speed}`,
    ]

    weatherDataEl.querySelector(".icon").innerHTML = `
      <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">`;
    weatherDataEl.querySelector(".temperature").textContent = `${temperature}${symbol}`;
    weatherDataEl.querySelector(".description").textContent = description;
    weatherDataEl.querySelector(".details").innerHTML = details
      .map((detail) => `<div>${detail}</div>`).join("");


    console.log(data)
   
  } catch (error) {
    weatherDataEl.querySelector(".icon").innerHTML = "";
    weatherDataEl.querySelector(".temperature").textContent = "";
    weatherDataEl.querySelector(".description").textContent = "An error happend, please check spelling";
    weatherDataEl.querySelector(".details").innerHTML = "";
  }
}


formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const cityValue = cityInputEl.value;
  getWeatherData(cityValue);
});

typeOfUnits.addEventListener("change", () => {
  const cityValue = cityInputEl.value;
  localStorage.setItem("typeOfUnits", typeOfUnits.value);
  if (cityValue.trim() !== "") {
    getWeatherData(cityValue);
  }
});

cityInputEl.addEventListener("click", (event) => {
  console.log("clicked");
  cityInputEl.select();
});

