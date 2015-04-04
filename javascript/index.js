/**
 * Created by liaokaien on 3/11/15.
 */


function search(query) {
    $.ajax({
        'url': 'http://www.liaokaien.com:8983/solr/search/select',
        'data': {
            'wt': 'json',
            'q': encodeURIComponent(query)
        },
        type: 'GET',
        'success': function(data) { /* process e.g. data.response.docs... */
            console.log(data);
        }
    });
}

function clear() {
    var idSet = [];
    $.ajax({
        'url': 'http://www.liaokaien.com:8983/solr/search/select?q=*%3A*&rows=1000&wt=json',
        'success': function(data) {
            var docs = JSON.parse(data).response.docs;



            for (var i = 0; i < docs.length; i++) {
                idSet.push(docs[i].id);
            }
            console.log('idSet:', idSet);
            $.ajax({
                url: 'http://www.liaokaien.com:8983/solr/search/update?commitWithin=5000',
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                processData: false,
                type: 'POST',
                'data': JSON.stringify({
                    delete: idSet
                }),
                'success': function(data) {
                    console.log('Success to clean the collection');
                }
            });

        }
    });;
    //clean docs in this idset

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

function index(id, title, creator, summary, time) {

    var data = new Document(id, title, creator, summary, time);
    //console.log('data:', data);
    $.ajax({
        url: 'http://www.liaokaien.com:8983/solr/search/update?wt=json',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(data),
        type: 'POST',
        success: function(data) { /* process e.g. data.response.docs... */
            console.log('success');
        }
    });
}

//