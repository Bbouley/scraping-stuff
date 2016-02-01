// add scripts
$(document).on('ready', function() {

    // var onlyPlaces;

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

        $.get('/meetinginfo', function(data) {
            var newArray = data.splice(14)
            var chunk_size = 7;
            var groups = newArray.map( function(e,i){
                return i%chunk_size===0 ? newArray.slice(i,i+chunk_size) : null;
            })
            .filter(function(e){
                return e;
            });

            // console.log(groups);

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
            // var geocoder = new google.maps.Geocoder();

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
                    console.log(data.results);
                    var marker = new google.maps.Marker({
                        map : myMap,
                        position : data.results[0].geometry.location,
                        title : addressObject.name + ' ' + addressObject.time
                    });
                });
            };

            newMarker(object1);

            function addLocation(geocoder, map, addressObject) {
                var address = makeAddress(addressObject)
                geocoder.geocode({'address' : makeAddress(addressObject)}), function(results, status) {
                    if(status === google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                         var marker = new google.maps.Marker({
                            map : myMap,
                            position : results[0].geometry.location,
                            title : addressObject.name + ' ' + addressObject.time
                        });
                    } else {
                        console.log('Geocode Unsuccessful: ' + status);
                    }
                }
            }

            // addLocation(geocoder, myMap, object1)
        });

    });

function makeAddress (object) {
    return (object.street + ', ' + object.area + ', CO').toString();
}

});

