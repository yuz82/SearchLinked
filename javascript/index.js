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

function clean() {
    var idSet = [];
    $.ajax({
        'url': 'http://www.liaokaien.com:8983/solr/search/select',
        'data': {
            'wt': 'json',
            'q': '*%3A*'
        },
        'success': function(data) {
            var docs = data.response.docs;
            for (var i = 0; i < docs.length; i++) {
                idSet.push(docs[i].id);
            }
        }
    });
    //clean docs in this idset
    $.ajax({
        url: 'http://www.liaokaien.com:8983/solr/search/update?wt=json',
        contentType: 'application/json',
        processData: false,
        type: 'POST',
        'data': {
            'delete': idSet
        },
        'success': function(data) {
            console.log('Success to clean the collection');
        }
    });
}


function Document(id, title, creator, summary, time) {
    this.add = {};
    this.add.doc = {};
    this.add.doc.id = id;
    this.add.doc.title = title;
    this.add.doc.time = time;
    this.add.doc.summary = summary;
    this.add.doc.creator = creator;
    this.add.boost = 1.0;
    this.add.overwrite = true;
    this.add.commitWithin = 1000;
}

function index() {
    var data = new Document();
    $.ajax({
        url: 'http://www.liaokaien.com:8983/solr/search/update?wt=json',
        contentType: 'application/json',
        processData: false,
        data: JSON.Stringify(data),
        type: 'POST',
        success: function(data) { /* process e.g. data.response.docs... */
            console.log(data);
        }
    });
}

//
