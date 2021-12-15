
//variables tied to html elements
var formEl = document.getElementById("selectState")
var select = document.getElementById("stateList")
var buttonHandlerEl = document.getElementById("parkList")
var parkInfoEl = document.getElementById("parkInfo")
mapboxgl.accessToken="pk.eyJ1IjoibWlsbGVydGltZTc4IiwiYSI6ImNreDI0dzdmODBwbG8ycnBha3dxaHB1aHEifQ.xNbviSI4FzhsW6yUBpXpDQ"

//Api call to get national park information
var npsFetch = function(state){
    var NPS=fetch("https://developer.nps.gov/api/v1/parks?stateCode=" +state+"&api_key=SwqWC3QHquTaPpof75xXkWepaUKDKmblOtJhEjha")
        .then(response => response.json())
        //sends data to displayParks to form buttons
        .then(data => displayParks(data)); 
}
 
var displayParks = function(data){
    // Removes any buttons already in button div
    buttonHandlerEl.textContent="";

    for(var i=0; i<data.data.length; i++){
        if(data.data[i].designation === "National Park" || data.data[i].designation ==="National Park & Preserve"){
            //iterates through data and creates buttons for parks with specific designation
            var park = document.createElement("button");
            park.type="button";
            park.className = "parks button";
            park.textContent = data.data[i].fullName;
            //sets value to that parks lat and long seperated by a comma
            park.value = data.data[i].latitude +","+ data.data[i].longitude+","+data.data[i].parkCode;
            // console.log(park.value);

            //adds buttons to button div
            buttonHandlerEl.appendChild(park);
        };
    };
};

var newMap = function(long, lati){
    var lng = long
    var lat = lati

    //creates a new map centered on lat and lng provided
    var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center:[lng, lat],
        zoom: 7
    });

    //fetches brewery api data
    var response=fetch("https://api.openbrewerydb.org/breweries?per_page=10&by_dist=" +lat+ "," +lng)
        .then(response => response.json())
        .then(data =>makeMarkers(data));


    var makeMarkers = function(data){
        for(var i=0; i<data.length; i++){
            //gets lng and lat for each brewery information returned
            var lng = data[i].longitude
            var lat = data[i].latitude

            //creates the marker and places it on provided lng and lat for each brewery
            var marker = new mapboxgl.Marker({
                color: "forestgreen",
            })
            .setLngLat([lng, lat])
            //creates popup with brewery name, address and website 
            .setPopup(new mapboxgl.Popup()
                .setHTML("<div class='card'><div class='card-divider'><p class='brewName'>"+data[i].name+"</p></div><div class='card-section'><p class='brewAddress'>"+data[i].street+
                    "<br>"+data[i].city+", "+data[i].state+" "+data[i].postal_code+"</p>"+
                    "<a class='brewUrl' href='" +data[i].website_url+"' target='_blank' rel='noopener noreferrer'>"
                    + data[i].website_url +"</a></div></div>")
                .addClassName("popup"))
            .addTo(map);

            marker.className = "marker";
        }
    }  

    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, "bottom-right");
};

var codeFetch = function(code){
    var NPS=fetch("https://developer.nps.gov/api/v1/parks?parkCode=" +code+"&api_key=SwqWC3QHquTaPpof75xXkWepaUKDKmblOtJhEjha")
        .then(response => response.json())
        .then(data => parkInfo(data)); 
}

var parkInfo=function(data){
    console.log(data);
    parkInfoEl.style.display="block";
    parkInfoEl.innerHTML="";

    var parkName = document.createElement("h2");
    parkName.className ="parkName";
    parkName.textContent= data.data[0].fullName;

    var parkImage = document.createElement("img");
    parkImage.className="parkImage";
    parkImage.src = data.data[0].images[0].url;
    parkImage.setAttribute("style", "width:100%; height:200px");

    var description =  document.createElement("p")
    description.className = "parkDescription";
    description.innerHTML= data.data[0].description + "<br><br>" + data.data[0].directionsInfo;

    var weather = document.createElement("p");
    weather.className = "parkWeather";
    weather.textContent = data.data[0].weatherInfo;

    var url = document.createElement("a");
    var linkText=document.createTextNode("Click Here to Visit Park Website");
    url.appendChild(linkText);
    url.className= "parkUrl";
    url.href=data.data[0].url;
    url.target="_blank";
    url.rel="noopener noreferrer";


    parkInfoEl.append(parkName, parkImage, description, weather, url);
}

//when form is submitted...
formEl.addEventListener("submit", function(event){
    event.preventDefault();
    //grabs state value and passes value to national park api
    var selectedState = select.options[select.selectedIndex].value;
    npsFetch(selectedState);
    
});

//when a national park is selected...
buttonHandlerEl.addEventListener("click", function(event){
    if(event.target.type === "button"){
        //...splits the lat and lng into an array and sends values to the map function
        var latlng = event.target.value.split(",");
        // console.log(latlng);
        var lat=latlng[0];
        var lng = latlng[1];
        var code = latlng[2];
        newMap(lng, lat);
        codeFetch(code);
    }
})
