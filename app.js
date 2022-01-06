const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");
var airIndex;

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "49cc8c821cd2aff9af04c9f98c36eb74";

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";
  // Time
  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;
  // Date
  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);
getWeatherData();

function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;
    // API FOR AIR POLLUTION
    fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    ).then((res) =>
      res.json().then((data) => {
        console.log(data);
        checkAir(data.list[0].main.aqi);
      })
    );
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    ).then((res) =>
      res.json().then((data) => {
        console.log(data);        
        //Noob code is below
        setTimeout(() => {showWeatherData(data);}, 500);
      })
    );
  });
}

function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed, uvi, weather } =
    data.current;

  timezone.innerHTML = data.timezone;
  countryEl.innerHTML = data.lat + "N " + data.lon + "E";

  currentWeatherItemsEl.innerHTML = `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}m/s</div>
    </div>
    <div class="weather-item">
    <div>UV Index</div>
    <div>${checkUV(uvi)}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
    </div>
    <div class="weather-item">
      <div>Air Quality</div>
      <div>${airIndex}</div>
    </div>
    `;
  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${
              day.weather[0].icon
            }@2x.png" class="w-icon" alt="Weather icon">
            <div class="other">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("dddd")}</div>
                <div class="temp">Day: ${Math.round(day.temp.day)}&#176; C</div>
                <div class="temp">Night: ${Math.round(
                  day.temp.night
                )}&#176; C</div>
            </div>
            `;
    } else {
      otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("dddd")}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" class="w-icon" alt="Weather icon">
                <div class="temp">Day: ${Math.round(day.temp.day)}&#176; C</div>
                <div class="temp">Night: ${Math.round(
                  day.temp.night
                )}&#176; C</div>
            </div>
            `;
    }
  });
  weatherForecastEl.innerHTML = otherDayForcast;
  //   Change BG IMG
  changeImg(weather[0].id);
}

// Checking UV INDEX
function checkUV(data) {
  let x;
  if (data <= 2) {
    x = "Low";
  } else if (data >= 3 && data <= 5) {
    x = "Medium";
  } else if (data >= 6 && data <= 7) {
    x = "High";
  } else if (data >= 8) {
    x = "Very high";
  }
  return x;
}

// Checking UV INDEX
function checkAir(data) {
  switch (data) {
    case 1:
      airIndex = "Good";
      break;
    case 2:
      airIndex = "Fair";
      break;
    case 3:
      airIndex = "Moderate";
      break;
    case 4:
      airIndex = "Poor";
      break;
    case 5:
      airIndex = "Very Poor";
      break;
    default:
      airIndex = "Unknow";
  }
}

// Change Background image
function changeImg(id) {
  if (id >= 200 && id <= 232)
    document.body.style.backgroundImage = "url('Images/Thunderstorm.jpg')";
  else if (id >= 300 && id <= 321)
    document.body.style.backgroundImage = "url('Images/lightRain.jpg')";
  else if (id >= 500 && id <= 504)
    document.body.style.backgroundImage = "url('Images/rainClouds.jpg')";
  else if (id == 511)
    document.body.style.backgroundImage = "url('Images/Snow2.jpg')";
  else if (id >= 520 && id <= 531)
    document.body.style.backgroundImage = "url('Images/rainClouds.jpg')";
  else if (id >= 600 && id <= 622)
    document.body.style.backgroundImage = "url('Images/Snow2.jpg')";
  else if (id >= 701 && id <= 781)
    document.body.style.backgroundImage = "url('Images/minst.jpg')";
  else if (id == 800)
    document.body.style.backgroundImage = "url('Images/clearSky.jpg')";
  else if (id == 801 || id == 802)
    document.body.style.backgroundImage = "url('Images/fewClouds.jpg')";
  else if (id == 803 || id == 804)
    document.body.style.backgroundImage = "url('Images/manyClouds.jpg')";
  else document.body.style.backgroundImage = "url('Images/RandomIMG.jpg')";
}
