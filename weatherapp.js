const form = document.querySelector(".WeatherForm");
const displaySection = document.querySelector('.responses');
form.addEventListener('submit', async(e) => { 
    e.preventDefault();
    const location = document.querySelector('.LocationInput').value;
    const loadingText = document.createElement('h2');
    loadingText.innerHTML = 'Loading...'
    displaySection.innerHTML = ''
    displaySection.appendChild(loadingText);
    loadingText.style.display = 'block';
    const weatherInfo = await getWeatherData(location);
    loadingText.style.display = 'none';
    displayData(weatherInfo);
});

const getWeatherData = async (location) => { 
    const response = await fetch('http://api.weatherapi.com/v1/forecast.json?key=948a9f1fc7814faf86c233412242001&q='+location+'&days=3');
    const data = await response.json();
    const usefulData = parseData(data);
    return usefulData;
};

const getLocation = (location) => { 
    return `${location.name}, ${location.country}`;
};

const getDaysData = (dataObj, forecast) => {
    forecast.forEach((day, i) => { 
        dataObj[i] = {
            date: day.date,
            description: day.day.condition.text,
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
    usefulData['location'] = fullLocation;
    getDaysData(usefulData, data.forecast.forecastday);
    return usefulData;
}

const displayData = (info) => { 
    const location = document.createElement('h2');
    location.setAttribute('class', 'DisplayHeader');
    location.innerHTML = `Location: ${info.location}`
    displaySection.appendChild(location);
    const dayDisplay = document.createElement('div');
    dayDisplay.setAttribute('class', 'DayDisplay');
    displaySection.appendChild(dayDisplay);
    createDisplay(dayDisplay, info);
}

const createDisplay = (parent, info) => { 
    console.log('creating');
    for (let i = 0; i < Object.keys(info).length - 1; i++)
    {
        const dayDisplay = createDayPanel(info[i], i);
        parent.appendChild(dayDisplay);
    }
}

const createDayPanel = (info, index) => { 
    const panel = document.createElement('div');
    panel.setAttribute('class', 'DayPanel');
    panel.setAttribute('id', `DayPanel-${index}`);

    const date = document.createElement('h4');
    date.innerHTML = info.date;
    panel.appendChild(date);

    const description = document.createElement('p');
    description.innerHTML = info.description;
    panel.appendChild(description);

    const tempTitle = document.createElement('h4');
    tempTitle.innerHTML = 'Temperature: '
    panel.appendChild(tempTitle);

    const tempSection = document.createElement('div');
    tempSection.setAttribute('class', 'TemperatureSection')
    const maxTemp = document.createElement('p');
    maxTemp.innerHTML = `Max: ${info.maxTemp}`;
    tempSection.appendChild(maxTemp);
    const avgTemp = document.createElement('p');
    avgTemp.innerHTML = `Avg: ${info.avgTemp}`;
    tempSection.appendChild(avgTemp);

    const minTemp = document.createElement('p');
    minTemp.innerHTML = `Min: ${info.minTemp}`;
    tempSection.appendChild(minTemp);
    panel.appendChild(tempSection);

    const otherSection = document.createElement('div');
    otherSection.setAttribute('class', 'OtherSection')
    const wind = document.createElement('div');
    const windTitle = document.createElement('p');
    windTitle.innerHTML = 'Wind Speed: ';
    wind.appendChild(windTitle);
    const windVal = document.createElement('p');
    windVal.innerHTML = info.windSpeed;
    wind.appendChild(windVal);
    otherSection.appendChild(wind);

    const rain = document.createElement('div');
    const rainTitle = document.createElement('p');
    rainTitle.innerHTML = 'Rain Chance: ';
    rain.appendChild(rainTitle);
    const rainVal = document.createElement('p');
    rainVal.innerHTML = info.rainChance;
    rain.appendChild(rainVal);
    otherSection.appendChild(rain);

    panel.appendChild(otherSection);

    return panel;
}

