var documents = {};
var user = {};
user.id = $(location).attr('search').substr(4);
//console.log(user.id);
init(user.id);

var searchButton = $('nav').find('input[type=\'button\']');
var searchBox = $('nav').find('input[type=\'search\']');

var commentButton = $('.operation').find('input[type=\'button\']');

searchButton.click(function() {
    console.log($(this).prev().attr('placeholder'));
    search(searchBox.val());
});

searchBox.keydown(function(event) {
    if (event.keyCode == 13) {
        console.log($(this).attr('placeholder'));
        search(searchBox.val());
    }
});