/**
 * Created by liaokaien on 3/11/15.
 */
function search(query) {
    $.ajax({
        'url': 'http://www.liaokaien.com:8983/solr/search/select',
        'data': {
            'wt': 'json',
            'q': query
        },
        'success': function(data) { /* process e.g. data.response.docs... */
            console.log(data);
        }
    });
}

var sent = '{\'add\': {\'doc\': {\'' +
    'id\': \'15032\',' +
    '\'title\': \'Movie\',\'Content\':\'Sun also rises\'},\'boost\': 1.0,\'overwrite\': true,\'commitWithin\': 1000}}';

function index() {
    $.ajax({
        url: 'http://www.liaokaien.com:8983/solr/search/update?wt=json',
        contentType: 'application/json,
        processData: false,
        data: sent,
        type: POST,
        success: function(data) { /* process e.g. data.response.docs... */
            console.log(data);
        }
    });
}

//

$(document).ready(function() {
    console.log(sent);
    index();
    window.setTimeout('search(\'Sun\')', 2000);
    search('change');
});
