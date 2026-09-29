import cloudy from "../images/cloudy.png";
import humid from "../images/humid.png";
import snowy from "../images/snow.png";
import storm from "../images/storm.png";
import sunny from "../images/sunny.png";
import thunderstorm from "../images/thunderstorm.png";
import windy from "../images/windy.png";
import { useState } from "react";
import Http from "../Http";
import SearchInput from "./SearchInput";
const http = new Http(import.meta.env.VITE_API_KEY);

const Weather = () => {
  const [weatherData, setWeatherData] = useState(false);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [forecastTimezone, setForecastTimezone] = useState(0);
  const allIcons = {
    "01d": sunny,
    "01n": sunny,
    "02d": cloudy,
    "02n": cloudy,
    "03d": cloudy,
    "03n": cloudy,
    "04d": cloudy,
    "04n": cloudy,
    "09d": storm,
    "09n": storm,
    "10d": storm,
    "10n": storm,
    "11d": thunderstorm,
    "11n": thunderstorm,
    "13d": snowy,
    "13n": snowy,
  };

  const search = async (location) => {
  if (typeof location === "string" && !location.trim()) {
    alert("Please enter a location");
    return;
  }

  try {
    const selectedPlace = typeof location === "string" ? null : location;

    const data = selectedPlace
      ? await http.getWeatherByCoords(selectedPlace.lat, selectedPlace.lon)
      : await http.getWeather(location.trim());

    const icon = allIcons[data.weather[0].icon] || sunny;

    setWeatherData({
      humidity: data.main.humidity,
      wind: data.wind.speed,
      temperature: Math.floor(data.main.temp),
      location: selectedPlace
        ? `${selectedPlace.name}, ${selectedPlace.country}`
        : data.name,
      icon,
    });
    setHourlyForecast([]);

try {
  const forecast = await http.getHourlyForecast(
    data.coord.lat,
    data.coord.lon
  );

  setHourlyForecast(forecast.list.slice(0,6));
  setForecastTimezone(forecast.city.timezone);
} catch (error) {
  console.error(error);
}
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

 const getSuggestions = async (text) => {
  if (!text.trim()) {
    setSuggestions([]);
    return;
  }
  try {
    const places = await http.getLocations(text);
    setSuggestions(places);
  } catch (error) {
    console.error(error);
    setSuggestions([]);
  }
};

  return (
    <div className="weather">
      <div className="card">
        <img
          src={weatherData.icon || sunny}
          className="weather-icon"
          alt="weather icon"
        />
        <div className="temperature">
          {weatherData.temperature !== undefined ? `${weatherData.temperature}°C` : "Search for a location"}
        </div>
        <div className="location">{weatherData.location || "Enter a location"}</div>
       <SearchInput
  onSearch={search}
  getLocations={(text) => http.getLocations(text)}
/>
        <div className="col">
    
          <div className="humidity">
            {weatherData.humidity !== undefined && <img src={humid} className="humidity-icon" alt="humidity icon" />}
          {weatherData.humidity !== undefined ? `Humidity: ${weatherData.humidity}%` : undefined}
          </div>
    
        </div>

        <div className="col">
          <div className="wind">
             {weatherData.wind !== undefined && <img src={windy} className="wind-icon" alt="wind icon" />}
            {weatherData.wind !== undefined ? `Wind: ${weatherData.wind} km/h` : undefined}
         
          </div>
        </div>
        {hourlyForecast.length > 0 && (
  <section className="hourly-forecast">
    <h2>Hourly forecast</h2>
    <div className="hourly-list">
      {hourlyForecast.map((hour) => (
        <div className="hourly-item" key={hour.dt}>
          <time>
            {new Date((hour.dt + forecastTimezone) * 1000)
              .toLocaleTimeString("en-GB", {
                timeZone: "UTC",
                hour: "2-digit",
                minute: "2-digit",
              })}
          </time>
          <img
            src={allIcons[hour.weather[0].icon] || sunny}
            alt={hour.weather[0].description}
          />
          <span>{Math.round(hour.main.temp)}°C</span>
        </div>
      ))}
    </div>
  </section>
)}
      </div>
    </div>
  );
};

export default Weather;
