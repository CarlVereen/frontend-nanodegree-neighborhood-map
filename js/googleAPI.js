//This is the googleAPI interaction file
//starting location Tokyo, Japan 35.6833° N, 139.6833° E
//API key AIzaSyD61th9_qlpEsR7QjNn4UrpnswZgEReK3E

//Set global variables
var map;
var markerLocations = [];


//initialize google maps centered on Tokyo, disable the default UI features
function initialize() {
	var mapOptions = {
		center: { lat: 35.6833, lng: 139.6833},
		zoom: 10,
    mapTypeId: google.maps.MapTypeId.HYBRID,
    disableDefaultUI: true
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);

//add fun places to visit and other markers of interest
function addMarker(location){

  //add fancy location markers
  // var iconBase = '/img/';
  // var icons = {
  //   parking: {
  //     icon: iconBase + 'automotive.png'
  //   },
  //   library: {
  //     icon: iconBase + 'libraries.png'
  //   },
  //   museums: {
  //     icon: iconBase + 'museums.png'
  //   },
  //   restaurants: {
  //     icon: iconBase + 'restaurants.png'
  //   },
  //   shows: {
  //     icon: iconBase + 'tickets.png'
  //   }
  // };
  //
  // function addMarker(feature) {
  //   var marker = new google.maps.Marker({
  //     position: feature.position,
  //     icon: icons[feature.type].icon,
  //     map: map
  //   });
  // }

  var infoWindow = new google.maps.InfoWindow();

    //setup marker window and options
    function makeInfoWindow(marker){
  		//Create DOM elements for info window
  		var infoWindowContent = '<div class="info_content">';
  		infoWindowContent += '<h4>' + marker.title + '</h4>';
  		infoWindowContent += '<p>' + marker.phone + '</p>';
  		infoWindowContent += '<p class="review"><img src="' + marker.pic + '">' + marker.details + '</p>';
  		infoWindowContent += '</div>';

      //set Infowindow to use custom information
    	infoWindow.setContent(String(infoWindowContent));

    	infoWindow.open(map, marker);
    }

  	//Function delete all markers on the map
  	function deleteAllMarkers(){

    	for(var i = 0, max=markerLocations.length; i < max; i++ ) {
  	  	markerLocations[i].setMap(null);
  	  }

  	  markerLocations = [];
    }

    if(markerLocations.length > 0){
  	  deleteAllMarkers();
    }


    for(var i = 0, max=location.length; i < max; i++ ) {

      var position = new google.maps.LatLng(location[i][2], location[i][3]);

      var marker = new google.maps.Marker({
  	        position: position,
  	        map: map,
  					animation: google.maps.Animation.DROP,
            //icon: to do change the icons of the markers
  	        title: location[i][0],
  	        phone: location[i][1],
  	        pic: location[i][4],
  	        details: location[i][5]
  		    });

      markerLocations.push(marker);

  		//add mouseover event for infowindow to display
  	  google.maps.event
  	  .addListener(marker, 'mouseover', (function(marker, i) {
        return function() {
          makeInfoWindow(marker);
        };
  	  })(marker, i));

  		//add click event for infowindow
  	  google.maps.event
  	  .addListener(marker, 'click', (function(marker, i){
  			return function(){
  	      makeInfoWindow(marker);
  				toggleBounce(marker, i);
  			};
  		})(marker, i));
    }

  	//animate marker for yelp
  	function toggleBounce(marker, i) {

  	  var yelpMarkerDetailUl =  $('.yelp-list').find('ul'),
  	  		yelpMarkerDetail = yelpMarkerDetailUl.find('li'),
  	  		yelpMarkerDetailPos = 212 * i,
  	  		activeYelpMarkerDetail = yelpMarkerDetail.eq(i);

  		// check if marker has animation attribute
  	  if (marker.getAnimation() != null) {
  		  marker.setAnimation(null);
  	    yelpMarkerDetailUl.removeClass('show');
  	    activeYelpMarkerDetail.removeClass('active');
  		//If marker does not have animation attribue give it to marker add to yelp list, remove animation from any other marker

  	  } else {
  			for(animatedMarker in markerLocations){
  				// iterate through all the markers and see if it has the animation attribute
  				var isMoving = markerLocations[animatedMarker].getAnimation();

  				if(isMoving && animatedMarker !== i){
  					markerLocations[animatedMarker].setAnimation(null);
  				}
  			}


  	    marker.setAnimation(google.maps.Animation.BOUNCE);
  	    yelpMarkerDetailUl.addClass('show').animate({
  		    scrollTop: yelpMarkerDetailPos
  		  }, 300);
  		  yelpMarkerDetailUl.find('.active').removeClass('active');
  	    activeYelpMarkerDetail.addClass('active');
  	  }
  	}


  	$('.results').find('li').click(function(){
  		// get index of clicked element
  		var pos = $(this).index();
  		// iterate through markerLocations array
  		for(animatedMarker in markerLocations){
  			var isMoving = markerLocations[animatedMarker].getAnimation();
  			// if marker is animated, remove animation
  			if(isMoving && animatedMarker !== pos){
  				markerLocations[animatedMarker].setAnimation(null);
  			}
  		}

  		markerLocations[pos].setAnimation(google.maps.Animation.BOUNCE);
  		makeInfoWindow(markerLocations[pos]);
  		$('.results').find('.active').removeClass('active');
  		$(this).addClass('active');
  	});
  }
