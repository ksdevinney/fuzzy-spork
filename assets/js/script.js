$(document).ready(function(){
    var searchHistoryContainer = $("#past-searches");
    var searchForm = $("#search-form");
    var currentWeatherContainer = $("#current-weather");
    var apiKey = "6291995da3ff0287da0ec9ee69a1e3a7";
    var baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
    var fiveDayForeCastContainer = $("#five-day-forecast");
    var baseUrl2 = "https://api.openweathermap.org/data/2.5/forecast?";
    var iconBaseUrl = "http://openweathermap.org/img/w/"
    searchForm.submit(function(event) {
        event.preventDefault();
        // this = the form that just submitted!
        var formValues = $(this).serializeArray();
        var city = formValues[0].value;
        // create an element with jquery selector
        var searchTermDiv = $('<div class="past-search-term">');
        searchTermDiv.text(city);
        searchHistoryContainer.append(searchTermDiv);
        console.log(formValues, city);
        searchForCurrentCityWeather(city);
        searchForFiveDayForecastWeather(city);
      });
    function searchForCurrentCityWeather(city) {
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
                tempDiv.text(temp);
                humidityDiv.text(humidity + "%");
                windDiv.text(wind.speed + " MPH");
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
        // create URL for search
        var forecastUrl = baseUrl2 + "q=" + city + "&appid=" + apiKey;
        fetch(forecastUrl).then(function(responseFromOpenWeatherMapUnprocessed) {
           return responseFromOpenWeatherMapUnprocessed.json(); 
        }).then(function(data) {
            // loop through 5 day forecast data
            console.log("Five Day Forecast" , data);
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
                    tempDiv.text(temp);
                    humidityDiv.text(humidity + "%");
                    windDiv.text(wind.speed + " MPH");
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
});