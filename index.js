const GOOGLE_MAP_API_KEY = "AIzaSyAPo7XvP2AAvQOk5i6WiJYW0htAG408Wxg";
const GOOGLE_MAP_URL = ""


function initMap() {
	//this function should initialize Google Maps and fill the "div.js-map-container" or "#map"DOM object with it
	//start location: lat 40.650002 long -73.949997
}

function getLocationByLatLong() {
	//Listen for click on map, return lat and long coordinates

}

function getLocationByAddress() {
	//Listen for form submit from search bar, return address

}


function latLongToAddress(/*whatever argument google geocode API needs*/) {
	//convert lat and long coordinates into an address (to use as a title for the data to be displayed)
	//Use Google Geocode API for this
}

function addressToLatLong() {
	//convert address to lat and long coordinates (to use for API call to NYC 311 API)
}


function requestNYC311Data() {
	//send AJAX request using lat and long coordinates to NYC 311 API 
	//Specify data to be returned - based on lat and long inputs from input
		 //lat and long of any data points returned should be within .5km East, West, North and South of the chosen location
		 //(conversion for lat/long to km multiply degrees by 111.325 or for .5km it is .00449135414327 degrees)

	//Data should be from up to 1 year ago

}

function create311ComplaintChart() {
	//create chart using 311 data that visualizes the most common complaints for various agencies (NYPD, Sanitation, etc.)
}

function renderNeighborhoodDataSideBar() {
	//create DOM element (sidebar) that includes:
	//Address, 311 complaint chart

}
















