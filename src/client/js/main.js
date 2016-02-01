// add scripts

var markers = [];
var mc;
var infowindow = new google.maps.InfoWindow();

$(document).on('ready', function() {

    var myMap;

    function initMap() {
      myMap = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.7392, lng: -104.9903},
        zoom: 10
      });
    }

    initMap();

    $('.getAll').on('click', function(e) {
        e.preventDefault();

        var mcOptions = {maxZoom: 12};
        mc = new MarkerClusterer(myMap, [], mcOptions);

        $.get('/meetinginfo', function(data) {
            var newArray = data.splice(14)
            var chunk_size = 7;
            var groups = newArray.map( function(e,i){
                return i%chunk_size===0 ? newArray.slice(i,i+chunk_size) : null;
            })
            .filter(function(e){
                return e;
            });

            var timeAddressObjects = groups.map(function(el, index) {
                return {
                    name : el[2],
                    day : el[0],
                    time : el[1],
                    street : el[3].split(' ').slice(0,3).join(' '),
                    area : el[4]
                };
            });

            timeAddressObjects.splice(1134, 7);
            var object1 = timeAddressObjects[0]

            var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=' + key + '';

            function createURL (addressObject) {
                var baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='
                var streetNum = addressObject.street.split(' ')[0];
                var streetName1 = addressObject.street.split(' ')[1];
                var streetName2 = addressObject.street.split(' ')[2];
                var area = addressObject.area;
                var endURL = ',+CO&key=' + key;
                return baseURL + streetNum + '+' + streetName1 + '+' + streetName2 + ',+' + area + endURL
            }


            function newMarker(addressObject) {
                $.ajax({
                    url : createURL(addressObject),
                    type : 'GET'
                }).done(function(data) {
                    var content
                    var marker = new google.maps.Marker({
                        map : myMap,
                        position : data.results[0].geometry.location,
                    });
                    marker.info = new google.maps.InfoWindow({
                        content: '<h4>' + addressObject.name + ' ' + addressObject.time + '</h4>\n' + '<h4>' + addressObject.day + '</h4>' + '<p>' + addressObject.street + ' ,' + addressObject.area + '</p>'
                    });
                    checkMarkers(marker, marker.position, marker.info.content)
                });
            };

            function placeObjects (array) {
                for (var i = 0; i < array.length ; i++) {
                    newMarker(array[i])
                };
                console.log(array.length)
            }

            placeObjects(timeAddressObjects);

            setTimeout (function() {
                var mc = new MarkerClusterer(myMap, markers);
            }, 3000)
        });

    });

});

// *** Helper FUnctions *** //


function makeAddress (object) {
    return (object.street + ', ' + object.area + ', CO').toString();
}


function checkMarkers (marker, latlng, text) {
    var allMarkers = mc.getMarkers();

  //check to see if any of the existing markers match the latlng of the new marker
    if (allMarkers.length != 0) {
      for (i=0; i < allMarkers.length; i++) {
          var existingMarker = allMarkers[i];
          var pos = existingMarker.getPosition();

      if (latlng.equals(pos)) {
          text = text + "\n\n\n" + allMarkers[i].info.content;
      }
    }
  }

  google.maps.event.addListener(marker, 'click', function() {
      infowindow.close();
      infowindow.setContent(text);
      infowindow.open(map, marker);
  });
      mc.addMarker(marker);
  return marker;
}



