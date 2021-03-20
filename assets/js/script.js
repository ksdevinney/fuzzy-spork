$(document).ready(function(){
    var searchHistoryContainer = $("#past-searches");
    var searchForm = $("#search-form");
    var currentWeatherContainer = $("#current-weather");
    var apiKey = "6291995da3ff0287da0ec9ee69a1e3a7";
    var baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
    var fiveDayForeCastContainer = $("#five-day-forecast");
    var baseUrl2 = "https://api.openweathermap.org/data/2.5/forecast?";
    var iconBaseUrl = "http://openweathermap.org/img/w/"
    var searchHistory = [];
    var searchValueInput = $("#search-value");
    var uvIndexBaseUrl = "https://api.openweathermap.org/data/2.5/onecall?"
    
    // search for a location
    searchForm.submit(function(event) {
        event.preventDefault();
        // this = the form that just submitted!
        var formValues = $(this).serializeArray();
        var city = formValues[0].value;
        // previously searched cities go in a button
        var searchTermDiv = $('<button type="button" class="btn past-search-term">');
        searchTermDiv.click(function(event) {
            event.preventDefault();
            var value = $(this).text;
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
        currentWeatherContainer.html("");
        var fullUrl = baseUrl + "q=" + city + "&appid=" + apiKey;
        console.log(fullUrl);
        fetch(fullUrl).then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // vars for current weather
                var cityName = data.name;
                var temp = data.main.temp;
                var humidity = data.main.humidity;
                var weather = data.weather;
                var iconUrl = iconBaseUrl + weather[0].icon + ".png";
                var wind = data.wind;
                console.log(data);
                // create text for each part of the weather
                var cityNameDiv = $('<h3 class="city-name">');
                var tempDiv = $('<h3 class="temp-name">');
                var humidityDiv = $('<h3 class="humidity-name">');
                var weatherDiv = $('<img class="icon-name">');
                var windDiv = $('<h3 class="wind-name">');
                // stuff that goes in each div
                cityNameDiv.text(cityName);
                weatherDiv.attr("src" , iconUrl);
                tempDiv.text("Temperature: " + temp);
                humidityDiv.text("Humidity: " + humidity + "%");
                windDiv.text("Wind Speed: " + wind.speed + " MPH");
                // put it there!
                currentWeatherContainer.append(cityNameDiv);
                currentWeatherContainer.append(tempDiv);
                currentWeatherContainer.append(humidityDiv);
                currentWeatherContainer.append(weatherDiv);
                currentWeatherContainer.append(windDiv);
            });
    };
    // five day forecast
    function searchForFiveDayForecastWeather(city) {
        fiveDayForeCastContainer.html("");
        // create URL for search
        currentWeatherContainer.html("");
        var forecastUrl = baseUrl2 + "q=" + city + "&appid=" + apiKey;
        fetch(forecastUrl).then(function(responseFromOpenWeatherMapUnprocessed) {
           return responseFromOpenWeatherMapUnprocessed.json(); 
        }).then(function(data) {
            console.log("Five Day Forecast" , data);
            var coords = data.city.coord;
            console.log(coords);
            getUvIndex(coords.lat, coords.lon);
            // loop through 5 day forecast data
            for (var i=0; i < data.list.length; i++) {
                // only use weather at 3 pm
                var isThreeOClock = data.list[i].dt_txt.search("15:00:00");
                var cityName = data.city.name;
                if (isThreeOClock > -1) {
                    // vars for five day forecast
                    var forecast = data.list[i];
                    var temp = forecast.main.temp;
                    var humidity = forecast.main.humidity;
                    var weather = forecast.weather;
                    // create a url for the weather icon
                    var iconUrl = iconBaseUrl + weather[0].icon + ".png";
                    var wind = forecast.wind;
                    var day = moment(forecast.dt_txt).format("dddd, MMMM Do");
                    console.log(forecast, temp, humidity, weather, wind, day);
                    // create divs for necessary data
                    var rowDiv = $('<div class="col-2">' );
                    var dayDiv = $('<div class="day-name">');
                    var tempDiv = $('<div class="temp-name">');
                    var humidityDiv = $('<div class="humidity-name">');
                    var weatherDiv = $('<img class="icon-name">');
                    var windDiv = $('<div class="wind-name">');
                    weatherDiv.attr("src" , iconUrl);
                    dayDiv.text(day);
                    tempDiv.text("Temperature: " + temp);
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
        var finalUrl = uvIndexBaseUrl + "lat=" +  lat + "&lon=" + lon + "&exclude=hourly,daily&appid=" + apiKey;
        fetch(finalUrl).then(function() {
            return response.json();
        }).then(function(data) {
            console.log("UV DATA" , data);
            var uvIndex = data.current.uvi;
            var uvIndexDiv = $('<div class="uv-index-div">');
            var uvIndexSpan = $('<span class="uv-index-number">');
            uvIndexSpan.text(uvIndex);
            uvIndexDiv.text("UV Index: " + uvIndex);
            uvIndexDiv.append(uvIndexSpan);
            currentWeatherContainer.append(uvIndexDiv);
        });
    }
    function retrieveSearchHistory() {
        if (localStorage.getItem("searchHistory")) {
            searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
            for (var i = 0; i <searchHistory.length; i++) {
                var searchTermDiv = $('<button type="button" class="btn past-search-term">');
                searchTermDiv.click(function(event) {
                    event.preventDefault();
                    var value = $(this).text;
                    searchForCurrentCityWeather(value);
                    searchForFiveDayForecastWeather(value);
                });
                searchForm.text(searchHistory[i]);
                searchHistoryContainer.append(searchTermDiv);
            }
        }
    }
    $(".past-search-term").click(function(event) {
        event.preventDefault();
        console.log(event.target);
    });
    retrieveSearchHistory();
});