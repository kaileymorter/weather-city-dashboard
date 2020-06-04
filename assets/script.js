var date = (moment().format("l"));
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#search-city");
//current weather elements
var cityNameEl = document.querySelector("#city-name");
var tempEl = document.querySelector("#temperature");
var humidityEl = document.querySelector("#humidity");
var windSpeedEl = document.querySelector("#wind-speed");
var uvIndexEl = document.querySelector("#uv-index");
//five-day forecast element
var forecastEl = document.querySelector("#forecast")


var formSubmitHandler = function(event){
    event.preventDefault()
    
    var city = cityInputEl.value.trim();

    if (city) {
        getCurrentWeather(city);
        getFiveDayForecast(city);
    } else {
        alert("Please enter a valid city name!");
    }
};

//get the current weather
var getCurrentWeather = function(city){

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6b9401ca72048cb12acce22eafd311aa";

    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                displayCurrentWeather(data, city)
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert("Unable to connect to GitHub");
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

    //convert temp from kelvin to fahrenheit
    var temp = Math.floor((data.main.temp -273.15) * 9/5 + 32);

    //find and create the weather icon
    var weatherIcon = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
    var icon = document.createElement('img');
    icon.setAttribute('src', weatherIcon);

    //add weather data to page
    cityNameEl.textContent = searchTerm + " (" + date + ")";
    cityNameEl.appendChild(icon)
    tempEl.textContent = temp + " °F"
    humidityEl.textContent = data.main.humidity + "%";
    windSpeedEl.textContent = data.wind.speed + " MPH";

    //get current uv index
    var uvIndexUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=6b9401ca72048cb12acce22eafd311aa&lat=" + data.coord.lat + "&lon=" + data.coord.lon;
    fetch(uvIndexUrl).then(function(response){
        if (response.ok){
            response.json().then(function(data){
                var uvIndex = data.value

                if (uvIndex <= 3){
                    uvIndexEl.classList = "index-green text-light p-1";
                } else if (uvIndex >= 3 || uvIndex <= 6){
                    uvIndexEl.classList = "index-yellow text-light p-1";
                } else if (uvIndex >= 6 || uvIndex <= 8){
                    uvIndexEl.classList = "index-orange text-light p-1";
                } else {
                    uvIndexEl.classList = "index-red text-light p-1";
                };

                uvIndexEl.textContent = uvIndex
            });
        }
    });

}

//display the five day forecast
var displayFiveDayForecast = function(data, searchTerm){

    forecastEl.textContent = "";

    for(var i = 0; i < data.list.length; i++){

        if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            //create five day forecast element
            var fiveDayEl = document.createElement("div")
            fiveDayEl.classList = "col-sm bg-primary text-light card mr-2 p-3";
            
            //add date to the forecast element
            var date = document.createElement("h4")
            date.textContent = moment(data.list[i].dt, "X").format("MMM Do");
            fiveDayEl.appendChild(date);

            //add icon to the forecast element
            var weatherIcon = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png"
            var icon = document.createElement('img');
            icon.setAttribute("src", weatherIcon);
            icon.setAttribute("style", "width:125px")
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

userFormEl.addEventListener("submit", formSubmitHandler);