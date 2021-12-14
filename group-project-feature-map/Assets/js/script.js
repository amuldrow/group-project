// var parkApi = "https://developer.nps.gov/api/v1/parks?stateCode=" +state+"&api_key=SwqWC3QHquTaPpof75xXkWepaUKDKmblOtJhEjha"
var formEl = document.getElementById("selectState")
var select = document.getElementById("stateList")
var buttonHandlerEl = document.getElementById("parkList")
mapboxgl.accessToken="pk.eyJ1IjoibWlsbGVydGltZTc4IiwiYSI6ImNreDI0dzdmODBwbG8ycnBha3dxaHB1aHEifQ.xNbviSI4FzhsW6yUBpXpDQ"

var npsFetch = function(state){
    var NPS=fetch("https://developer.nps.gov/api/v1/parks?stateCode=" +state+"&api_key=SwqWC3QHquTaPpof75xXkWepaUKDKmblOtJhEjha")
        .then(response => response.json())
        .then(data => displayParks(data)); 
}
 
var displayParks = function(data){
    buttonHandlerEl.textContent="";

    for(var i=0; i<data.data.length; i++){
        if(data.data[i].designation === "National Park" || data.data[i].designation ==="National Park & Preserve"){
            var park = document.createElement("button");
            park.className = "parks";
            park.textContent = data.data[i].fullName;
            park.value = data.data[i].latitude +","+ data.data[i].longitude;
            console.log(park.value);

            buttonHandlerEl.appendChild(park);
        };
    };
};

var newMap = function(long, lati){
    var lng = long
    var lat = lati

    var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center:[lng, lat],
        zoom: 7
    });

    var response=fetch("https://api.openbrewerydb.org/breweries?per_page=10&by_dist=" +lat+ "," +lng)
        .then(response => response.json())
        .then(data =>makeMarkers(data));


    var makeMarkers = function(data){
        console.log(data);
        for(var i=0; i<data.length; i++){
            var lng = data[i].longitude
            var lat = data[i].latitude

            var marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setHTML("<p class='brewName'>"+data[i].name+
                "<p><p class='brewAddress'>"+data[i].street+"<br>"+data[i].city+", "+data[i].state+" "
                +data[i].postal_code+"</p>"+"<a class='brewUrl' href='" +data[i].website_url+
                "' target='_blank' rel='noopener noreferrer'>"+ data[i].website_url +"</a>"))
            .addTo(map);

            marker.className = "marker";
        }
    }  

    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, "bottom-right");
};


formEl.addEventListener("submit", function(event){
    event.preventDefault();
    var selectedState = select.options[select.selectedIndex].value;
    npsFetch(selectedState);
    
});

buttonHandlerEl.addEventListener("click", function(event){
    if(event.target.className = "parks"){
        var latlng = event.target.value.split(",");
        var lat=latlng[0];
        var lng = latlng[1];
        newMap(lng, lat);
    }
})
