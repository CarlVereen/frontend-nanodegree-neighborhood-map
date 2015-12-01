var fullAddress;


function AppViewModel() {
  var self = this;
  self.streetName = ko.observable("");
  self.cityName = ko.observable("");

  self.fullAddress = ko.computed(function() {
      var noSpaceStreetName = self.streetName();
      var noSpaceCityName = self.cityName();
      noSpaceCityName = noSpaceCityName.replace(/\s/g,'');
      noSpaceStreetName = noSpaceStreetName.replace(/\s/g,'');
      fullAddress = noSpaceStreetName + "," + noSpaceCityName;
      return fullAddress;
    }, self);

  self.createURL = function() {
    var apiKeyGoogleStreet = '&key=AIzaSyCdSLIE-TEvFixUYgFRaP4w6g0QtLA5xj4';
    var googleStreetCall = 'https://maps.googleapis.com/maps/api/streetview?';
    var size = 'size=600x300';
    var streetLocation ='&location=' + fullAddress;
    url = googleStreetCall + size + streetLocation + apiKeyGoogleStreet;
    return url;
  };


  }

  // Activates knockout.js
  ko.applyBindings(new AppViewModel());


function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var imageMap = '<img class="bgimg" src=' + url + '>';
    $body.append(imageMap);
}

$('#form-container').submit(loadData);
