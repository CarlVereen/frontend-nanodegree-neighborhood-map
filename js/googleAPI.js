var tokyo = {called: "tokyo", loc: { lat: 35.707, lng: 139.733}};
var taito = {called: "taito", loc: {lat: 35.703, lng: 139.737}};
var ywsid = 'g4G8OopnF2BWj4yglgeHKw';  //yelp info
var viewModel = new MyViewModel();
var $listElem = $('#list-results');
var resultData = [];
var mapMarkers = [];



$(document).ready(function () {
  ko.applyBindings(viewModel);
});


function MyViewModel() {
    var self = this;
    self.mapOne = {
      center: ko.observableArray([{
        lat:tokyo.loc.lat,
        lng:tokyo.loc.lng
      }]),
      locations: ko.observableArray(),
      clearM: ko.observable(),
      visible: ko.observable('true')
    };
    // console.log(self.mapOne.center()[0].lat);

    self.locations = ko.observableArray();

    self.mapOne.locations.push(tokyo);
    self.mapOne.locations.push(taito);
    // console.log(self.mapOne.locations());
   // Menu and map setup
    self.menu = ko.observableArray([
      {name: 'My Destinations', url: '#'},
      {name: 'Restaurant', url: '#' },
      {name: 'Landmarks & Historical Buildings', url: '#'},
      {name: 'Hotels', url: '#'},
      {name: 'Tokyo', url: '#'},
      {name: 'clear', url: '#'}
    ]);
    self.chosenMenuId = ko.observable();
    self.chosenMenuData = ko.observable();
    self.displayData = ko.observable(false);
    self.query = ko.observable('');

    // Actions on data
    self.goToMenu = function(menu) {
      self.chosenMenuId(menu);
      self.displayData(false);
      console.log(menu.name);
      console.log(self.mapOne.clearM());
      //console.log(menu.name);
      if(menu.name !== self.mapOne.clearM()) {
        self.getRequest(menu.name);
        self.clearMap(self.mapOne.clearM());
        self.mapOne.clearM(menu.name);
      }else {
        //self.clearMap(menu.name);
      }
    };

    self.clearMap = function( topic ) {
      if( topic !== ) {
        self.mapOne.visible ('false');
        console.log('changed to false');
        console.log(self.mapOne.visible());
      }else{
        self.mapOne.visible ('true');
        console.log('changed to true');
        console.log(self.mapOne.visible());
      }
      // console.log(self.mapOne.visible());
    };

    //Yelp data
    self.getRequest = function( searchTopic ) {
      //console.log(searchTopic);
      //clear previous results if any
      //self.mapOne.locations.removeAll();
      $listElem.text("");
      var catSelect= searchTopic;
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
					var yresultData = data.businesses;
          for (var i =0; i < yresultData.length; i++) {
            var yelpName = yresultData[i].name;
            var yelpURL = yresultData[i].url;
            var yelpRating = yresultData[i].rating;
            var yelpImage = yresultData[i].image_url;
            var yelpLocationLat = yresultData[i].location.coordinate.latitude;
            var yelpLocationLng = yresultData[i].location.coordinate.longitude;
            var yelpLocation = yelpLocationLat + ', ' + yelpLocationLng;
            resultData.push({"Name" : yelpName, "loc" : {"lat" : yelpLocationLat, "lng" : yelpLocationLng}});
            $('#list-results').append(
              '<button type="button" class="list-group-item"><span class="badge"> Rating ' + yelpRating + '</span><img src="' + yelpImage +'" alt="Image of' + yelpName + '"><a href="'+ yelpURL + '"name="'+ yelpName + '">' + yelpName + '</a></button>');
            self.mapOne.locations.push({called: yelpName, loc: {lat : yelpLocationLat, lng : yelpLocationLng}, topic: searchTopic});

          }


				}
			});

    };

}



ko.bindingHandlers.map = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var mapObj = ko.utils.unwrapObservable(valueAccessor());
                var latLng = new google.maps.LatLng(
                    ko.utils.unwrapObservable(mapObj.center()[0].lat),
                    ko.utils.unwrapObservable(mapObj.center()[0].lng));

                var mapOptions = { center: latLng,
                                  zoom: 11,
                                  disableDefaultUI: false,
                                  mapTypeId: google.maps.MapTypeId.TERRAIN};

                mapObj.googleMap = new google.maps.Map(element, mapOptions);



                $("#" + element.getAttribute("id")).data("mapObj",mapObj);
            },
          update: function (element, valueAccessor, allBindingsAccessor, viewModel) {

          var mapObj = ko.utils.unwrapObservable(valueAccessor());

          var Pin = function(map, name, lat, lng, text, topic) {
            var marker;

            this.name = ko.observable(name);
            this.lat = ko.observable(lat);
            this.lng = ko.observable(lng);
            this.text = ko.observable(text);
            this.topic = ko.observable(topic);
            this.title = name;

            marker = new google.maps.Marker({
              position: new google.maps.LatLng(lat, lng),
              animation: google.maps.Animation.DROP
            });

            google.maps.event.addListener(marker, 'click', function() {
                 alert("I am a Marker " + name);
               });

            this.isVisible = ko.observable(false);


            this.isVisible.subscribe(function(currentState) {
              if (currentState) {
                marker.setMap(map);
              }else{
                marker.setMap(null);
              }

            });
            this.isVisible(true);
            console.log(this.isVisible());
          };

          var pin = mapObj.locations();
          var pinCreated = [];


          for (var m=0; m<pin.length; m++) {
            if(pin[m].hasOwnProperty('isVisible'))  {

            }else {
            var mapA = mapObj.googleMap;
            var name = pin[m].called;

            var lat = pin[m].loc.lat;
            var lng = pin[m].loc.lng;
            var text = "pin_" + m;
            var topic = pin[m].topic;
            pinCreated.push(name);

            pin[m] = new Pin (mapA, name, lat, lng, text, topic);

          }
        }

          if(mapObj.visible() === "true"){
            for (var v=0; v<pin.length; v++) {
              pin[v].isVisible(true);
            }
          }else{
            for (var p=0; p<pin.length; p++) {
                pin[p].isVisible(false);
            }
          }

          }
        };
