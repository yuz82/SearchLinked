/**
 * Created by liaokaien on 3/11/15.
 */
var compoment = {
    post: $('<article></article>').addClass('post'),
    group: $('<section></section>').addClass('group')
};

function init() {
    var query = '*:*';
    $.ajax({
        'url': 'http://www.liaokaien.com:8983/solr/search/select?q=' + encodeURIComponent(query) +
            '&wt=json',
        type: 'GET',
        'success': function(data) { /* process e.g. data.response.docs... */
            console.log(typeof data);
            var docs = JSON.parse(data).response.docs;
            for (var i = 0; i < docs.length; i++) {
                console.log(docs.id);
                $('.main').append(compoment.post);
            }
        }
    });
}

function search(q) {
    var query = q;
    $.ajax({
        'url': 'http://www.liaokaien.com:8983/solr/search/select?q=' + encodeURIComponent(query) +
            '&wt=json',
        type: 'GET',
        'success': function(data) { /* process e.g. data.response.docs... */
            // console.log(data);

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


function Document(id, title, creator, summary, time, group, user) {
    this.add = {};
    this.add.doc = {};
    this.add.doc.id = id;
    this.add.doc.title = title;
    this.add.doc.time = time;
    this.add.doc.summary = summary;
    this.add.doc.creator = creator;
    this.add.doc.user = user;
    this.add.doc.group = group;

    this.add.boost = 1.0;
    this.add.overwrite = true;
    this.add.commitWithin = 1000;
}

function index(id, title, creator, summary, time, group, user) {

    var data = new Document(id, title, creator, summary, time, group, user);
    //console.log('data:', data.add.doc.id);
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