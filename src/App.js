import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import logo from "./logo.png";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from "react-icons/wi";

const App = () => {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  const fetchWeather = async (longitude, latitude) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m`
      );
      setWeather(response.data.current);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherForLocation = async (location) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          location
        )}&key=4c3ecdcec2a54965b52291822bb21d52`
      );

      const { lat, lng } = response.data.results[0].geometry;

      await fetchWeather(lng, lat);
    } catch (error) {
      console.error("Error fetching weather data for location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Iligan City coordinates
    fetchWeather(124.2434, 8.2289);
  }, []);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSearch = () => {
    // Reset notificationSent when a new search is performed
    setNotificationSent(false);
    fetchWeatherForLocation(location);
  };

  const showNotification = (message) => {
    if (!notificationSent) {
      if (Notification.permission === "granted") {
        new Notification(message);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(message);
          }
        });
      }
      // Set notificationSent to true to prevent further notifications
      setNotificationSent(true);
    }
  };

  if (isLoading) {
    return <div className="App loading">Loading...</div>;
  }

  if (!weather) {
    return <div className="App">Unable to fetch weather data.</div>;
  }

  const temperatureCelsius = ((weather.temperature_2m - 32) * 5) / 9;

  const weatherConditions = {
    0: { label: "Clear sky", icon: WiDaySunny },
    1: { label: "Mainly clear", icon: WiDaySunny },
    2: { label: "Partly cloudy", icon: WiCloudy },
    3: { label: "Overcast", icon: WiCloudy },
    45: { label: "Fog and depositing rime fog", icon: WiFog },
    48: { label: "Fog and depositing rime fog", icon: WiFog },
    51: { label: "Drizzle Light intensity", icon: WiRain },
    53: { label: "Drizzle Moderate intensity", icon: WiRain },
    55: { label: "Drizzle Dense intensity", icon: WiRain },
    56: { label: "Freezing Drizzle Light intensity", icon: WiRain },
    57: { label: "Freezing Drizzle Dense intensity", icon: WiRain },
    61: { label: "Rain Slight intensity", icon: WiRain },
    63: { label: "Rain Moderate intensity", icon: WiRain },
    65: { label: "Rain Heavy intensity", icon: WiRain },
    66: { label: "Freezing Rain Light intensity", icon: WiSnow },
    67: { label: "Freezing Rain Heavy intensity", icon: WiSnow },
    71: { label: "Snow fall Slight intensity", icon: WiSnow },
    73: { label: "Snow fall Moderate intensity", icon: WiSnow },
    75: { label: "Snow fall Heavy intensity", icon: WiSnow },
    77: { label: "Snow grains", icon: WiSnow },
    80: { label: "Rain showers Slight intensity", icon: WiRain },
    81: { label: "Rain showers Moderate intensity", icon: WiRain },
    82: { label: "Rain showers Violent", icon: WiThunderstorm },
    85: { label: "Snow showers Slight intensity", icon: WiSnow },
    86: { label: "Snow showers Heavy intensity", icon: WiSnow },
    95: { label: "Slight Thunderstorm", icon: WiThunderstorm },
    96: { label: "Thunderstorm with slight hail", icon: WiThunderstorm },
    99: { label: "Thunderstorm with heavy hail", icon: WiThunderstorm },
  };

  const weatherCode = weather.weather_code;
  const currentWeatherInfo = weatherConditions[weatherCode] || { label: "Unknown", icon: null };

  const isDay = weather.is_day === 1;

  const notificationConditions = [
    { code: [51, 53, 55], message: "It's drizzling. Consider bringing an umbrella." },
    { code: [61, 63, 65], message: "It's raining. Don't forget your umbrella or raincoat!" },
    { code: [82], message: "Violent rain showers expected. Be prepared!" },
    { code: [0, 1, 2], message: "It's a nice day! Enjoy the weather." },
    { code: [3, 45, 48], message: "It's overcast or foggy. Dress accordingly." },
    { code: [], message: "Check the weather conditions for your day." },
  ];


  const findNotificationMessage = (weatherCode) => {
    const condition = notificationConditions.find((condition) => condition.code.includes(weatherCode));
    return condition ? condition.message : "Check the weather conditions for your day.";
  };

  const notificationMessage = findNotificationMessage(weatherCode);

  if (notificationMessage !== "Check the weather conditions for your day.") {
    showNotification(notificationMessage);
  }

  return (
    <div className={`App ${isDay ? "day" : "night"}`}>
      <div className="logo-container">
        <img src={logo} alt="App Logo" className="logo" />
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={handleLocationChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="weather-info">
        <p>{weather.time}</p>
        <div className="title">Iligan City Weather Forecast</div>
        <p>
          Latitude: {weather.latitude} Longitude: {weather.longitude}
        </p>
        <p>Humidity: {weather.relative_humidity_2m}</p>
        <p>Precipitation: {weather.precipitation}</p>
        <p>Wind Speed: {weather.wind_speed_10m}</p>
        <p>Surface Pressure: {weather.surface_pressure}</p>
      </div>
      <div className="temperature-container">
        <h1>Temperature</h1>
        <p className="temperature-celsius">
          {temperatureCelsius.toFixed(2)} °C / {weather.temperature_2m} °F
        </p>
        <p className="weather-condition">
          Weather: {currentWeatherInfo.label}
          {currentWeatherInfo.icon && <currentWeatherInfo.icon size={40} />}
        </p>
      </div>
      <div className="notification">
        <p>{notificationMessage}</p>
      </div>
    </div>
  );
};

export default App;