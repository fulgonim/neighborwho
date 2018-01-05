const GOOGLE_MAP_API_KEY = "AIzaSyAPo7XvP2AAvQOk5i6WiJYW0htAG408Wxg";
const GOOGLE_GEOCODE_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const NYC_311_API_ENDPOINT_URL = "https://data.cityofnewyork.us/resource/fhrw-4uyv.json";
const APP_TOKEN = "cWH2iJxbfljPUicrdhnNB7Znk";
const SECRET_APP_TOKEN = "qdLc7ATCQe_VeoZ0omeXvnGN6pfXK5xF-IDu"

let map;

//initialize google map centered on North Brooklyn
function initMap() {
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
}

let currentAddressInfo;

let marker;

//use location data from Google to create a new location marker with button to find out more about the complaint data in that area
function addMarkerWithLocationData(coords, map, locationData) {
    	console.log("this is the location data stored in the variable currentAddressInfo");
    	console.log(coords);

    	//remove any markers already present on the map
    	if (marker) {
    		marker.setMap(null);
    	}

    	marker = new google.maps.Marker({
			position: coords,
			map: map
		});

    	let addressName = locationData.results[0].formatted_address;
    	
		let infoWindow = new google.maps.InfoWindow({
		content: `<h2>${addressName}</h2>
				<form class="js-map-popout-form" id="js-map-popout-form">
					<button onclick="nyc311Call(event)" class="js-map-find-out-more" type="submit">Find Out What People are Complaining About</button>
				</form>
		`
		});

		infoWindow.open(map, marker);

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

let current311Data = [];

function nyc311Call(event) {

	event.preventDefault();

	//The following code sets the date window for the AJAX call

	let currentDate = new Date();
	let subtract2Months = new Date();

	console.log(currentDate);

	console.log("Here is the current date's month");
	console.log(currentDate.getMonth());

	subtract2Months.setMonth(currentDate.getMonth() - 2);
	console.log("Here is the current date's month minus 2");
	console.log(subtract2Months.getMonth());

	let newDate = currentDate.toISOString().split("T")[0];
	let refDate = subtract2Months.toISOString().split("T")[0];

	console.log("Today's date:")
	console.log(newDate);

	console.log("Reference Date:")
	console.log(refDate);
	//console.log(refDate);

	let whenString = "created_date between '"+refDate+"' and '"+newDate+"'";
	console.log("decoded string:");
	console.log(whenString);

	//Zipcode query input

	let currentZip = currentAddressInfo.results[0].address_components[7].long_name;
	console.log("the current zip is:");
	console.log(currentZip);

	let zipString = "incident_zip='"+currentZip+"'";
	
	//what the URL should look like: https://data.cityofnewyork.us/resource/fhrw-4uyv.json?$where=created_date%20between%20%272017-07-16%27%20and%20%272017-12-17%27
	//AJAX call to NYC 311 database to return 311 complaint data
	//success call runs all additional functions needed to store and display correct data
	const settings = {
		url: NYC_311_API_ENDPOINT_URL,
		data: {
			"$$app_token": APP_TOKEN,
			$query: `SELECT * WHERE ${whenString} AND ${zipString} AND agency='NYPD'`
		},

		type: "GET",
		success: function(data) {
			console.log("here's the 311 data!")
			console.log(data);
			current311Data = data;
			renderComplaintTypes(getComplaintTypes(data), data);
			toggleDescriptions();
		},
		error: function () {
            alert("We had trouble processing your request, try another residential address");
        }
	};
	$.ajax(settings);
}

//loop through the 311 data and pull out all the complaint types and determine how many of each type there are present
function getComplaintTypes(data) {

	let complaints = {};

	for (let i = 0; i < data.length; i++) {

		let complaintType = data[i].complaint_type;

		if (complaints[complaintType]) {
			complaints[complaintType]++;
		} else {
			complaints[complaintType] = 1;
		}
	}

	console.log("complaint object");
	console.log(complaints);
	return complaints;
}

//get the specific complaint descriptions using the complaint type
function getComplaintDescriptions(current311Data, complaint) {

	let complaintDescriptionArray = [];
	let complaintDescriptionStats = {};

	for (let i = 0; i < current311Data.length; i++) {
		if (current311Data[i].complaint_type === complaint) {
			complaintDescriptionArray.push(current311Data[i].descriptor);
		}
	}
	console.log("here is the full, unordered description list:")
	console.log(complaintDescriptionArray);

	complaintDescriptionArray.forEach(function(i) { complaintDescriptionStats[i] = (complaintDescriptionStats[i]||0) + 1;});
	console.log("here's the description object with descriptions and stats:")
	console.log(complaintDescriptionStats);
	
	return complaintDescriptionStats;
}	

// loop through the complaints object and create buttons for each to display in the infowindow
//each button will have hidden list items 
function renderComplaintTypes(complaints, data) {

	let statSideBar = document.getElementById('js-stat-side-bar');

	// empty the statSideBar element before dynamically adding new complaint buttons
	$(statSideBar).empty();

	//create a div to hold all the buttons and their associated lists
	let complaintButtonContainer = document.createElement("div");
	complaintButtonContainer.setAttribute("class", "js-complaints-descriptions css-complaints-descriptions");

	//append this div to the stat side bar
	statSideBar.append(complaintButtonContainer); 

	// loop through complaint list, create buttons and get the associated descriptions and create a list element of them
	let counter = 0;

	for (let complaint in complaints) {
		console.log("here are the complaints and their stats:");
		console.log(`obj.${complaint} = ${complaints[complaint]}`);	

//*****//get specific complaint descriptions and store in an array by calling the "getComplaintDescriptions" function
		let descriptions = getComplaintDescriptions(data, complaint);
		console.log("here are the descriptions and their stats:");
		console.log(descriptions);
//*****
		//create a button (OR ANCHOR ELEMENT?) 
		let complaintButton = document.createElement("button");
		complaintButton.setAttribute("class", `js-complaint-button complaint-button-${counter} css-complaint-button`);
		//complaintButton.setAttribute("onclick", "toggleDescriptions()");
		complaintButton.setAttribute("value", complaint);

		let complaintList = document.createElement("ul");
		complaintList.setAttribute("class", `js-complaint-list complaint-list-${counter} css-complaint-list hidden`);

		$('.js-complaints-descriptions').append(complaintButton);
		$(`.complaint-button-${counter}`).text(`${complaint}: ${complaints[complaint]}`);
		$('.js-complaints-descriptions').append(complaintList);

		for (let description in descriptions) {
			let descriptionItem = document.createElement("li");
			descriptionItem.setAttribute("class", `js-description-item description-item-${descriptions[description]} css-description-item`);
			$(`.complaint-list-${counter}`).append(descriptionItem);
			$(descriptionItem).text(`${description}: ${descriptions[description]}`);
		}
		counter++;
	}
}

function toggleDescriptions() {
	
	$('.js-complaint-button').on('click', event => {
		event.preventDefault();
		console.log("Complaint Button has been clicked!");
		$(event.currentTarget).next('ul').toggleClass('hidden');
	});
}

function main() {
	listenForSearchInputThenRunFunctions();
}

$(main);


