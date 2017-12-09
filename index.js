const GOOGLE_MAP_API_KEY = "AIzaSyAPo7XvP2AAvQOk5i6WiJYW0htAG408Wxg";
const GOOGLE_GEOCODE_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const GOOGLE_MAP_URL = ""


function initWelcomeLightBox() {
	//Lightbox to welcome user and explain what this app does
}






function initMap() {
	//this function should initialize Google Maps and fill the "div.js-map-container" or "#map"DOM object with it
	//start location: lat 40.650002 long -73.949997
	//include search bar
	//let bounds = new google.maps.LatLngBounds();
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
	let map = new google.maps.Map(document.getElementById('map'), mapOptions);

	// New event listener for a click on the map
	google.maps.event.addListener(map, 'click', function(event) {

		// create new marker
		let latLng = event.latLng;
		console.log(latLng);
		addMarker(latLng, map);
		//requestLocationDataWithLatLng(latLng);

	})



	// new googe maps autocomplete-enabled search bar
	let input = document.getElementById('search-input');
        let searchBox = new google.maps.places.SearchBox(input);
  
        // Bias the SearchBox results towards current map's viewport
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });
   

    let currentLocationData ;

    // Add Marker function that displays location data
    function addMarkerWithLocationData(coords, map, locationData) {
    	console.log(coords);
    	let marker = new google.maps.Marker({
			position: coords,
			map: map
		});


    	//let locationData1 = currentLocationData.results[0];
    	// add infoWindow that features a submit button to initiate the 311 call
		let infoWindow = new google.maps.InfoWindow({
			content: `<h1>${locationData.formatted_address}</h1>
					<form class="js-map-popout-form">
						<button class="js-map-find-out-more" type="submit">Find Out More</button>
					</form>
			`
		});

		marker.addListener('click', function() {
			infoWindow.open(map, marker);
		})
    }

    function requestLocationDataWithAddress(getAddress) {
	//use URL GOOGLE_GEOCODE_API_URL w/ GOOGLE_MAP_API_KEY to get google maps geocode API location data

	let query = {"address": getAddress, key: "AIzaSyAPo7XvP2AAvQOk5i6WiJYW0htAG408Wxg"};

	$.getJSON(GOOGLE_GEOCODE_API_URL, query, function(data) {
		console.log(data +"this is the address API call");

		currentLocationData = data;
		console.log(currentLocationData);

	});

	console.log(currentLocationData);

	}

	function requestLocationDataWithLatLng(getLtLng) {
		let query = {"latlng": [getLtLng.lat, getLtLng.lng], key: "AIzaSyAPo7XvP2AAvQOk5i6WiJYW0htAG408Wxg"};

		$.getJSON(GOOGLE_GEOCODE_API_URL, query, function(data) {
			console.log(data);
		})
	}

	function getLocationByAddress() {
		//Listen for form submit from search bar, return address

		$('.js-search-input').on('submit', event => {
			event.preventDefault();
			
			let address = $('#search-input').val();
			
			requestLocationDataWithAddress(address);

			console.log(currentLocationData['geometry']);

			addMarkerWithLocationData(currentLocationData.location, map, currentLocationData);

			
		});
	}

	getLocationByAddress();





}

function listenAndInit311Call() {
	$('.js-map-find-out-more').on('sumbit', event => {
		event.preventDefault();



	});
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
	//getLocationByAddress();

}



//$(main());






