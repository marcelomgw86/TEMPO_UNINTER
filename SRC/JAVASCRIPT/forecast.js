document.addEventListener('DOMContentLoaded', () => {
    const cityName = localStorage.getItem('city_name');
    if (!cityName) {
        alert("Você precisa buscar uma cidade na página principal.");
        window.location.href = 'index.html'; // Redireciona para a página principal se não encontrar a cidade
        return;
    }

    const api = '3afeb284954c8955c926203ff7f0cc99';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(cityName)}&appid=${api}&units=metric&lang=pt_br`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            showForecast(data);
        })
        .catch(error => {
            console.error("Erro ao carregar os dados da previsão:", error);
        });
});

function showForecast(forecastJson) {
    const forecastContainer = document.querySelector('#forecast');
    forecastContainer.innerHTML = '';

    // Agrupa as previsões por dia
    const days = {};

    forecastJson.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayOfWeek = date.toLocaleString('pt-br', { weekday: 'long' });
        const time = date.getHours() === 6 ? '06:00' : date.getHours() === 12 ? '12:00' : date.getHours() === 18 ? '18:00' : null;
        
        if (time) {
            if (!days[dayOfWeek]) {
                days[dayOfWeek] = [];
            }
            days[dayOfWeek].push({ time, temp: item.main.temp.toFixed(1), icon: item.weather[0].icon });
        }
    });

    // Exibe os dados de cada dia
    Object.keys(days).forEach(day => {
        const dayForecast = days[day];
        const dayForecastItem = document.createElement('div');
        dayForecastItem.classList.add('day-forecast');

        let forecastContent = `<h3>${day}</h3><div class="day-forecast-items">`;

        dayForecast.forEach(forecast => {
            forecastContent += `
                <div class="forecast-item">
                    <p>${forecast.time}</p>
                    <p>${forecast.temp}°C</p>
                    <p><img src="https://openweathermap.org/img/wn/${forecast.icon}.png" alt="Weather icon"></p>
                </div>
            `;
        });

        forecastContent += '</div>';
        dayForecastItem.innerHTML = forecastContent;

        forecastContainer.appendChild(dayForecastItem);
    });
}
