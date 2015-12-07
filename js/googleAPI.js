var tokyo = {called: "tokyo", loc: { lat: 35.707, lng: 139.733}, topic: "My Destinations"};
var tokyoTrip = [ {called: "tokyo", loc: { lat: 35.707, lng: 139.733}, topic: "My Destinations"}, {called: "Park Hyatt Tokyo", loc: {lat: 35.6913457, lng: 139.69369000000006}, topic: "My Destinations"}, {called: "Omotesando Koffee", loc: {lat: 35.646137, lng: 139.715392}, topic: "My Destinations"}, {called: "Tokyo National Museum", loc: {lat: 35.7156148, lng: 139.77415380000002}, topic: "My Destinations"}, {called: "Sushi Dai", loc: {lat: 35.6674774 , lng: 139.77862719999996}, topic: "My Destinations"}, {called: "Yushukan", loc: {lat: 35.6917911, lng: 139.7505142}, topic: "My Destinations"}, {called: "Ichiran", loc: {lat: 35.6665006, lng: 139.6975192}, topic: "My Destinations"}, {called: "Tokyo Tower", loc: {lat: 35.6571637, lng: 139.74859790000005}, topic: "My Destinations"}];
console.log(tokyoTrip);
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
      visible: ko.observableArray([{
        restaurant: 'true',
        landmarks: 'true',
        hotels: 'true',
        tokyo: 'true',
        myDestinations: 'true'

      }])
    };
    // console.log(self.mapOne.center()[0].lat);

    self.locations = ko.observableArray();


   // Menu and map setup
    self.menu = ko.observableArray([
      {name: 'My Destinations', varName: 'myDestinations', url: '#'},
      {name: 'Restaurant', varName: 'restaurant', url: '#' },
      {name: 'Landmarks & Historical Buildings', varName: 'landmarks', url: '#'},
      {name: 'Hotels', varName: 'hotels', url: '#'},
      {name: 'Tokyo', varName: 'tokyo', url: '#'},
      {name: 'clear', varName: 'clear', url: '#'}
    ]);
    self.chosenMenuId = ko.observable();
    self.chosenMenuData = ko.observable();
    self.displayData = ko.observable(false);
    self.query = ko.observable('');

    // Actions on data
    self.goToMenu = function(menu) {
      if (menu.name === "My Destinations") {
        $.each (tokyoTrip, function(key, value) {
          self.mapOne.locations.push(value);
        });
      }else {
        self.getRequest(menu.name);
      }
      self.chosenMenuId(menu);
      self.mapOne.clearM(menu.name);
      self.clearMap(menu.varName);
    };

    self.clearMap = function( cTopic ) {
        self.mapOne.visible()[0].restaurant= 'false';
        self.mapOne.visible()[0].landmarks= 'false';
        self.mapOne.visible()[0].hotels= 'false';
        self.mapOne.visible()[0].tokyo= 'false';
        self.mapOne.visible()[0].myDestinations= 'false';
        self.mapOne.visible()[0][cTopic] = 'true';
        console.log('chane current topic ' + cTopic + ' to true');
        console.log(self.mapOne.visible());
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
            var yelpID = yresultData[i].id;
            console.log(yelpID);
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
        console.log(mapObj.visible()[0]);
        // for (p=0; p<Object.keys(mapObj.visible()[0]).length; p++) {
        //for (var pin in mapObj.visible()[0]) {
        $.each(mapObj.visible()[0], function(key, value) {
          if(value === 'true') {
            for (var v=0; v<pin.length; v++) {
              if (pin[v].topic() === mapObj.clearM() ) {
                console.log(pin[v].topic());
                pin[v].isVisible(true);
              }else{
                for (var p=0; p<pin.length; p++) {
                  if(pin[p].topic() !== mapObj.clearM){
                    pin[p].isVisible(false);
                    console.log(pin[p].isVisible());
                  }
                }
              }
            }
          }
        });


          }
        };
