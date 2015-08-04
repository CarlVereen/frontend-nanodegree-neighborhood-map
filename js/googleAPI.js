//This is the googleAPI interaction file
//starting location Tokyo, Japan 35.6833° N, 139.6833° E
//API key AIzaSyD61th9_qlpEsR7QjNn4UrpnswZgEReK3E

function initialize() {
	var mapOptions = {
		center: { lat: 35.6833, lng: 139.6833},
		zoom: 8
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);
