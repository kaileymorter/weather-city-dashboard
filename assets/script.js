var getCurrentWeather = function(city){

    var city = document.querySelector("#search-city").value;
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6b9401ca72048cb12acce22eafd311aa";

    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                console.log(response);
                console.log(data);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert("Unable to connect to GitHub");
    });   
};

var displ
