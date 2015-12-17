// Set global trip variable and viewModel for knockout

var tokyoTrip = [
  {title: "Tokyo", lat: 35.707, lng: 139.733, topic: "myDest", rating: 5, image: "http://s3-media4.fl.yelpcdn.com/bphoto/v7F_VyRGNMyEdn-bSEcuoA/ls.jpg", webPage: "https://en.wikipedia.org/wiki/Tokyo", snippet:"Tokyo, Japan’s bustling capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers and anime shops to cherry trees and temples.", yid: "1",},
  {title: "Park Hyatt Tokyo", lat: 35.6913457, lng: 139.69369000000006, topic: "myDest", rating: 4.5, image: "http://s3-media4.fl.yelpcdn.com/bphoto/WJsqb7QYxFK4zQ0K2YBAuQ/ms.jpg", webPage: "http://tokyo.park.hyatt.com/en/hotel/home.html", snippet: "Uncover a wonderful experience during your stay at Park Hyatt Tokyo. Our spacious and comfortable rooms offer stunning views of Tokyo.", yid: "2",},
  {title: "Omotesando Koffee", lat: 35.646137, lng: 139.715392, topic: "myDest", rating: 4.5, image: "http://s3-media1.fl.yelpcdn.com/bphoto/UTYAPWV3v8YI_teBmIz8rA/ms.jpg", webPage: "http://ooo-koffee.com/index.html", snippet: "Tucked into the backstreets of Omotesando, a posh, upscale neighborhood adjacent to the fashion epicenter of Harajuku, lies a tiny house." , yid: "3",},
  {title: "Tokyo National Museum", lat: 35.7156148, lng: 139.77415380000002, topic: "myDest", rating: 4.5, image: "http://s3-media4.fl.yelpcdn.com/bphoto/ijrAk8yLNlO129ou6aH0Jw/ms.jpg", webPage: "www.tnm.jp/?lang=en", snippet: "The Tokyo National Museum, or TNM, established in 1872, is the oldest Japanese national museum, and the largest art museum in Japan." , yid: "4",},
  {title: "Sushi Dai", lat: 35.6674774 , lng: 139.77862719999996, topic: "myDest", rating: 4.5, image: "http://s3-media3.fl.yelpcdn.com/bphoto/p-Kihl-cJ8NbOkOC6no76w/ms.jpg", webPage: "http://www.tsukijigourmet.or.jp/22_sushidai/index.htm#02", snippet:"Fun fact: 2016 they will be moving the fish market across the Sumida River to a larger venue across the Sumida river.", yid: "5",},
  {title: "Yushukan", lat: 35.6917911, lng: 139.7505142, topic: "myDest", rating: 5, image: "http://s3-media3.fl.yelpcdn.com/bphoto/irDaVGuaZPCk1Y-G0hIOPA/ms.jpg", webPage: "http://www.yasukuni.or.jp/english/index.html" , snippet: "The Yūshūkan (遊就館) is a Japanese military and war museum located within Yasukuni Shrine in Chiyoda, Tokyo.", yid: "6",},
  {title: "Ichiran", lat: 35.6665006, lng: 139.6975192, topic: "myDest", rating: 5, image: "http://s3-media4.fl.yelpcdn.com/bphoto/jTcqGatAJT9c4fjbRGpPoQ/o.jpg", webPage: "http://www.ichiran.co.jp/index_hp.html", snippet: "You place your order at a vending machine, fill out a form (preferences), and then sit at an individual counter to slurp down your noodles.", yid: "7",},
  {title: "Tokyo Tower", lat: 35.6571637, lng: 139.74859790000005, topic: "myDest", rating: 4, image: "http://s3-media1.fl.yelpcdn.com/bphoto/PqiUXpCMenrZMou0G6ktHQ/ms.jpg", webPage: "www.tokyotower.co.jp/eng/", snippet: "Tokyo Tower is a communications and observation tower located in the Shiba-koen district of Minato, Tokyo, Japan. At 332.9 metres, it is the second-tallest structure in Japan.", yid: "8",}
];
var viewModel, InfoWindow,
    map;

// Google API callback function to create MyViewModel and apply Knockout bindings
function initMap() {
  viewModel = new MyViewModel();
  ko.applyBindings(viewModel);
  infowindow = new google.maps.InfoWindow({
  content: "",
  maxWidth: 300
});
}


//create the model for knockout
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

//Create google map and init
    self.initMap = function() {
     map = new google.maps.Map(document.getElementById('map'), {
        center: self.mapOne.center()[0],
        zoom: 11,
        disableDefaultUI: false,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });
  };

//call google map
  self.initMap();

//create model for map listings
    var Post = function(title, lat, lng, topic, rating, image, webPage, snippet, yid) {

      this.postName = ko.observable(title);
      this.lat = ko.observable(lat);
      this.lng = ko.observable(lng);
      this.topic = ko.observable(topic);
      this.rating = ko.observable(rating);
      this.image = ko.observable(image);
      this.webPage = ko.observable(webPage);
      this.snip = ko.observable(snippet);
      this.showPost = ko.observable(true);
      this.postId = ko.observable(yid);
      this.bounce = function() {
        var post = this.postId();
        $.each(self.mapOne.locations[0], function(key, value) {
            return ko.utils.arrayFilter(value(), function(pin, key) {
              if(pin.pinId() === post) {
                pin.markerBounce();
              }
            });
        });

      };
      this.showListInfo = function() {
        var post = this.postId();
        $.each(self.mapOne.locations[0], function(key, value) {
            return ko.utils.arrayFilter(value(), function(pin, key) {
              if(pin.pinId() === post) {
                pin.listInfoWindow();
              }
            });
        });
      };
      this.hideListInfo = function() {
        var post = this.postId();
        $.each(self.mapOne.locations[0], function(key, value) {
            return ko.utils.arrayFilter(value(), function(pin, key) {
              if(pin.pinId() === post) {
                pin.closeListInfoWindow();
              }
            });
        });
      };

    };

//Create model for markers on the google map
    var Pin = function(map, name, lat, lng, topic, snippet, yid) {
      var marker;
      var self = this;

      this.name = ko.observable(name);
      this.lat = ko.observable(lat);
      this.lng = ko.observable(lng);
      this.topic = topic;
      this.title = name;
      this.snip = ko.observable(snippet);
      this.pinId = ko.observable(yid);
      this.contentString = '<h5 class="bName">' + this.title + '</h5>' + '<div><strong>' + 'Snippet:' + '</strong></div>' + '<div>'  + this.snip() + '</div>';
      this.listInfoWindow = function() {
        infowindow.setContent(self.contentString); // set content
        infowindow.open(map, marker); // open infowindow
      };
      this.closeListInfoWindow = function() {
        infowindow.setContent(self.contentString); // set content
        infowindow.close(); // open infowindow
      };


      this.markerBounce = function() {
        toggleBounce();
      };


      //set marker options and animations
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        animation: google.maps.Animation.DROP
      });

      //create toggle function for bouncing markers
      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          window.setTimeout(function() {
            marker.setAnimation(null);
          }, 2100);
        }
      }

      //set events for info window and click events
      google.maps.event.addListener(marker, 'mouseover', function() {
        infowindow.setContent(self.contentString); // set infowindow content
        infowindow.open(map, marker); // open infowindow
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(self.contentString); // set infowindow content
        infowindow.open(map, marker); // open infowindow
        toggleBounce(); // bounce map marker
      });

      //set options for filtering map markers
      this.isVisible =ko.observable(false);

      this.isVisible.subscribe(function(currentState) {
        if (currentState) {
          marker.setMap(map);
        }else{
          marker.setMap(null);
        }

      });
      this.isVisible(true);
    };

   // Navigation menu and web page function setup
    self.menu = ko.observableArray([
      {name: 'My Destinations', varName: 'myDestinations', url: '#', dataCol: 'myDest'},
      {name: 'Top 10 Restaurant', varName: 'restaurant', url: '#', dataCol: 'tRest' },
      {name: 'Top 10 Landmarks & Historical Buildings', varName: 'landmarks', url: '#', dataCol: 'tLandmarks'},
      {name: 'Top 10 Hotels', varName: 'hotels', url: '#', dataCol:  'tHotels'},
      {name: 'Tokyo Overall Top 10', varName: 'tokyo', url: '#', dataCol: 'tTokyo'},

    ]);
    self.chosenMenuId = ko.observable();
    self.chosenMenuData = ko.observable();
    self.query = ko.observable('');

    //function for creating new posts from yelp search or preloaded trip
    self.addNewPost = function(array, menu) {
      if(self.mapOne.dataCol[0][menu]().length > 0) {
        return;
      }else{
        var newPost = ko.utils.arrayMap(array, function(post) {
            return new Post(post.title, post.lat, post.lng, post.topic, post.rating, post.image, post.webPage, post.snippet, post.yid);
        });
        self.mapOne.dataCol[0][menu].push.apply(self.mapOne.dataCol[0][menu], newPost);
      }
    };

    //function for creating new map markers from yelp search or preloaded trip
    self.addNewMarker = function(array, menu) {
      var mapA = map;
      var newPin = ko.utils.arrayMap(array, function(post) {
            return new Pin(mapA, post.title, post.lat, post.lng, post.topic, post.snippet, post.yid);
      });
      self.mapOne.locations[0][menu].push.apply(self.mapOne.locations[0][menu], newPin);
    };

    // Menu actions and data request calls
    self.goToMenu = function(menu) {
      if (menu.name === "My Destinations") {
        self.addNewPost(tokyoTrip, menu.dataCol);
        self.addNewMarker(tokyoTrip, menu.dataCol);

      }else {
        self.getRequest(menu.name, menu.dataCol);
      }
      self.chosenMenuId(menu);
      self.mapOne.clearM(menu.dataCol);
    };

    //Initial Map setup for tokyo trip
    self.goToMenu(self.menu()[0]);


    //Yelp data request
    self.getRequest = function( searchTopic, dataCol ) {
      var yelpPost = [];
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

      // yelp ajax request
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
            var yelpID = searchTopic + i;
            console.log(yelpID);
            var yelpSnip = yresultData[i].snippet_text;
            var yelpResult = {title: yelpName, lat: yelpLocationLat, lng: yelpLocationLng, topic: dataCol, rating: yelpRating, image: yelpImage, webPage: yelpURL, snippet: yelpSnip, yid: yelpID, };
            //create array in for loop and push when for loop complete
            yelpPost.push(yelpResult);

          }
          //push to observables outside of for loop to reduce observable updates
          self.addNewPost(yelpPost, dataCol);
          self.addNewMarker(yelpPost, dataCol);

          //clear yelp post array for next search
          yelpPost = [];


				},
        // Handle ajax errors
        error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.n Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error.n' + jqXHR.responseText);
            }
        }
			});

    };

    //function for filtering posts based on search submission
    self.searchPosts = ko.computed(function () {
      var search = self.query().toLowerCase();
      $.each(self.mapOne.dataCol[0], function(key, value) {
          return ko.utils.arrayFilter(value(), function(post, key) {
            var doesMatch = post.postName().toLowerCase().indexOf(search) >= 0;
              post.showPost(doesMatch);
              return doesMatch;

      });
    });
  });

  //function for filtering seperate menu selection posts
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

        //Search function for Map markers based on search submission
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

        //Marker pin filter based on menu selection
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
