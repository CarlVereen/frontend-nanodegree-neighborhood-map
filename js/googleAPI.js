var tokyo = {title: "tokyo", loc: { lat: 35.707, lng: 139.733}, topic: "My Destinations"};
var tokyoTrip = [
  {title: "Tokyo", loc: { lat: 35.707, lng: 139.733}, topic: "My Destinations", rating: 5, image: "http://uppsalainternationalweek.com/wp-content/uploads/2015/04/tokyo.jpg", webPage: "www.metro.tokyo.jp/ENGLISH/", snippet:"Tokyo, Japan’s bustling capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers and anime shops to cherry trees and temples." },
  {title: "Park Hyatt Tokyo", loc: {lat: 35.6913457, lng: 139.69369000000006}, topic: "My Destinations", rating: 4.5, image: "http://tokyo.park.hyatt.com/content/dam/PropertyWebsites/park/tyoph/Media/All/Park-Hyatt-Tokyo-Park-View-Room.jpg", webPage: "http://tokyo.park.hyatt.com/en/hotel/home.html", snippet: "Uncover a wonderful experience during your stay at Park Hyatt Tokyo. Our spacious and comfortable rooms offer stunning views of Tokyo." },
  {title: "Omotesando Koffee", loc: {lat: 35.646137, lng: 139.715392}, topic: "My Destinations", rating: 4.5, image: "http://ooo-koffee.com/images/top/img_omotesando.jpg", webPage: "http://ooo-koffee.com/index.html", snippet: "Tucked into the backstreets of Omotesando, a posh, upscale neighborhood adjacent to the fashion epicenter of Harajuku, lies a tiny house." },
  {title: "Tokyo National Museum", loc: {lat: 35.7156148, lng: 139.77415380000002}, topic: "My Destinations", rating: 4.5, image: "http://static.travel.usnews.com/images/destinations/283/tokyo_national_museum_ta.jpg", webPage: "www.tnm.jp/?lang=en", snippet: "The Tokyo National Museum, or TNM, established in 1872, is the oldest Japanese national museum, and the largest art museum in Japan." },
  {title: "Sushi Dai", loc: {lat: 35.6674774 , lng: 139.77862719999996}, topic: "My Destinations", rating: 4.5, image: "http://s3-media2.fl.yelpcdn.com/bphoto/p-Kihl-cJ8NbOkOC6no76w/o.jpg", webPage: "http://www.tsukijigourmet.or.jp/22_sushidai/index.htm#02", snippet:"Fun fact: 2016 they will be moving the fish market across the Sumida River to a larger venue across the Sumida river." },
  {title: "Yushukan", loc: {lat: 35.6917911, lng: 139.7505142}, topic: "My Destinations", rating: 5, image: "http://www.japan-guide.com/g3/2321_02.jpg", webPage: "http://www.yasukuni.or.jp/english/index.html" , snippet: "The Yūshūkan (遊就館) is a Japanese military and war museum located within Yasukuni Shrine in Chiyoda, Tokyo."},
  {title: "Ichiran", loc: {lat: 35.6665006, lng: 139.6975192}, topic: "My Destinations", rating: 5, image: "https://mcoverland.files.wordpress.com/2013/10/ichiran.jpg", webPage: "http://www.ichiran.co.jp/index_hp.html", snippet: "You place your order at a vending machine, fill out a form (preferences), and then sit at an individual counter to slurp down your noodles." },
  {title: "Tokyo Tower", loc: {lat: 35.6571637, lng: 139.74859790000005}, topic: "My Destinations", rating: 4, image: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Tokyo_tower_world_trade.jpg", webPage: "www.tokyotower.co.jp/eng/", snippet: "Tokyo Tower is a communications and observation tower located in the Shiba-koen district of Minato, Tokyo, Japan. At 332.9 metres, it is the second-tallest structure in Japan." }
];

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
      }]),
    };

    $.each (tokyoTrip, function(key, value) {
      self.mapOne.locations.push(value);
      $('#list-results').append(
        '<button type="button" class="list-group-item"><span class="badge"> Rating ' + value.rating + '</span><img src="' + value.image +'" alt="Image of ' + value.title + '" height="100" width="100"><a href="'+ value.webPage + '"name="'+ value.title + '">' + value.title + '</a></button>');
        self.mapOne.clearM('My Destinations');
      });

    // self.locations = ko.observableArray();
    self.query = ko.observable('Tokyo');


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
          console.log(value.rating);
          $('#list-results').append(
            '<button type="button" class="list-group-item"><span class="badge"> Rating ' + value.rating + '</span><img src="' + value.image +'" alt="Image of ' + value.title + '" height="100" width="100"><a href="'+ value.webPage + '"name="'+ value.title + '">' + value.title + '</a></button>');
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
        // console.log('chane current topic ' + cTopic + ' to true');
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
            var yelpID = yresultData[i].id;
            var yelpSnip = yresultData[i].snippet_text;
            // console.log(yelpID);
            resultData.push({"Name" : yelpName, "loc" : {"lat" : yelpLocationLat, "lng" : yelpLocationLng}});
            $('#list-results').append(
              '<button type="button" class="list-group-item"><span class="badge"> Rating ' + yelpRating + '</span><img src="' + yelpImage +'" alt="Image of ' + yelpName + '"><a href="'+ yelpURL + '"name="'+ yelpName + '">' + yelpName + '</a></button>');
            self.mapOne.locations.push({title: yelpName, loc: {lat : yelpLocationLat, lng : yelpLocationLng}, topic: searchTopic, snippet: yelpSnip});

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

          var Pin = function(map, name, lat, lng, text, topic, snippet) {
            var marker;

            this.name = ko.observable(name);
            this.lat = ko.observable(lat);
            this.lng = ko.observable(lng);
            this.text = ko.observable(text);
            this.topic = ko.observable(topic);
            this.title = name;
            this.snip = snippet;

            marker = new google.maps.Marker({
              position: new google.maps.LatLng(lat, lng),
              animation: google.maps.Animation.DROP
            });

            google.maps.event.addListener(marker, 'mouseover', function() {
                 infowindow.open(map, marker);
                 setTimeout(function() { infowindow.close(); }, 5000);
               });

            google.maps.event.addListener(marker, 'click', function() {
                //  alert("I am a Marker " + name);
                 toggleBounce();
                 infowindow.open(map, marker);
               });
            var contentString = '<h5 class="bName">' + this.title + '</h5>' + '<div><strong>' + 'Snippet:' + '</strong></div>' + '<div>'  + this.snip + '</div>';

             var infowindow = new google.maps.InfoWindow({
               content: contentString,
               maxWidth: 200
             });

            this.isVisible = ko.observable(false);

            function toggleBounce() {
              if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
              } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
              }
            }


            this.isVisible.subscribe(function(currentState) {
              if (currentState) {
                marker.setMap(map);
              }else{
                marker.setMap(null);
              }

            });
            this.isVisible(true);
            // console.log(this.isVisible());
          };

          var pin = mapObj.locations();
          var pinCreated = [];


          for (var m=0; m<pin.length; m++) {
            if(pin[m].hasOwnProperty('isVisible'))  {

            }else {
            var mapA = mapObj.googleMap;
            var name = pin[m].title;

            var lat = pin[m].loc.lat;
            var lng = pin[m].loc.lng;
            var text = "pin_" + m;
            var topic = pin[m].topic;
            var snippet = pin[m].snippet;
            pinCreated.push(name);

            pin[m] = new Pin (mapA, name, lat, lng, text, topic, snippet);

          }
        }
        $.each(mapObj.visible()[0], function(key, value) {
          if(value === 'true') {
            for (var v=0; v<pin.length; v++) {
              if (pin[v].topic() === mapObj.clearM() ) {
                pin[v].isVisible(true);
              }else{
                for (var p=0; p<pin.length; p++) {
                  if(pin[p].topic() !== mapObj.clearM){
                    pin[p].isVisible(false);
                    // console.log(pin[p].isVisible());
                  }
                }
              }
            }
          }
        });


          }
        };
