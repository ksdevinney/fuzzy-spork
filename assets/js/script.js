//6291995da3ff0287da0ec9ee69a1e3a7
console.log("Hello");

$(document).ready(function(){
    var searchHistoryContainer = $("#past-searches");
    var searchForm = $("#search-form");
    var currentWeatherContainer = $("#current-weather");
    var apiKey = "6291995da3ff0287da0ec9ee69a1e3a7";
    var baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
    searchForm.submit(function( event ) {
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
      });
    function searchForCurrentCityWeather(city) {
        var fullUrl = baseUrl + "q=" + city + "&appid=" + apiKey;
        console.log(fullUrl);
        fetch(fullUrl)

            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var cityName = data.name;
                var temp = data.main.temp;
                var humidity = data.main.humidity;
                var weather = data.weather;
                var wind = data.wind;
                console.log(data);
                var cityNameDiv = $('<h3 class="city-name">');
                var tempDiv = $('<h3 class="temp-name">');
                var humidityDiv = $('<h3 class="humidity-name">');
                var weatherDiv = $('<h3 class="icon-name">');
                var windDiv = $('<h3 class="wind-name">');
                cityNameDiv.text(cityName);
                tempDiv.text(temp);
                humidityDiv.text(humidity);
                windDiv.text(wind.speed + " MPH");

                currentWeatherContainer.append(cityNameDiv);
                currentWeatherContainer.append(tempDiv);
                currentWeatherContainer.append(humidityDiv);
                currentWeatherContainer.append(weatherDiv);
                currentWeatherContainer.append(windDiv);
            });
    }
    function searchForFiveDayForecastWeather(city) {
        
    }
});