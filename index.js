const form = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const currentCity = document.querySelector('#current-city');
const currentDate = document.querySelector('#current-date');
const weatherCondition = document.querySelector('#weather-condition');
const humidity = document.querySelector('#humidity');
const windSpeed = document.querySelector('#wind-speed');
const weatherIcon = document.querySelector('#weather-icon');
const currentTemperature = document.querySelector('#current-temperature');

const apiKey = '200e0d6tebb283fa19534eeofca3556f';

function getWeatherData(city) {
  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}`;

  axios.get(apiUrl)
    .then(response => {
      const weatherData = response.data;

      // Today's weather
      const forecastToday = weatherData.daily[0];
      const city = weatherData.city;
      const temperatureToday = Math.round(forecastToday.temperature.day);
      const descriptionToday = forecastToday.condition.description;
      const iconToday = forecastToday.condition.icon;
      const humidityValue = forecastToday.temperature.humidity;
      const windSpeedValue = forecastToday.wind.speed;

      currentCity.textContent = city;
      currentDate.textContent = new Date().toLocaleDateString();
      weatherCondition.textContent = descriptionToday;
      humidity.innerHTML = `Humidity: <strong>${humidityValue}%</strong>`;
      windSpeed.innerHTML = `Wind: <strong>${windSpeedValue} km/h</strong>`;
      currentTemperature.textContent = temperatureToday;
      weatherIcon.src = `assets/${iconToday}.png`;
      weatherIcon.alt = descriptionToday;

      // Update the forecast for the next 3 days
      const days = [1, 2, 3]; // Next 3 days forecast
      const today = new Date();

      days.forEach((day, index) => {
        const forecast = weatherData.daily[day];
        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + day); // Set the date to the next day

        // Update the forecast elements with data
        const formattedDate = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });
        document.querySelector(`#day-${index + 1}-date`).textContent = formattedDate;

        document.querySelector(`#day-${index + 1}-icon`).src = `assets/${forecast.condition.icon}.png`;
        document.querySelector(`#day-${index + 1}-condition`).textContent = forecast.condition.description;
        document.querySelector(`#day-${index + 1}-temperature`).textContent = `${Math.round(forecast.temperature.day)}°C`;

        document.querySelector(`#day-${index + 1}-icon`).onerror = function () {
          this.src = 'assets/default.png';
        };
      });
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      alert('Unable to retrieve weather data. Please try again.');
    });
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const city = searchInput.value;

  if (city) {
    getWeatherData(city);
  }
});
