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
      {name: 'Restaurants', url: '#' },
      {name: 'Places of Interest', url: '#'},
      {name: 'Hotels', url: '#'},
      {name: 'Tokyo', url: '#'}
    ]);
    self.chosenMenuId = ko.observable();
    self.chosenMenuData = ko.observable();
    self.displayData = ko.observable(false);

    // Actions on data
    self.goToMenu = function(menu) {
      self.chosenMenuId(menu);
      self.displayData(true);
      console.log(menu);
    };

    //Restaurants data
    self.restaurantList = function() {


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



                //Mapping Markers
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
