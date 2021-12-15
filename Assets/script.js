var npsData = function(state){
    var NPS=fetch("https://developer.nps.gov/api/v1/parks?stateCode=" +state+"&api_key=SwqWC3QHquTaPpof75xXkWepaUKDKmblOtJhEjha")
        .then(response => response.json())
        .then(data => test(data)); 
};

var brewData = function(lat, lon){
    var response=fetch("https://api.openbrewerydb.org/breweries?by_dist=" +lat+ "," +lon)
        .then(response => response.json())
        .then(data =>console.log(data));
};
 
var test = function(hold){
    for(var i=0; i<hold.data.length; i++){
        if(hold.data[i].designation === "National Park"){
            console.log(hold.data[i].fullName);
            var lat = hold.data[i].latitude;
            var lon = hold.data[i].longitude;

            brewData(lat,lon);
        };
    };
    console.log(hold);
};

npsData("nc");

