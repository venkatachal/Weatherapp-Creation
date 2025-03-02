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
      `https://api.openweathermap.org/data/2.5/weather?q=Berlin&appid=${apiKey}&units=${tempUnit}`);

      const data = await response.json();
      setWeatherData(data);
    };
    fetchData();
  }, []);

  return /*#__PURE__*/(
    React.createElement("div", { className: "container" }, /*#__PURE__*/
    React.createElement(Search, { weatherData: setWeatherData }), /*#__PURE__*/
    React.createElement(CurrentWeather, { weatherData: weatherData })));


};

const Search = props => {
  const [city, setCity] = useState("");
  const { weatherData: setWeatherData } = props;

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${tempUnit}`);

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

  const handleChange = event => {
    setCity(event.target.value);
  };

  return /*#__PURE__*/(
    React.createElement("div", { className: "search-container" }, /*#__PURE__*/
    React.createElement("form", { onSubmit: handleSubmit, className: "submit" }, /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      placeholder: "Enter city name",
      onChange: handleChange,
      value: city,
      required: true }), /*#__PURE__*/

    React.createElement("button", { type: "submit" }, "Search"))));



};

const CurrentWeather = props => {
  const { weatherData } = props;

  if (!weatherData) {
    return /*#__PURE__*/React.createElement("div", null, "Loading...");
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
    minute: "2-digit" });

  const month = date.toLocaleString("default", { month: "short" });
  const dayDate = date.getDate();

  return /*#__PURE__*/(
    React.createElement("div", { className: "weather-details" }, /*#__PURE__*/
    React.createElement("p", { className: "weather-date" },
    month, " ", dayDate), /*#__PURE__*/

    React.createElement("p", { className: "weather-location" }, /*#__PURE__*/
    React.createElement("i", { class: "fa-solid fa-map-pin", style: { marginRight: "5px" } }),
    weatherData.name, ", ", weatherData.sys.country), /*#__PURE__*/

    React.createElement("div", { className: "icon-temp-container" }, /*#__PURE__*/
    React.createElement("img", {
      src: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png` }), /*#__PURE__*/

    React.createElement("p", { className: "weather-temp" }, temp, "\xB0C")), /*#__PURE__*/

    React.createElement("p", { className: "weather-description" }, "Feels like ",
    feelsLike, "\xB0C. ", capitalizedDescription), /*#__PURE__*/

    React.createElement("div", { className: "weather-wind-press" }, /*#__PURE__*/
    React.createElement("p", null, "Wind: ", wind, "km/h"), /*#__PURE__*/
    React.createElement("p", null, "Pressure: ", weatherData.main.pressure, "hPa")), /*#__PURE__*/

    React.createElement("div", { className: "weather-hum-vis" }, /*#__PURE__*/
    React.createElement("p", null, "Humidity: ", weatherData.main.humidity, "%"), /*#__PURE__*/
    React.createElement("p", null, "Visibility: ", visibility, "km"))));



};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));