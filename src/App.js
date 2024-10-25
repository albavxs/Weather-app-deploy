import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

const mainCities = {
  Brasil: [
    "Rio de Janeiro",
    "Salvador",
    "Belo Horizonte",
    "Fortaleza",
    "Porto Alegre",
  ],
};

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("en");
  const [userCityWeather, setUserCityWeather] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  const fetchMainCitiesWeather = useCallback(async () => {
    const cities = mainCities.Brasil;
    const requests = cities.map((city) =>
      axios.get(
        `https://api.weatherapi.com/v1/current.json?key=aad5666590e644dd97655235242010&q=${city}&lang=${language}`
      )
    );

    try {
      const responses = await Promise.all(requests);
      setWeatherData(responses.map((response) => response.data));
      setError(null);
    } catch (err) {
      setError("Erro ao buscar as previsões.");
      setWeatherData([]);
    }
  }, [language]);

  const fetchUserCityWeather = useCallback(
    async (lat, lon) => {
      try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=aad5666590e644dd97655235242010&q=${lat},${lon}&lang=${language}`
        );
        setUserCityWeather(response.data);
      } catch (err) {
        setError("Erro ao buscar o clima da sua localização.");
      }
    },
    [language]
  );

  const fetchWeather = async (location) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=aad5666590e644dd97655235242010&q=${location}&lang=${language}`
      );
      setWeather(response.data);
      setError(null);
    } catch (err) {
      setError("Cidade não encontrada");
      setWeather(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchWeather(location);
      setLocation("");
    }
  };

  useEffect(() => {
    const userLanguage = navigator.language || navigator.userLanguage;
    setLanguage(userLanguage.includes("pt") ? "pt" : "en");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchUserCityWeather(latitude, longitude);
      });
    } else {
      setError("Geolocalização não é suportada neste navegador.");
    }

    fetchMainCitiesWeather();
  }, [fetchMainCitiesWeather, fetchUserCityWeather]);

  const toggleExpand = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="title-wrapper">
          <h1 className="title">Weather App</h1>
          {userCityWeather && (
            <div className="user-weather">
              <img
                src={userCityWeather.current.condition.icon}
                alt={userCityWeather.current.condition.text}
              />
            </div>
          )}
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder={language === "pt" ? "Digite a cidade" : "Enter city"}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
            value={location}
          />
        </div>
        {error && <p>{error}</p>}
        {weather && (
          <div
            className={`weather-info ${expandedCard === -1 ? "expanded" : ""}`}
            onClick={() => toggleExpand(-1)}
          >
            <h2>{weather.location.name}</h2>
            <p>{weather.current.temp_c} °C</p>
            <p>{weather.current.condition.text}</p>
            <img
              src={weather.current.condition.icon}
              alt={weather.current.condition.text}
            />
            {expandedCard === -1 && (
              <div className="additional-info">
                <p>
                  {language === "pt" ? "Umidade" : "Humidity"}:{" "}
                  {weather.current.humidity}%
                </p>
                <p>
                  {language === "pt" ? "Vento" : "Wind"}:{" "}
                  {weather.current.wind_kph} km/h
                </p>
              </div>
            )}
          </div>
        )}
        {weatherData.length > 0 && (
          <div className="carousel">
            <h5 className="titulocity">
              {language === "pt"
                ? "Principais Cidades do Seu País:"
                : "Main Cities in Your Country:"}
            </h5>
            {weatherData.map((weather, index) => (
              <div
                key={index}
                className={`weather-card ${
                  expandedCard === index ? "expanded" : ""
                }`}
                onClick={() => toggleExpand(index)}
              >
                <h3>{weather.location.name}</h3>
                <p>
                  {language === "pt" ? "Temperatura" : "Temperature"}:{" "}
                  {weather.current.temp_c} °C
                </p>
                <p>
                  {language === "pt" ? "Condições" : "Conditions"}:{" "}
                  {weather.current.condition.text}
                </p>
                <img
                  src={weather.current.condition.icon}
                  alt={weather.current.condition.text}
                />
                {expandedCard === index && (
                  <div className="weather-details">
                    <p>
                      {language === "pt" ? "Umidade" : "Humidity"}:{" "}
                      {weather.current.humidity}%
                    </p>
                    <p>
                      {language === "pt" ? "Vento" : "Wind"}:{" "}
                      {weather.current.wind_kph} km/h
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {expandedCard !== null && (
          <div
            className="overlay active"
            onClick={() => setExpandedCard(null)}
          />
        )}
      </header>
    </div>
  );
}

export default App;
