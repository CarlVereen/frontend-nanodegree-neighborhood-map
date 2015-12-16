var tokyoTrip = [
  {title: "Tokyo", lat: 35.707, lng: 139.733, topic: "myDest", rating: 5, image: "http://s3-media4.fl.yelpcdn.com/bphoto/v7F_VyRGNMyEdn-bSEcuoA/ls.jpg", webPage: "www.metro.tokyo.jp/ENGLISH/", snippet:"Tokyo, Japan’s bustling capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers and anime shops to cherry trees and temples."},
  {title: "Park Hyatt Tokyo", lat: 35.6913457, lng: 139.69369000000006, topic: "myDest", rating: 4.5, image: "http://s3-media4.fl.yelpcdn.com/bphoto/WJsqb7QYxFK4zQ0K2YBAuQ/ms.jpg", webPage: "http://tokyo.park.hyatt.com/en/hotel/home.html", snippet: "Uncover a wonderful experience during your stay at Park Hyatt Tokyo. Our spacious and comfortable rooms offer stunning views of Tokyo." },
  {title: "Omotesando Koffee", lat: 35.646137, lng: 139.715392, topic: "myDest", rating: 4.5, image: "http://s3-media1.fl.yelpcdn.com/bphoto/UTYAPWV3v8YI_teBmIz8rA/ms.jpg", webPage: "http://ooo-koffee.com/index.html", snippet: "Tucked into the backstreets of Omotesando, a posh, upscale neighborhood adjacent to the fashion epicenter of Harajuku, lies a tiny house." },
  {title: "Tokyo National Museum", lat: 35.7156148, lng: 139.77415380000002, topic: "myDest", rating: 4.5, image: "http://s3-media4.fl.yelpcdn.com/bphoto/ijrAk8yLNlO129ou6aH0Jw/ms.jpg", webPage: "www.tnm.jp/?lang=en", snippet: "The Tokyo National Museum, or TNM, established in 1872, is the oldest Japanese national museum, and the largest art museum in Japan." },
  {title: "Sushi Dai", lat: 35.6674774 , lng: 139.77862719999996, topic: "myDest", rating: 4.5, image: "http://s3-media3.fl.yelpcdn.com/bphoto/p-Kihl-cJ8NbOkOC6no76w/ms.jpg", webPage: "http://www.tsukijigourmet.or.jp/22_sushidai/index.htm#02", snippet:"Fun fact: 2016 they will be moving the fish market across the Sumida River to a larger venue across the Sumida river." },
  {title: "Yushukan", lat: 35.6917911, lng: 139.7505142, topic: "myDest", rating: 5, image: "http://s3-media3.fl.yelpcdn.com/bphoto/irDaVGuaZPCk1Y-G0hIOPA/ms.jpg", webPage: "http://www.yasukuni.or.jp/english/index.html" , snippet: "The Yūshūkan (遊就館) is a Japanese military and war museum located within Yasukuni Shrine in Chiyoda, Tokyo."},
  {title: "Ichiran", lat: 35.6665006, lng: 139.6975192, topic: "myDest", rating: 5, image: "http://s3-media4.fl.yelpcdn.com/bphoto/jTcqGatAJT9c4fjbRGpPoQ/o.jpg", webPage: "http://www.ichiran.co.jp/index_hp.html", snippet: "You place your order at a vending machine, fill out a form (preferences), and then sit at an individual counter to slurp down your noodles." },
  {title: "Tokyo Tower", lat: 35.6571637, lng: 139.74859790000005, topic: "myDest", rating: 4, image: "http://s3-media1.fl.yelpcdn.com/bphoto/PqiUXpCMenrZMou0G6ktHQ/ms.jpg", webPage: "www.tokyotower.co.jp/eng/", snippet: "Tokyo Tower is a communications and observation tower located in the Shiba-koen district of Minato, Tokyo, Japan. At 332.9 metres, it is the second-tallest structure in Japan." }
];
var viewModel = new MyViewModel();
var $listElem = $('#list-results');
var map;

$(document).ready(function () {
  ko.applyBindings(viewModel);
});
// console.log(self.mapOne);
//
// function initMap() {
//  map = new google.maps.Map(document.getElementById('map'), {
//     center: self.mapOne.center(),
//     zoom: 11,
//     disableDefaultUI: false,
//     mapTypeId: google.maps.MapTypeId.TERRAIN
// });
// }
//
// initMap();

function MyViewModel() {
    var self = this;
    self.mapOne = {
      center: ko.observableArray([{
        lat:tokyoTrip[0].lat,
        lng:tokyoTrip[0].lng
      }]),
      locations: [{
        myDest: ko.observableArray([]),
        tRest: ko.observableArray([]),
        tLandmarks: ko.observableArray([]),
        tHotels: ko.observableArray([]),
        tTokyo: ko.observableArray([]),
      }],
      clearM: ko.observable(),
      sideMenu: ko.observableArray(),
      visible: ko.observableArray([{
        restaurant: 'true',
        landmarks: 'true',
        hotels: 'true',
        tokyo: 'true',
        myDestinations: 'true'
      }]),
      dataCol: [{
        myDest: ko.observableArray([]),
        tRest: ko.observableArray([]),
        tLandmarks: ko.observableArray([]),
        tHotels: ko.observableArray([]),
        tTokyo: ko.observableArray([]),
      }]
    };

    self.initMap = function() {
     map = new google.maps.Map(document.getElementById('map'), {
        center: self.mapOne.center()[0],
        zoom: 11,
        disableDefaultUI: false,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });
  };

  self.initMap();
    // self.mapOne.sideMenu = ko.observableArray([]);

    var Post = function(title, lat, lng, topic, rating, image, webPage, snippet) {

      this.postName = ko.observable(title);
      this.lat = ko.observable(lat);
      this.lng = ko.observable(lng);
      this.topic = ko.observable(topic);
      this.rating = ko.observable(rating);
      this.image = ko.observable(image);
      this.webPage = ko.observable(webPage);
      this.snip = ko.observable(snippet);
      this.showPost = ko.observable(true);


      // this.showlink = function() {
      //   self.showPost(true);
      // };
      // this.hidelink = function() {
      //   self.showPost(false);
      // };



    };

    var Pin = function(map, name, lat, lng, topic, snippet) {
      var marker;

      this.name = ko.observable(name);
      this.lat = ko.observable(lat);
      this.lng = ko.observable(lng);
      this.topic = topic;
      this.title = name;
      this.snip = ko.observable(snippet);

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
      var contentString = '<h5 class="bName">' + this.title + '</h5>' + '<div><strong>' + 'Snippet:' + '</strong></div>' + '<div>'  + this.snip() + '</div>';

       var infowindow = new google.maps.InfoWindow({
         content: contentString,
         maxWidth: 200
       });

      this.isVisible =ko.observable(false);

      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);

        }
      }


      this.isVisible.subscribe(function(currentState) {
        // console.log(currentState);
        if (currentState) {
          //  console.log('make visible');
          marker.setMap(map);
        }else{
          // console.log('make invisible');
          marker.setMap(null);
        }

      });
      this.isVisible(true);

    };


   // Menu and map setup
    self.menu = ko.observableArray([
      {name: 'My Destinations', varName: 'myDestinations', url: '#', dataCol: 'myDest'},
      {name: 'Restaurant', varName: 'restaurant', url: '#', dataCol: 'tRest' },
      {name: 'Landmarks & Historical Buildings', varName: 'landmarks', url: '#', dataCol: 'tLandmarks'},
      {name: 'Hotels', varName: 'hotels', url: '#', dataCol:  'tHotels'},
      {name: 'Tokyo', varName: 'tokyo', url: '#', dataCol: 'tTokyo'},
      {name: 'clear', varName: 'clear', url: '#'}
    ]);
    self.chosenMenuId = ko.observable();
    self.chosenMenuData = ko.observable();
    // self.displayResult = ko.observable(true);
    self.query = ko.observable('');



    self.addNewPost = function(array, menu) {
      var newPost = ko.utils.arrayMap(array, function(post) {
            return new Post(post.title, post.lat, post.lng, post.topic, post.rating, post.image, post.webPage, post.snippet);
      });
      self.mapOne.dataCol[0][menu].push.apply(self.mapOne.dataCol[0][menu], newPost);


    };

    self.addNewMarker = function(array, menu) {
      var mapA = map;
      var newPin = ko.utils.arrayMap(array, function(post) {
            return new Pin(mapA, post.title, post.lat, post.lng, post.topic, post.snippet);
      });
      self.mapOne.locations[0][menu].push.apply(self.mapOne.locations[0][menu], newPin);


    };


    self.clearMap = function( cTopic ) {
        self.mapOne.visible()[0].restaurant= 'false';
        self.mapOne.visible()[0].landmarks= 'false';
        self.mapOne.visible()[0].hotels= 'false';
        self.mapOne.visible()[0].tokyo= 'false';
        self.mapOne.visible()[0].myDestinations= 'false';
        self.mapOne.visible()[0][cTopic] = 'true';

      };

    // Actions on data
    self.goToMenu = function(menu) {
      console.log(menu.name);
      if (menu.name === "clear") {
        console.log(self.mapOne.locations()[0]);
        console.log(self.mapOne.locations()[0].isVisible());
        self.mapOne.locations()[0].isVisible(false);
        console.log(self.mapOne.locations()[0].isVisible());
        return;
      }
      if (menu.name === "My Destinations") {
        console.log(menu.dataCol);
        $('#list-results').empty();
        self.addNewPost(tokyoTrip, menu.dataCol);
        self.addNewMarker(tokyoTrip, menu.dataCol);

      }else {
        self.getRequest(menu.name, menu.dataCol);
      }
      self.chosenMenuId(menu);
      self.mapOne.clearM(menu.dataCol);
      self.clearMap(menu.varName);
    };

    self.goToMenu(self.menu()[0]);


    //Yelp data
    self.getRequest = function( searchTopic, dataCol ) {
      var yelpPost = [];
      $('#list-results').empty();
      var catSelect= searchTopic;
      var auth = {
				//
				// auth tokens.
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
          var searchTopicLower = searchTopic.toLowerCase();
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
            var yelpResult = {title: yelpName, lat: yelpLocationLat, lng: yelpLocationLng, topic: dataCol, rating: yelpRating, image: yelpImage, webPage: yelpURL, snippet: yelpSnip };
            yelpPost.push(yelpResult);
            // self.mapOne.locations(yelpResult);


          }

          self.addNewPost(yelpPost, dataCol);
          self.addNewMarker(yelpPost, dataCol);

          yelpPost = [];


				}
			});

    };

    self.searchPosts = ko.computed(function () {
      var search = self.query().toLowerCase();
      $.each(self.mapOne.dataCol[0], function(key, value) {
          return ko.utils.arrayFilter(value(), function(post, key) {
            console.log(post);
            var doesMatch = post.postName().toLowerCase().indexOf(search) >= 0;
              post.showPost(doesMatch);
              return doesMatch;

      });
    });
  });

    self.filteredPosts = ko.computed(function () {
      var filterPost = [];
      var currentTopic = self.mapOne.clearM();
      var search = self.query().toLowerCase();
        if (!search) {
          return self.mapOne.dataCol[0][currentTopic]();
        }else {
          return self.mapOne.dataCol[0][currentTopic]();
        }

        });

        self.searchPins = ko.computed(function() {
          var search = self.query().toLowerCase();

          $.each(self.mapOne.locations[0], function(key, value) {
              return ko.utils.arrayFilter(value(), function(pin, key) {
                var doesMatch = pin.name().toLowerCase().indexOf(search) >= 0;
                  pin.isVisible(doesMatch);
                  return doesMatch;
              });
          });
        });

        self.filteredPins = ko.computed(function () {
          var filterPin = [];
          var currentTopic = self.mapOne.clearM();
          $.each(self.mapOne.locations[0], function(key, value) {
            var filter = ko.utils.arrayFilter(value(), function(pin, key) {
              var topicMatch = pin.topic === currentTopic;
                pin.isVisible(topicMatch);
                return topicMatch;
            });
          });


            });

}
