import React, { useState, useEffect } from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";

const apiKey = "a6ce2cc0b7a08924a5a16ca43ee042c3";
// Get your own "Current Weather Data" API key for free at https://openweathermap.org/api
const tempUnit = "metric";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Berlin&appid=${apiKey}&units=${tempUnit}`
      );
      const data = await response.json();
      setWeatherData(data);
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <Search weatherData={setWeatherData} />
      <CurrentWeather weatherData={weatherData} />
    </div>
  );
};

const Search = (props) => {
  const [city, setCity] = useState("");
  const { weatherData: setWeatherData } = props;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${tempUnit}`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      console.log(data);
      setWeatherData(data);
      //const dayOneDescription = data.weather[0].description;
      setCity("");
    } catch (error) {
      console.error(error.message);
      setCity("");
      alert("City not found. Please try again with a different city.");
    }
  };

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="submit">
        <input
          type="text"
          placeholder="Enter city name"
          onChange={handleChange}
          value={city}
          required
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

const CurrentWeather = (props) => {
  const { weatherData } = props;

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const wind = Math.round(weatherData.wind.speed * 3.6);
  const temp = Math.round(weatherData.main.temp);
  const feelsLike = Math.round(weatherData.main.feels_like);
  const description = weatherData.weather[0].description;
  const capitalizedDescription =
    description.charAt(0).toUpperCase() + description.slice(1);
  const visibility = weatherData.visibility / 1000;

  const unixTimestamp = weatherData.dt;
  const date = new Date(unixTimestamp * 1000);
  const formattedTime = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
  const month = date.toLocaleString("default", { month: "short" });
  const dayDate = date.getDate();

  return (
    <div className="weather-details">
      <p className="weather-date">
        {month} {dayDate}
      </p>
      <p className="weather-location">
        <i class="fa-solid fa-map-pin" style={{ marginRight: "5px" }}></i>
        {weatherData.name}, {weatherData.sys.country}
      </p>
      <div className="icon-temp-container">
        <img
          src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
        />
        <p className="weather-temp">{temp}°C</p>
      </div>
      <p className="weather-description">
        Feels like {feelsLike}°C. {capitalizedDescription}
      </p>
      <div className="weather-wind-press">
        <p>Wind: {wind}km/h</p>
        <p>Pressure: {weatherData.main.pressure}hPa</p>
      </div>
      <div className="weather-hum-vis">
        <p>Humidity: {weatherData.main.humidity}%</p>
        <p>Visibility: {visibility}km</p>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
