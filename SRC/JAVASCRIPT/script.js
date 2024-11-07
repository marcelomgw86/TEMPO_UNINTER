document.querySelector('#search').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value;

    if (!cityName) {
        document.querySelector("#weather").classList.remove('show');
        showAlert('Você precisa digitar uma cidade');
        return;
    }

    // Armazena a cidade no localStorage para usar na página de 5 dias
    localStorage.setItem('city_name', cityName);

    const api = '3afeb284954c8955c926203ff7f0cc99';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${api}&units=metric&lang=pt_br`;
    const apiUrl2 = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(cityName)}&appid=${api}&units=metric&lang=pt_br`;

    const results = await fetch(apiUrl);
    const json = await results.json();

    if (json.cod === 200) {
        showInfo({
            city: json.name,
            country: json.sys.country,
            temp: json.main.temp,
            tempMax: json.main.temp_max,
            tempMin: json.main.temp_min,
            description: json.weather[0].description,
            tempIcon: json.weather[0].icon,
            windSpeed: json.wind.speed,
            humidity: json.main.humidity,
        });

        // Fetch forecast for the next 5 days
        const forecastResults = await fetch(apiUrl2);
        const forecastJson = await forecastResults.json();

        if (forecastJson.cod === '200') {
            showForecast(forecastJson);
        }
    } else {
        document.querySelector("#weather").classList.remove('show');
        showAlert(`Cidade não encontrada. Tente novamente.`);
    }
});

function showInfo({city, country, temp, tempMax, tempMin, description, tempIcon, windSpeed, humidity}) {
    document.querySelector('#title').textContent = `${city}, ${country}`;
    document.querySelector('#temp_value').textContent = temp.toFixed(1);
    document.querySelector('#temp_description').textContent = description;
    document.querySelector('#temp_img').src = `https://openweathermap.org/img/wn/${tempIcon}.png`;

    const otherInfos = document.querySelector('#other_infos');
    otherInfos.innerHTML = `
       
        <div class="info">
            <i class="fa-solid fa-wind" id="wind_icon"></i>
            <div>
                <h2>Vento</h2>
                <p>${windSpeed.toFixed(1)} km/h</p>
            </div>
        </div>
        <div class="info">
            <i class="fa-solid fa-droplet" id="humidity_icon"></i>
            <div>
                <h2>Umidade</h2>
                <p>${humidity}%</p>
            </div>
        </div>
    `;

    document.querySelector("#weather").classList.add('show');
}

function showForecast(forecastJson) {
    const forecastContainer = document.querySelector('#forecast');
    forecastContainer.innerHTML = ''; // Limpa qualquer conteúdo anterior

    // Cria a previsão para o dia atual (somente os horários de 06:00, 12:00, e 18:00)
    const forecastItems = forecastJson.list.filter(item => {
        const hour = new Date(item.dt * 1000).getHours();
        return hour === 6 || hour === 12 || hour === 18;
    });

    forecastItems.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayOfWeek = date.toLocaleString('pt-br', { weekday: 'long' });
        const time = date.getHours() === 6 ? '06:00' : date.getHours() === 12 ? '12:00' : '18:00';

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <p><strong>${dayOfWeek}</strong></p>
            <p>${time}</p>
            <p>${item.main.temp.toFixed(1)}°C</p>
            <p><img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Weather icon"></p>
        `;

        forecastContainer.appendChild(forecastItem);
    });
}

function showAlert(message) {
    const alertContainer = document.querySelector("#alert");
    alertContainer.textContent = message;
}
