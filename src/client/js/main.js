// add scripts

$(document).on('ready', function() {

    $('.getAll').on('click', function(e) {
        e.preventDefault();

        $.get('/meetinginfo', function(data) {
            console.log(data);
        });

    });

});
