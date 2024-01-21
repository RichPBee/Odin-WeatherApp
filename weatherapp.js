const form = document.querySelector(".WeatherForm");
form.addEventListener('submit', async(e) => { 
    e.preventDefault();
    const location = document.querySelector('.LocationInput').value;
    const weatherInfo = await getWeatherData(location);
    console.log(weatherInfo);
});

const getWeatherData = async (location) => { 
    const response = await fetch('http://api.weatherapi.com/v1/forecast.json?key=948a9f1fc7814faf86c233412242001&q='+location+'&days=3');
    const data = await response.json();
    const usefulData = parseData(data);
    return usefulData;
};

const getLocation = (location) => { 
    return `${location.name}: ${location.country}`;
};

const getDaysData = (dataObj, forecast) => {
    forecast.forEach((day, i) => { 
        dataObj[i] = {
            date: day.date,
            decription: day.day.condition.text,
            avgTemp: day.day.avgtemp_c,
            maxTemp: day.day.maxtemp_c,
            minTemp: day.day.mintemp_c,
            rainChance: day.day.daily_chance_of_rain,
            windSpeed: day.day.maxwind_mph
        }
    });
}

const parseData = (data) => {
    const usefulData = {}
    const fullLocation = getLocation(data.location);
    usefulData['Location'] = fullLocation;
    getDaysData(usefulData, data.forecast.forecastday);
    return usefulData;
}

