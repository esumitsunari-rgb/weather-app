// ============================
// 天気予報アプリ (改良版)
// ============================

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherCard = document.getElementById("weather-result");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

// 背景変更用
const body = document.body;

// 天気コード → 日本語説明と背景色
function getWeatherInfo(code) {
  const weatherMap = {
    0: { text: "快晴 ☀️", bg: "linear-gradient(135deg, #4facfe, #00f2fe)" },
    1: { text: "晴れ 🌤️", bg: "linear-gradient(135deg, #74ABE2, #5563DE)" },
    2: { text: "一部曇り 🌥️", bg: "linear-gradient(135deg, #8EC5FC, #E0C3FC)" },
    3: { text: "曇り ☁️", bg: "linear-gradient(135deg, #bdc3c7, #2c3e50)" },
    45: { text: "霧 🌫️", bg: "linear-gradient(135deg, #757F9A, #D7DDE8)" },
    51: { text: "弱い霧雨 🌦️", bg: "linear-gradient(135deg, #a1c4fd, #c2e9fb)" },
    61: { text: "弱い雨 🌧️", bg: "linear-gradient(135deg, #667db6, #0082c8, #0082c8, #667db6)" },
    63: { text: "中程度の雨 🌧️", bg: "linear-gradient(135deg, #283E51, #485563)" },
    65: { text: "強い雨 ⛈️", bg: "linear-gradient(135deg, #1e3c72, #2a5298)" },
    71: { text: "弱い雪 🌨️", bg: "linear-gradient(135deg, #E0EAFC, #CFDEF3)" },
    80: { text: "にわか雨 🌦️", bg: "linear-gradient(135deg, #74ABE2, #5563DE)" },
  };
  return weatherMap[code] || { text: "不明", bg: "linear-gradient(135deg, #757F9A, #D7DDE8)" };
}

async function getCoordinates(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&language=ja&count=1`;
  const res = await fetch(geoUrl);
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error("都市が見つかりません。");
  const { latitude, longitude, name } = data.results[0];
  return { latitude, longitude, name };
}

async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;
  const res = await fetch(url);
  const data = await res.json();
  return data.current;
}

async function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    alert("都市名を入力してください。");
    return;
  }

  try {
    searchBtn.disabled = true;
    searchBtn.textContent = "検索中...";

    const { latitude, longitude, name } = await getCoordinates(city);
    const weather = await getWeather(latitude, longitude);

    const info = getWeatherInfo(weather.weather_code);

    cityName.textContent = name;
    temperature.textContent = `気温: ${weather.temperature_2m} °C`;
    description.textContent = `天気: ${info.text}`;

    body.style.background = info.bg;

    weatherCard.classList.remove("hidden");
  } catch (err) {
    cityName.textContent = "エラー";
    temperature.textContent = "";
    description.textContent = "⚠️ " + err.message;
    weatherCard.classList.remove("hidden");
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = "検索";
  }
}

// 🔘 検索ボタン
searchBtn.addEventListener("click", fetchWeather);

// ⌨️ Enterキー対応
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") fetchWeather();
});
