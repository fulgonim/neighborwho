const GOOGLE_MAP_API_KEY = "AIzaSyAPo7XvP2AAvQOk5i6WiJYW0htAG408Wxg";
const GOOGLE_GEOCODE_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const GOOGLE_MAP_URL = ""


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
function addMarkerWithLocationData(coords, map) {
    	console.log("this is the location data stored in the variable currentAddressInfo");
    	console.log(coords);

    	let marker = new google.maps.Marker({
			position: coords,
			map: map
		});
    	
		let infoWindow = new google.maps.InfoWindow({
		content: `<h1>MY MARKER</h1>
				<form class="js-map-popout-form">
					<button class="js-map-find-out-more" type="submit">Find Out More</button>
				</form>
		`
		});

		marker.addListener('click', function() {
			infoWindow.open(map, marker);
		})
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
		addMarkerWithLocationData(currentAddressInfo.results[0].geometry.location, map);

	});

}

// Listen for submit on "find out more" button
function findOutMore() {
	$('.js-map-find-out-more').on('submit', event => {
		event.preventDefault();


	})
}

function Nyc311Call() {
	
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
}

main();



