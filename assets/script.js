var date = (moment().format("l"));
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#search-city");
//current weather elements
var currentWeatherEl = document.querySelector("#current-weather");
var cityNameEl = document.querySelector("#city-name");
var tempEl = document.querySelector("#temperature");
var humidityEl = document.querySelector("#humidity");
var windSpeedEl = document.querySelector("#wind-speed");
var uvIndexEl = document.querySelector("#uv-index");
//five-day forecast element
var forecastHeader = document.querySelector("#forecast-header")
var forecastEl = document.querySelector("#forecast")
//storage array
var cityHistory = [];

var formSubmitHandler = function(event){
    event.preventDefault()

    var city = cityInputEl.value.trim();
    cityInputEl.value = "";

    if (city) {
        getCurrentWeather(city);
        getFiveDayForecast(city);
    } else {
        alert("Please enter a valid city name!");
    }

    cityHistory.push(city);
    console.log(cityHistory);
    localStorage.setItem("city", JSON.stringify(cityHistory));

};

//get the current weather
var getCurrentWeather = function(city){

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6b9401ca72048cb12acce22eafd311aa";

    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                displayCurrentWeather(data, city);
                searchHistory(city);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert("Unable to connect to openweathermap.org");
    });   
};

//get the five day forecast
var getFiveDayForecast = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=6b9401ca72048cb12acce22eafd311aa";
    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                displayFiveDayForecast(data)
            });
        }
    });
};

//display the current weather
var displayCurrentWeather = function(data, searchTerm){

    //add border to the current weather element
    currentWeatherEl.classList = "border p-4";

    //convert temp from kelvin to fahrenheit
    var temp = Math.floor((data.main.temp -273.15) * 9/5 + 32);

    //find and create the weather icon
    var weatherIcon = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
    var icon = document.createElement('img');
    icon.setAttribute('src', weatherIcon);

    //add weather data to page
    cityNameEl.textContent = "City: " + searchTerm + " (" + date + ")";
    cityNameEl.appendChild(icon)
    tempEl.textContent = "Temperature: " + temp + " °F"
    humidityEl.textContent = "Humidity: " + data.main.humidity + "%";
    windSpeedEl.textContent = " Wind Speed: " + data.wind.speed + " MPH";
    //get current uv index
    var uvIndexUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=6b9401ca72048cb12acce22eafd311aa&lat=" + data.coord.lat + "&lon=" + data.coord.lon;
    fetch(uvIndexUrl).then(function(response){
        if (response.ok){
            response.json().then(function(data){
                //create variable to hold the value of the uv index
                var uvIndex = data.value;
                //insert title text on the uv index element
                uvIndexEl.textContent = "UV Index: ";
                //create a span element for the uv index value
                var uvIndexData = document.createElement("span")
                //insert the uv index data in the span element created
                uvIndexData.textContent = uvIndex;
                //append the span element to the uv index title element
                uvIndexEl.appendChild(uvIndexData);

                //condition for the uv index background color
                if (uvIndex < 3){
                    uvIndexData.classList = "index-green text-light p-1";
                } else if (uvIndex < 6){
                    uvIndexData.classList = "index-yellow text-light p-1";
                } else if (uvIndex < 8){
                    uvIndexData.classList = "index-orange text-light p-1";
                } else if (uvIndex < 11) {
                    uvIndexData.classList = "index-red text-light p-1";
                } else {
                    uvIndexData.classList = "index-black text-light p-1";
                }
            });
        }
    });

};

//display the five day forecast
var displayFiveDayForecast = function(data){

    //forecast header text
    forecastHeader.textContent = "5 Day Forecast:"
    //clear old weather data
    forecastEl.textContent = "";

    for(var i = 0; i < data.list.length; i++){

        if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            //create five day forecast element
            var fiveDayEl = document.createElement("div")
            fiveDayEl.classList = "col-sm bg-primary text-light card mr-2 mb-3 p-3";
            
            //add date to the forecast element
            var date = document.createElement("h4")
            date.textContent = moment(data.list[i].dt, "X").format("MMM Do");
            fiveDayEl.appendChild(date);

            //add icon to the forecast element
            var weatherIcon = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png"
            var icon = document.createElement('img');
            icon.setAttribute("src", weatherIcon);
            icon.className = "icon";
            fiveDayEl.appendChild(icon);

            //add temp to the forecast element
            var temp = document.createElement("p");
            temp.textContent = "Temp: " + Math.floor((data.list[i].main.temp - 273.15) * 9/5 +32) + " °F";
            fiveDayEl.appendChild(temp);

            //add humidity to the forecast element
            var humidity = document.createElement("p");
            humidity.textContent = "Humidity: " + data.list[i].main.humidity;
            fiveDayEl.appendChild(humidity);

            forecastEl.appendChild(fiveDayEl);
        }
    }

}

//display search history
var searchHistory = function(searchTerm){

    var searchHeaderEl = document.querySelector("#search-header");
    searchHeaderEl.textContent = "Search History:";

    var searchHistoryEl = document.querySelector("#search-list");
    
    //add city to search history
    var cityEl = document.createElement("a")
    cityEl.textContent = searchTerm;
    cityEl.setAttribute("href", "#" );
    cityEl.classList = "list-group-item list-group-item-action";
    searchHistoryEl.appendChild(cityEl);
    
}

var getListWeather = function(city){

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6b9401ca72048cb12acce22eafd311aa";

    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                displayCurrentWeather(data, city);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert("Unable to connect to openweathermap.org");
    });   
};

var searchHistoryHandler = function(event){
    console.log(event.target.innerText);

    var listTerm = event.target.innerText;
    getListWeather(listTerm);
    getFiveDayForecast(listTerm);

}

document.getElementById("search-list").addEventListener("click", searchHistoryHandler);
userFormEl.addEventListener("submit", formSubmitHandler);