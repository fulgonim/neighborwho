const GOOGLE_MAP_API_KEY = "AIzaSyAPo7XvP2AAvQOk5i6WiJYW0htAG408Wxg";
const GOOGLE_GEOCODE_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const NYC_311_API_ENDPOINT_URL = "https://data.cityofnewyork.us/resource/fhrw-4uyv.json";
const APP_TOKEN = "cWH2iJxbfljPUicrdhnNB7Znk";
const SECRET_APP_TOKEN = "qdLc7ATCQe_VeoZ0omeXvnGN6pfXK5xF-IDu"


function initWelcomeLightBox() {
	//Lightbox to welcome user and explain what this app does
}

let map;

function initMap() {
	//this function should initialize Google Maps and fill the "div.js-map-container" or "#map"DOM object with it
	//start location: lat 40.650002 long -73.949997
	//include search bar
	//let bounds = new google.maps.LatLngBounds();

	// temporary starting coordinates for marker
	let brooklynStart = {
		lat: 40.650002, lng: -73.949997
	}
	// Map options
	let mapOptions = {
		center: brooklynStart,
		zoom: 13,
		mapTypeId: 'roadmap'
	}
	// New Map
	map = new google.maps.Map(document.getElementById('map'), mapOptions);

	// new googe maps autocomplete-enabled search bar
	let input = document.getElementById('search-input');
        let searchBox = new google.maps.places.SearchBox(input);
  
        // Bias the SearchBox results towards current map's viewport
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });
    
    	addMarkerWithLocationData(brooklynStart, map);
    
}


let currentAddressInfo;


// make sure to re-configure this function
function addMarkerWithLocationData(coords, map, locationData) {
    	console.log("this is the location data stored in the variable currentAddressInfo");
    	console.log(coords);

    	let marker = new google.maps.Marker({
			position: coords,
			map: map
		});
    	
		let infoWindow = new google.maps.InfoWindow({
		content: `<h1>MY MARKER</h1>
				<form class="js-map-popout-form">
					<button onclick="nyc311Call(event)" class="js-map-find-out-more" type="submit">Find Out More</button>
				</form>
		`
		});

		marker.addListener('click', function() {
			infoWindow.open(map, marker);
		})

		map.panTo(marker.getPosition());
}

// listen for search input and retrieve location data
function listenForSearchInputThenRunFunctions() {
	$('.js-search-input').on('submit', event => {
		event.preventDefault();

		let currentAddress = $('.search-input').val();
		console.log("this is the current address being searched:");
		console.log(currentAddress);

		requestLocationDataWithAddress(currentAddress);

		
	})
}


// request location data using input address then create a new marker
function requestLocationDataWithAddress(getAddress) {
//use URL GOOGLE_GEOCODE_API_URL w/ GOOGLE_MAP_API_KEY to get google maps geocode API location data

	let query = {"address": getAddress, key: "AIzaSyAPo7XvP2AAvQOk5i6WiJYW0htAG408Wxg"};

	$.getJSON(GOOGLE_GEOCODE_API_URL, query, function(data) {
		console.log(`this is the data returned from google maps API places library about: ${getAddress}`)
		console.log(data);
		
		currentAddressInfo = data;
		console.log('this is the data once it\'s passed into a new global variable called currentAddressInfo');
		console.log(currentAddressInfo);

		//create new marker with location info
		addMarkerWithLocationData(currentAddressInfo.results[0].geometry.location, map, currentAddressInfo);

	});

}

function nyc311Call(event) {

	event.preventDefault();

	//The following code sets the date window for the AJAX call

	let currentDate = new Date();
	let subtract2Months = new Date();

	console.log(currentDate);

	console.log("Here is the current date's month");
	console.log(currentDate.getMonth());

	subtract2Months.setMonth(currentDate.getMonth() - 10);
	console.log("Here is the current date's month minus 2");
	console.log(subtract2Months.getMonth());


	let newDate = currentDate.toISOString().split("T")[0];
	let refDate = subtract2Months.toISOString().split("T")[0];

	console.log("Today's date:")
	console.log(newDate);

	//let refDate = newDate.setMonth(newDate.getMonth() - 2);

	console.log("Reference Date:")
	console.log(refDate);
	//console.log(refDate);

	let whenString = "created_date between '"+refDate+"' and '"+newDate+"'";
	console.log("decoded string:");
	console.log(whenString);


	//the following code sets the lat long parameters

	//LATITUDE

	let latLngBoundDistance = 0.00449135414327;

	let currentLat = currentAddressInfo.results[0].geometry.location.lat;
	let currentLng = currentAddressInfo.results[0].geometry.location.lng;
	console.log("here's the current location lat:");
	console.log(currentLat);


	let northLatBound = currentLat + latLngBoundDistance;
	let southLatBound = currentLat - latLngBoundDistance;

	let whereLatString = "latitude between '"+northLatBound+"' and '"+southLatBound+"'";

	//LONGITUDE

	console.log("here's the current location long:");
	console.log(currentLng);

	let westLngBound = currentLng - latLngBoundDistance;
	let eastLngBound = currentLng + latLngBoundDistance;

	

	let whereLngString = "longitude between '"+westLngBound+"' and '"+eastLngBound+"'";


	//what the URL should look like: https://data.cityofnewyork.us/resource/fhrw-4uyv.json?$where=created_date%20between%20%272017-07-16%27%20and%20%272017-12-17%27
	const settings = {
		url: NYC_311_API_ENDPOINT_URL,
		data: {
			"$$app_token": APP_TOKEN,
			$query: `WHERE ${whenString} AND ${whereLatString} AND ${whereLngString}`
			//created_date: refDate
		},
		type: "GET",
		success: function(data) {
			console.log("here's the 311 data!")
			console.log(data);
		}

	};

	$.ajax(settings);

}



function requestNYC311Data() {
	//send AJAX request using lat and long coordinates to NYC 311 API 
	//Specify data to be returned - based on lat and long inputs from input
		 //lat and long of any data points returned should be within .5km East, West, North and South of the chosen location
		 //(conversion for lat/long to km multiply degrees by 111.325 or for .5km it is .00449135414327 degrees)

	//Data should be from up to 1 year ago

}

function create311ComplaintChart() {
	//create chart (with Google D3 API) using 311 data that visualizes the most common complaints for various agencies (NYPD, Sanitation, etc.)
}

function renderNeighborhoodDataSideBar() {
	//create DOM element (sidebar) that includes:
	//Address, 311 complaint chart

}




function main() {
	listenForSearchInputThenRunFunctions();
	//findOutMore();
}

$(main);




