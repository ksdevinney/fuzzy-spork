$(document).ready(function(){
    let searchHistoryContainer = $("#past-searches");
    let searchForm = $("#search-form");
    let currentWeatherContainer = $("#current-weather");
    // let apiKey = " "; removed for privacy
    let baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
    let fiveDayForeCastContainer = $("#five-day-forecast");
    let baseUrl2 = "https://api.openweathermap.org/data/2.5/forecast?";
    let iconBaseUrl = "http://openweathermap.org/img/w/"
    let searchHistory = [];
    let searchValueInput = $("#search-value");
    let uvIndexBaseUrl = "https://api.openweathermap.org/data/2.5/onecall?"
    
    // search for a location
    searchForm.submit(function(event) {
        event.preventDefault();
        // this = the form that just submitted!
        let formValues = $(this).serializeArray();
        let city = formValues[0].value;
        // previously searched cities go in a button
        let searchTermDiv = $('<button type="button" class="btn past-search-term">');
        searchTermDiv.click(function(event) {
            event.preventDefault();
            let value = $(this).text();
            searchForCurrentCityWeather(value);
            searchForFiveDayForecastWeather(value);
            console.log(value);
        });
        searchHistory.push(city);
        localStorage.setItem("searchHistory" , JSON.stringify(searchHistory));
        searchTermDiv.text(city);
        searchHistoryContainer.append(searchTermDiv);
        console.log(formValues, city);
        searchForCurrentCityWeather(city);
        searchForFiveDayForecastWeather(city);
        searchValueInput.val("");
      });
    function searchForCurrentCityWeather(city) {
        // dateContainer.text(moment().format("dddd, MMMM Do, YYYY"));
        currentWeatherContainer.html("");
        let fullUrl = baseUrl + "q=" + city + "&units=imperial" + "&appid=" + apiKey;
        console.log(fullUrl);
        fetch(fullUrl).then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // vars for current weather
                let cityName = data.name;
                let temp = data.main.temp;
                let humidity = data.main.humidity;
                let weather = data.weather;
                let iconUrl = iconBaseUrl + weather[0].icon + ".png";
                let wind = data.wind;
                console.log(data);
                // create text for each part of the weather
                let cityNameDiv = $('<h3 class="city-name">');
                let weatherDiv = $('<img class="icon-name">');
                let tempDiv = $('<h5 class="temp-name">');
                let humidityDiv = $('<h5 class="humidity-name">');
                let windDiv = $('<h5 class="wind-name">');
                // data that goes in each div
                cityNameDiv.text(cityName);
                weatherDiv.attr("src" , iconUrl);
                tempDiv.text("Temperature: " + temp + " °F");
                humidityDiv.text("Humidity: " + humidity + "%");
                windDiv.text("Wind Speed: " + wind.speed + " MPH");
                // put it there!
                currentWeatherContainer.append(cityNameDiv);
                currentWeatherContainer.append(weatherDiv);
                currentWeatherContainer.append(tempDiv);
                currentWeatherContainer.append(humidityDiv);
                currentWeatherContainer.append(windDiv);
            });
    };
    // five day forecast
    function searchForFiveDayForecastWeather(city) {
        fiveDayForeCastContainer.html("");
        // create URL for search
        currentWeatherContainer.html("");
        let forecastUrl = baseUrl2 + "q=" + city + "&units=imperial" +  "&appid=" + apiKey;
        fetch(forecastUrl).then(function(responseFromOpenWeatherMapUnprocessed) {
           return responseFromOpenWeatherMapUnprocessed.json(); 
        }).then(function(data) {
            console.log("Five Day Forecast" , data);
            let coords = data.city.coord;
            console.log(coords);
            getUvIndex(coords.lat, coords.lon);
            // loop through 5 day forecast data
            for (let i=0; i < data.list.length; i++) {
                // only use weather at 3 pm
                let isThreeOClock = data.list[i].dt_txt.search("15:00:00");
                // let cityName = data.city.name;
                if (isThreeOClock > -1) {
                    // variables for five day forecast
                    let forecast = data.list[i];
                    let temp = forecast.main.temp;
                    let humidity = forecast.main.humidity;
                    let weather = forecast.weather;
                    // create a url for the weather icon
                    let iconUrl = iconBaseUrl + weather[0].icon + ".png";
                    let wind = forecast.wind;
                    let day = moment(forecast.dt_txt).format("dddd, MMMM Do");
                    console.log(forecast, temp, humidity, weather, wind, day);
                    // create divs for necessary data
                    let rowDiv = $('<div class="col-2 border border-dark">' );
                    let dayDiv = $('<div class="day-name day-name-five">');
                    let tempDiv = $('<div class="temp-name temp-name-five">');
                    let humidityDiv = $('<div class="humidity-name humidity-name-five">');
                    let weatherDiv = $('<img class="icon-name">');
                    let windDiv = $('<div class="wind-name wind-name-five">');
                    weatherDiv.attr("src" , iconUrl);
                    dayDiv.text(day);
                    tempDiv.text("Temperature: " + temp + " °F");
                    humidityDiv.text("Humidity: " + humidity + "%");
                    windDiv.text("Wind Speed: " + wind.speed + " MPH");
                    // put info in the divs
                    rowDiv.append(weatherDiv);
                    rowDiv.append(dayDiv);
                    rowDiv.append(tempDiv);
                    rowDiv.append(humidityDiv);
                    rowDiv.append(windDiv);
                    fiveDayForeCastContainer.append(rowDiv);
                }
            }
        });
    }
    function getUvIndex(lat, lon) {
        console.log(lat,lon);
        let finalUrl = uvIndexBaseUrl + "lat=" +  lat + "&lon=" + lon + "&exclude=hourly,daily&appid=" + apiKey;
        fetch(finalUrl).then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log("UV DATA" , data);
            let uvIndex = data.current.uvi;
            console.log(uvIndex, typeof uvIndex)
            let uvIndexDiv = $('<h5 class="uv-index-div">');
            let uvIndexSpan = $('<span class="uv-index-number">');
            if (uvIndex < 2) {
                uvIndexSpan.addClass("uv-index-number-low")
            } else if (uvIndex < 5) {
                uvIndexSpan.addClass("uv-index-number-med")
            } else {
                uvIndexSpan.addClass("uv-index-number-high")
            }
            uvIndexSpan.text(uvIndex);
            uvIndexDiv.text("UV Index: ");
            uvIndexDiv.append(uvIndexSpan);
            currentWeatherContainer.append(uvIndexDiv);
        });
    }
    function retrieveSearchHistory() {
        if (localStorage.getItem("searchHistory")) {
            searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
            for (let i = 0; i < searchHistory.length; i++) {
                let searchTermDiv = $('<button type="button" class="btn btn-outline-secondary past-search-term">');
                searchTermDiv.click(function(event) {
                    event.preventDefault();
                    let value = $(this).text();
                    console.log(value);
                    searchForCurrentCityWeather(value);
                    searchForFiveDayForecastWeather(value);
                });
                searchTermDiv.text(searchHistory[i]);
                searchHistoryContainer.append(searchTermDiv);
            }
        }
    }
    retrieveSearchHistory();
});