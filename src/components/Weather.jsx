import searchicon from "../images/searchicon.png";
import cloudy from "../images/cloudy.png";
import humid from "../images/humid.png";
import snowy from "../images/snow.png";
import storm from "../images/storm.png";
import sunny from "../images/sunny.png";
import thunderstorm from "../images/thunderstorm.png";
import windy from "../images/windy.png";
import React, { useEffect, useState } from "react";
import Http from "../Http";

const http = new Http(import.meta.env.VITE_API_KEY);

const Weather = () => {
  const [weatherData, setWeatherData] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
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
          {weatherData.temperature || "Undefined"}°C
        </div>
        <div className="location">{weatherData.location || "Enter a location"}</div>
        <div className="searchSection">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter a location"
              value={locationText}
              onChange={(event) => {
                const text = event.target.value;
                setLocationText(text);
                getSuggestions(text);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setSuggestions([]);
                  search(locationText);
                }
              }}
            />

            <img
              src={searchicon}
              className="search-icon"
              alt="search icon"
              onClick={() => search(locationText)}
            />
            {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((place) => (
                  <li key={`${place.name}-${place.lat}-${place.lon}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setLocationText(`${place.name}, ${place.country}`);
                        setSuggestions([]);
                        search(place);
                      }}
                    >
                      {place.name}, {place.country}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="col">
          <img src={humid} className="humidity-icon" alt="humidity icon" />
          <div className="humidity">
            Humidity: {weatherData.humidity || "Undefined"}%
          </div>
        </div>

        <div className="col">
          <img src={windy} className="wind-icon" alt="wind icon" />
          <div className="wind">
            Wind: {weatherData.wind || "Undefined"} km/h
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
