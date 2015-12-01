var tokyo = { lat: 35.707, lng: 139.733};
var ywsid = 'g4G8OopnF2BWj4yglgeHKw';  //yelp info
var viewModel = new MyViewModel();

$(document).ready(function () {
  ko.applyBindings(viewModel);
});

function MyViewModel() {
    var self = this;
    self.mapOne = ko.observable({
        lat: ko.observable(tokyo.lat),
        lng:ko.observable(tokyo.lng)
    });

   // Menu and map setup
    self.menu = ko.observableArray([
      {name: 'Restaurant', url: '#' },
      {name: 'Places of Interest', url: '#'},
      {name: 'Hotels', url: '#'},
      {name: 'Tokyo', url: '#'}
    ]);
    self.chosenMenuId = ko.observable();
    self.chosenMenuData = ko.observable();
    self.displayData = ko.observable(false);
    self.query = ko.observable('');

    // Actions on data
    self.goToMenu = function(menu) {
      self.chosenMenuId(menu);
      self.displayData(true);
      console.log(menu.name);
      self.getRequest(menu.name);
    };

    //Restaurants data
    self.getRequest = function( searchTopic ) {
      console.log(searchTopic);
      var catSelect= 'Restaurants';
      var auth = {
				//
				// Update with your auth tokens.
				//
				consumerKey : "g4G8OopnF2BWj4yglgeHKw",
				consumerSecret : "M3Wyy0015F46ub0CW-pYwC8JDZc",
				accessToken : "YHEFS0VFj-8ZGvFg4QnCoSQML9K_sloW",
				// This example is a proof of concept, for how to use the Yelp v2 API with javascript.
				// You wouldn't actually want to expose your access token secret like this in a real application.
				accessTokenSecret : "_nLafuo0yeGXlRp6zS3zejo-3nU",
				serviceProvider : {
					signatureMethod : "HMAC-SHA1"
				}
			};

      var accessor = {
				consumerSecret : auth.consumerSecret,
				tokenSecret : auth.accessTokenSecret
			};

      parameters = [];
			parameters.push(['callback', 'cb']);
			parameters.push(['oauth_consumer_key', auth.consumerKey]);
			parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
			parameters.push(['oauth_token', auth.accessToken]);
			parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

      var message = {
				'action' : 'http://api.yelp.com/v2/search?term=' + catSelect + '&sort=2&limit=10&location=Tokyo',
				'method' : 'GET',
				'parameters' : parameters
			};

      OAuth.setTimestampAndNonce(message);
			OAuth.SignatureMethod.sign(message, accessor);

      var parameterMap = OAuth.getParameterMap(message.parameters);
			parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
			//console.log(parameterMap);

      $.ajax({
				'url' : message.action,
				'data' : parameterMap,
				'cache' : true,
				'dataType' : 'jsonp',
				'jsonpCallback' : 'cb',
				'success' : function(data, textStats, XMLHttpRequest) {
					console.log(data.businesses);
          var resultData = data.businesses;
          for (var i =0; i < resultData.length; i++) {
            var yelpBusinessName=resultData[i].name;
            console.log(yelpBusinessName);
            $('#list-results').append('<li class="results">' + yelpBusinessName + '</li>');
          }
					// var output = prettyPrint(data);
					// $("body").append(output);
				}
			});




        // var requestYelp = "https://api.yelp.com/v2/search?term=food&location=Tokyo";
        // $.ajax({
        //   url: requestYelp,
        //   dataType: "jsonp",
        //   success: function(data, textStatus, jqXHR) {
            // $wikiHeaderElem.text('Wikipedia Articles About ' + cityStr);
            // var wikiTitle = data[1];
            // var wikiLinks = data[3];
            // for (var i = 0; i < data.length; i++){
            //     $wikiElem.append('<ul id="wikipedia-links"> <a href="' + wikiLinks[i] + '">' + wikiTitle[i] + '</a></ul>');
            // }
          //   console.log("success");
          //   console.log(data);
          // },
        // });
       };

}



ko.bindingHandlers.map = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var mapObj = ko.utils.unwrapObservable(valueAccessor());
                var latLng = new google.maps.LatLng(
                    ko.utils.unwrapObservable(mapObj.lat),
                    ko.utils.unwrapObservable(mapObj.lng));
                var mapOptions = { center: latLng,
                                  zoom: 13,
                                  disableDefaultUI: false,
                                  mapTypeId: google.maps.MapTypeId.TERRAIN};

                mapObj.googleMap = new google.maps.Map(element, mapOptions);



                //Mapping Markers
                mapObj.marker = new google.maps.Marker({
                    map: mapObj.googleMap,
                    position: latLng,
                    animation: google.maps.Animation.DROP,
                    title: "You Are Here",
                    draggable: true
                });

                var mapMarker = mapObj.marker;
                mapMarker.addListener('click', toggleBounce);

                function toggleBounce() {
                  if (mapMarker.getAnimation() !== null) {
                    mapMarker.setAnimation(null);
                  } else {
                    mapMarker.setAnimation(google.maps.Animation.BOUNCE);
                  }
                }

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
