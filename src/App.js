import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import logo from "./logo.png";

const longitude = "124.2434";
const latitude = "8.2289";

function App() {
  const [weather, setWeather] = useState(null);

  const fetchWeather = async (longitude, latitude) => {
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m`
      );
      setWeather(response.data.current);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeather(longitude, latitude);
  }, []);

  if (!weather) {
    return <div className="App loading">Loading...</div>;
  }

  const temperatureCelsius = ((weather.temperature_2m - 32) * 5) / 9;

  const weatherConditions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog and depositing rime fog",
    48: "Fog and depositing rime fog",
    51: "Drizzle: Light intensity",
    53: "Drizzle: Moderate intensity",
    55: "Drizzle: Dense intensity",
    56: "Freezing Drizzle: Light intensity",
    57: "Freezing Drizzle: Dense intensity",
    61: "Rain: Slight intensity",
    63: "Rain: Moderate intensity",
    65: "Rain: Heavy intensity",
    66: "Freezing Rain: Light intensity",
    67: "Freezing Rain: Heavy intensity",
    71: "Snow fall: Slight intensity",
    73: "Snow fall: Moderate intensity",
    75: "Snow fall: Heavy intensity",
    77: "Snow grains",
    80: "Rain showers: Slight intensity",
    81: "Rain showers: Moderate intensity",
    82: "Rain showers: Violent",
    85: "Snow showers: Slight intensity",
    86: "Snow showers: Heavy intensity",
    95: "Thunderstorm: Slight",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  const weatherCode = weather.weather_code;
  const currentWeather = weatherConditions[weatherCode] || "Unknown";

  return (
    <div className="App">
      <div className="logo-container">
        <img src={logo} alt="App Logo" className="logo" />
      </div>
      <div className="weather-info">
        <p>{weather.time}</p>
        <div className="title">Iligan City Weather Forecast</div>
        <p>
          Longitude: {longitude}, Latitude: {latitude}
        </p>
        <p>Humidity: {weather.relative_humidity_2m}</p>
        <p>Precipitation: {weather.precipitation}</p>
        <p>Wind Speed: {weather.wind_speed_10m}</p>
        <p>Surface Pressure: {weather.surface_pressure}</p>
      </div>
      <div className="temperature-container">
        <h1>Temperature</h1>
        <p className="temperature-celsius">{temperatureCelsius.toFixed(2)} °C / {weather.temperature_2m} °F</p>
        <p className="weather-condition">Weather: {currentWeather}</p>
      </div>
    </div>
  );
}

export default App;