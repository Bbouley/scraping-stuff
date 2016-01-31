// add scripts

$(document).on('ready', function() {

    $('.getAll').on('click', function(e) {
        e.preventDefault();

        $.get('/meetinginfo', function(data) {
            // console.log(data);
            var newArray = data.splice(14)
            console.log(newArray);
            // var addressLocation = newArray.filter(function(el, ind) {
            //     return (ind % 3 === 0 ) || (ind % 4 === 0)
            // })
            var chunk_size = 7;
            var groups = newArray.map( function(e,i){
                return i%chunk_size===0 ? newArray.slice(i,i+chunk_size) : null;
            })
            .filter(function(e){
                return e;
            });
              console.log(groups)
        });

    });

});
