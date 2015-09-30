var map;
var tokyo = { lat: 35.6833, lng: 139.6833};

$(document).ready(function () {
  ko.applyBindings(viewModel);
});

function MyViewModel() {
    var self = this;
    self.mapOne = ko.observable({
        lat: ko.observable(tokyo.lat),
        lng:ko.observable(tokyo.lng)
    });

    self.mapTwo = ko.observable({
        lat: ko.observable(40.76),
        lng:ko.observable(-73.98)
    });
    self.menu = ['Restaurants', 'Places of Interest', 'Hotels', 'Tokyo'];
    self.chosenMenuId = ko.observable();

    self.goToFolder = function(folder) {
    self.chosenFolderId(folder);
  };
}

ko.bindingHandlers.map = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var mapObj = ko.utils.unwrapObservable(valueAccessor());
                var latLng = new google.maps.LatLng(
                    ko.utils.unwrapObservable(mapObj.lat),
                    ko.utils.unwrapObservable(mapObj.lng));
                var mapOptions = { center: latLng,
                                  zoom: 10,
                                  disableDefaultUI: true,
                                  mapTypeId: google.maps.MapTypeId.TERRAIN};

                mapObj.googleMap = new google.maps.Map(element, mapOptions);

                mapObj.marker = new google.maps.Marker({
                    map: mapObj.googleMap,
                    position: latLng,
                    title: "You Are Here",
                    draggable: true
                });

                mapObj.onChangedCoord = function(newValue) {
                    var latLng = new google.maps.LatLng(
                        ko.utils.unwrapObservable(mapObj.lat),
                        ko.utils.unwrapObservable(mapObj.lng));
                    mapObj.googleMap.setCenter(latLng);
                };

                mapObj.onMarkerMoved = function(dragEnd) {
                    var latLng = mapObj.marker.getPosition();
                    mapObj.lat(latLng.lat());
                    mapObj.lng(latLng.lng());
                };

                mapObj.lat.subscribe(mapObj.onChangedCoord);
                mapObj.lng.subscribe(mapObj.onChangedCoord);

                google.maps.event.addListener(mapObj.marker, 'dragend', mapObj.onMarkerMoved);

                $("#" + element.getAttribute("id")).data("mapObj",mapObj);
            }
        };


var viewModel = new MyViewModel();


//
//
// /**
//  * The CenterControl adds a control to the map that recenters the map on
//  * tokyo.
//  * @constructor
//  * @param {!Element} controlDiv
//  * @param {!google.maps.Map} map
//  * @param {?google.maps.LatLng} center
//  */
// function CenterControl(controlDiv, map, center) {
//   // We set up a variable for this since we're adding event listeners later.
//   var control = this;
//
//   // Set the center property upon construction
//   control.center_ = center;
//   controlDiv.style.clear = 'both';
//
// 	// Set CSS for the control border
//   var goFoodUI = document.createElement('div');
//   goFoodUI.id = 'goFoodUI';
//   goFoodUI.title = 'Click to check out restaurants';
//   controlDiv.appendChild(goFoodUI);
//
//   // Set CSS for the control interior
//   var goFoodText = document.createElement('div');
//   goFoodText.id = 'goFoodText';
//   goFoodText.innerHTML = 'Restaurants';
//   goFoodUI.appendChild(goFoodText);
//
// 	// Set CSS for the control border
//   var goMuseumUI = document.createElement('div');
//   goMuseumUI.id = 'goMuseumUI';
//   goMuseumUI.title = 'Click to check out Museums';
//   controlDiv.appendChild(goMuseumUI);
//
//   // Set CSS for the control interior
//   var goMuseumText = document.createElement('div');
//   goMuseumText.id = 'goMuseumText';
//   goMuseumText.innerHTML = 'Museums';
//   goMuseumUI.appendChild(goMuseumText);
//
//   // Set CSS for the setCenter control border
//   var goHotelUI = document.createElement('div');
//   goHotelUI.id = 'goHotelUI';
//   goHotelUI.title = 'Click to change the center of the map';
//   controlDiv.appendChild(goHotelUI);
//
//   // Set CSS for the control interior
//   var goHotelText = document.createElement('div');
//   goHotelText.id = 'goHotelText';
//   goHotelText.innerHTML = 'Hotels';
//   goHotelUI.appendChild(goHotelText);
//
// 	// Set CSS for the control border
// 	var goCenterUI = document.createElement('div');
// 	goCenterUI.id = 'goCenterUI';
// 	goCenterUI.title = 'Click to recenter the map';
// 	controlDiv.appendChild(goCenterUI);
//
// 	// Set CSS for the control interior
// 	var goCenterText = document.createElement('div');
// 	goCenterText.id = 'goCenterText';
// 	goCenterText.innerHTML = 'Center on Tokyo';
// 	goCenterUI.appendChild(goCenterText);
//
// // =======================================================================
// //Event listeners
//
//   // Set up the click event listener for 'Center Map': Set the center of the map
//   // to the current center of the control.
//   goCenterUI.addEventListener('click', function() {
//     map.setCenter(tokyo);
//   });
//
//   // Set up the click event listener for 'Hotel search': add hotel map icons
//   goHotelUI.addEventListener('click', function() {
//     //call yelp api
// 		//call forsquare api
// 		console.log('click');
//   });
//   goHotelUI.addEventListener('mouseover', function() {
//     //create drop down menu
//     	console.log('click');
//       dropDown(hotel);
//   });
//
// 	// Set up the click event listener for 'restaurants': add restaurant map icons
//   goFoodUI.addEventListener('click', function() {
// 		//call yelp api
// 		//call forsquare api
// 		console.log('click');
//   });
//
//   // Set up the click event listener for 'Musems': add museum map icons
//   goMuseumUI.addEventListener('click', function() {
// 		//call yelp api
// 		//call forsquare api
// 		console.log('click');
//   });
// }
//
// //======================================================================
//
// /**
//  * Define a property to hold the center state.
//  * @private
//  */
// CenterControl.prototype.center_ = null;
//
// /**
//  * Gets the map center.
//  * @return {?google.maps.LatLng}
//  */
// CenterControl.prototype.getCenter = function() {
//   return this.center_;
// };
//
// /**
//  * Sets the map center.
//  * @param {?google.maps.LatLng} center
//  */
// CenterControl.prototype.setCenter = function(center) {
//   this.center_ = center;
// };
//
// function initMap() {
// 	var mapOptions = {
// 		center: tokyo,
// 		zoom: 10,
// 		mapTypeId: google.maps.MapTypeId.TERRAIN,
// 		disableDefaultUI: true
// 	};
//   map = new google.maps.Map(document.getElementById('map'), mapOptions);
//
//   // Create the DIV to hold the control and call the CenterControl() constructor
//   // passing in this DIV.
//   var centerControlDiv = document.createElement('div');
//   var centerControl = new CenterControl(centerControlDiv, map, tokyo);
//
//   centerControlDiv.index = 1;
//   centerControlDiv.style['padding-top'] = '10px';
//   map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
// }
// google.maps.event.addDomListener(window, 'load', initMap);
//
// /* ======================================================================
// * Misc functions
// */
//
// function dropDown(menu) {
//   if(menu === 'hotel') {
//
//   }
//   else if (menu === 'museums') {
//
//   }
//   else if (menu === 'food') {
//
//   }
// }
//
//
//
// // /* ===================================================================
// // * Yelp api access
// // */
// //
// // // Request API access: http://www.yelp.com/developers/getting_started/api_access
// //
// // var yelp = {
// //   consumer_key: "g4G8OopnF2BWj4yglgeHKw",
// //   consumer_secret: "M3Wyy0015F46ub0CW-pYwC8JDZc",
// //   token: "YHEFS0VFj-8ZGvFg4QnCoSQML9K_sloW",
// //   token_secret: "_nLafuo0yeGXlRp6zS3zejo-3nU"
// // };
// //
// // //declare namespace
// // var yoh = {};
// //
// // //array to hold yelp markers
// // var yelpMarkers = [];
// //
// // //defines bounding box of all locations
// // var bounds;
// //
// // //info window
// // var infowindow = new google.maps.InfoWindow();
// //
// // //trace function for debugging
// // function trace(message)
// // {
// //     if (typeof console != 'undefined')
// //     {
// //         console.log(message);
// //     }
// // }
// //
// // //toggle array layers on/off
// // yoh.toggleArrayLayer = function(arraylayer)
// // {
// //     if (arraylayer) {
// //         for (i in arraylayer) {
// //             if (arraylayer[i].getVisible() == true)
// //             {
// //                 arraylayer[i].setMap(null);
// //                 arraylayer[i].visible = false;
// //             }
// //             else
// //             {
// //                 arraylayer[i].setMap(map);
// //                 arraylayer[i].visible = true;
// //             }
// //         }
// //     }
// // }
// //
// // //Function to create yelp marker
// // yoh.createYelpMarker = function(i,latitude,longitude,title, infowindowcontent)
// // {
// //     var markerLatLng = new google.maps.LatLng(latitude,longitude);
// //
// //     //extent bounds for each stop and adjust map to fit to it
// //     bounds.extend(markerLatLng);
// //     map.fitBounds(bounds);
// //
// //     yelpMarkers[i] = new google.maps.Marker({
// //         position: markerLatLng,
// //         map: map,
// //         title: title,
// //         icon: 'http://yohman.bol.ucla.edu/images/yelp.png'
// //     });
// //
// //     //add an onclick event
// //     google.maps.event.addListener(yelpMarkers[i], 'click', function() {
// //         infowindow.setContent(infowindowcontent);
// //         infowindow.open(map,yelp[i]);
// //     });
// // }
//
// // //function to get data from YELP
// // yoh.getYelp = function(term)
// // {
// //     bounds = new google.maps.LatLngBounds ();
// //     $.getJSON('http://api.yelp.com/business_review_search?lat='+map.getCenter().lat()+'&long='+map.getCenter().lng()+'&limit=20&ywsid=g4G8OopnF2BWj4yglgeHKw'+term+'&callback=?',
// //         function(data)
// //         {
// //             $.each(data.businesses, function(i,item){
// //                 trace(item);
// //                 infowindowcontent = '<strong>'+item.name+'</strong><br>';
// //                 infowindowcontent += '<img src="'+item.photo_url+'"><br>';
// //                 infowindowcontent += '<a href="'+item.url+'" target="_blank">see it on yelp</a>';
// //
// //                 yoh.createYelpMarker(i,item.latitude,item.longitude,item.name, infowindowcontent);
// //             });
// //         }
// //     );
// // };
// //
// // //Function that gets run when the document loads
// // yoh.initialize = function()
// // {
// //     var latlng = new google.maps.LatLng(34.0194543,-118.4911912);
// //     var myOptions = {
// //         zoom: 12,
// //         center: latlng,
// //         mapTypeId: google.maps.MapTypeId.ROADMAP
// //     };
// //     map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
// //
// //     //Sample call for yelp data for cafe's
// //     yoh.getYelp('cafe');
// // };
