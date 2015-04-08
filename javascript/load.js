$(document).ready(function() {
    var user = {};
    user.id = getUrlParameter('id');
    var url = 'https://www.linkedin.com/uas/oauth2/accessToken';
    var data = {};
    data.client_id = '78uift3465j6c6';
    data.client_secret = '0FDCfIXfPZzrlIxe';
    data.redirect_uri = 'http://localhost:8983/solr/search/index.html?id=' + user.id;
    data.grant_type = 'authorization_code';
    data.code = getUrlParameter('code');
    console.log(data);

    $.ajax({
        url: 'http://localhost:8983/solr/like',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data);
        },
        error: function (error){
            console.log(error);
        }
    });


    init(user.id); // load documents.

    var searchButton = $('nav').find('input[type=\'button\']');
    var searchBox = $('nav').find('input[type=\'search\']');
    var commentButton = $('.operation').find('input[type=\'button\']');

    searchButton.click(function() {
        console.log($(this).prev().attr('placeholder'));
        search(searchBox.val());
        location = '#';
    });

    searchBox.keydown(function(event) {
        if (event.keyCode == 13) {
            console.log($(this).attr('placeholder'));
            search(searchBox.val());
            location = '#';
        }

        if (event.keyCode == 8) {
            $('.post').show();
            //console.log('show!');
        }
    });
});


function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
    return null;
}