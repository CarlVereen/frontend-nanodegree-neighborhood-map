var map;
var tokyo = { lat: 35.6833, lng: 139.6833};

/**
 * The CenterControl adds a control to the map that recenters the map on
 * tokyo.
 * @constructor
 * @param {!Element} controlDiv
 * @param {!google.maps.Map} map
 * @param {?google.maps.LatLng} center
 */
function CenterControl(controlDiv, map, center) {
  // We set up a variable for this since we're adding event listeners later.
  var control = this;

  // Set the center property upon construction
  control.center_ = center;
  controlDiv.style.clear = 'both';

	// Set CSS for the control border
  var goFoodUI = document.createElement('div');
  goFoodUI.id = 'goFoodUI';
  goFoodUI.title = 'Click to check out restaurants';
  controlDiv.appendChild(goFoodUI);

  // Set CSS for the control interior
  var goFoodText = document.createElement('div');
  goFoodText.id = 'goFoodText';
  goFoodText.innerHTML = 'Restaurants';
  goFoodUI.appendChild(goFoodText);

	// Set CSS for the control border
  var goMuseumUI = document.createElement('div');
  goMuseumUI.id = 'goMuseumUI';
  goMuseumUI.title = 'Click to check out Museums';
  controlDiv.appendChild(goMuseumUI);

  // Set CSS for the control interior
  var goMuseumText = document.createElement('div');
  goMuseumText.id = 'goMuseumText';
  goMuseumText.innerHTML = 'Museums';
  goMuseumUI.appendChild(goMuseumText);

  // Set CSS for the setCenter control border
  var goHotelUI = document.createElement('div');
  goHotelUI.id = 'goHotelUI';
  goHotelUI.title = 'Click to change the center of the map';
  controlDiv.appendChild(goHotelUI);

  // Set CSS for the control interior
  var goHotelText = document.createElement('div');
  goHotelText.id = 'goHotelText';
  goHotelText.innerHTML = 'Hotels';
  goHotelUI.appendChild(goHotelText);

	// Set CSS for the control border
	var goCenterUI = document.createElement('div');
	goCenterUI.id = 'goCenterUI';
	goCenterUI.title = 'Click to recenter the map';
	controlDiv.appendChild(goCenterUI);

	// Set CSS for the control interior
	var goCenterText = document.createElement('div');
	goCenterText.id = 'goCenterText';
	goCenterText.innerHTML = 'Center on Tokyo';
	goCenterUI.appendChild(goCenterText);

// =======================================================================
//Event listeners

  // Set up the click event listener for 'Center Map': Set the center of the map
  // to the current center of the control.
  goCenterUI.addEventListener('click', function() {
    map.setCenter(tokyo);
  });

  // Set up the click event listener for 'Hotel search': add hotel map icons
  goHotelUI.addEventListener('click', function() {
    //call yelp api
		//call forsquare api
		console.log('click');
  });

	// Set up the click event listener for 'restaurants': add restaurant map icons
  goFoodUI.addEventListener('click', function() {
		//call yelp api
		//call forsquare api
		console.log('click');
  });

  // Set up the click event listener for 'Musems': add museum map icons
  goMuseumUI.addEventListener('click', function() {
		//call yelp api
		//call forsquare api
		console.log('click');
  });
}

//======================================================================

/**
 * Define a property to hold the center state.
 * @private
 */
CenterControl.prototype.center_ = null;

/**
 * Gets the map center.
 * @return {?google.maps.LatLng}
 */
CenterControl.prototype.getCenter = function() {
  return this.center_;
};

/**
 * Sets the map center.
 * @param {?google.maps.LatLng} center
 */
CenterControl.prototype.setCenter = function(center) {
  this.center_ = center;
};

function initMap() {
	var mapOptions = {
		center: tokyo,
		zoom: 10,
		mapTypeId: google.maps.MapTypeId.TERRAIN,
		disableDefaultUI: true
	};
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // Create the DIV to hold the control and call the CenterControl() constructor
  // passing in this DIV.
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map, tokyo);

  centerControlDiv.index = 1;
  centerControlDiv.style['padding-top'] = '10px';
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
}
google.maps.event.addDomListener(window, 'load', initMap);

// ===================================================================
