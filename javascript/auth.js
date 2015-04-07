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

$(document).ready(function() {
    var authentication = getUrlParameter('code');
    var user = getUrlParameter('id');
    console.log(authentication);
    var url = 'https://www.linkedin.com/uas/oauth2/accessToken?grant_type=authorization_code &code=';
    url += authentication + '&redirect_uri=http://www.liaokaien.com:8983/solr/search/index.html?id=' + user;
    url += '&client_id=78uift3465j6c6&client_secret=0FDCfIXfPZzrlIxe})';
});