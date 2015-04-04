/**
 * Created by liaokaien on 3/11/15.
 */
function Components() {

    this.post = $('<article></article>').addClass('post');
    this.group = $('<section></section>').addClass('group');
    this.title = $('<section></section>').addClass('title');
    this.info = $('<section></section>').addClass('info');
    this.operation = $('<section></section>').addClass('operation');
    this.summary = $('<section></section>').addClass('summary');
    this.time = $('<span></span>').addClass('time');
    this.author = $('<span></span>').addClass('author');
    this.comments = $('<div></div>').addClass('comments');
    this.likes = $('<div></div>').addClass('likes');
    this.follow = $('<div></div>').addClass('follow');
    this.textbox = $('<input/>').attr('type', 'text');
    this.button = $('<input/>').attr('type', 'button');
    this.image = $('<img></img>').attr('alt', 'creator\'s avatar');
};

function init(user) {

    var query = '*:*';
    //console.log(user);
    $.ajax({
        'url': 'http://www.liaokaien.com:8983/solr/search/select?rows=200&fq=user%3D' + user + '&q=' + encodeURIComponent(query) + '&wt=json',
        type: 'GET',
        'success': function(data) { /* process e.g. data.response.docs... */

            var docs = JSON.parse(data).response.docs;
            //console.log(docs.length);
            for (var i = 0; i < docs.length; i++) {
                var element = new Components();
                $('.main').append(element.post.attr('id', docs[i].id));
                //console.log(docs[i].id);
                var post = $('#' + docs[i].id);
                post.append(element.group.text(docs[i].group));
                post.append(element.title.text(docs[i].title));
                post.append(element.summary.html('<span>Summary</span>' + docs[i].summary));
                post.append(element.info);
                post.append(element.operation);
                var group = post.find('.group');
                console.log(docs[i].image[0]);
                group.prepend(element.image.attr('src', docs[i].image[0]));
                var title = post.find('.title');
                title.append('<br>');
                title.append(element.time.text(time));
                title.append(element.author.text(' | by ' + docs[i].creator));
                var time = docs[i].time[0];
                //console.log(docs[i].time);
                time = time.replace('T', ' ');
                time = time.replace('Z', ' ');
                time = time.substring(0, 10);
                var info = post.find('.info');
                info.append(element.comments.html('<span>Comments</span>(' + '0)'));
                info.append(element.likes.html('<span>Likes</span>(' + '0)'));
                info.append(element.follow.html('<span>Follow</span>'));
                var operation = post.find('.operation');
                operation.append(element.textbox.attr('placeholder', 'Add a comment'));
                operation.append(element.button.attr('value', 'Submit'));


            }
        }
    });
}

function search(q) {
    var query = q;
    $.ajax({
        'url': 'http://www.liaokaien.com:8983/solr/search/select?q=' + encodeURIComponent(query) +
            '&wt=json&rows=200',
        type: 'GET',
        'success': function(data) { /* process e.g. data.response.docs... */

            var docs = JSON.parse(data).response.docs;
            var results = [];
            for (var i = 0; i < docs.length; i++) {
                results.push(docs[i].id);
            }
            //console.log(results);
            $(".post").each(function() {
                $(this).show();
                if (results.indexOf($(this).attr('id')) < 0) {
                    $(this).hide();
                }

            });

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


function Document(id, title, creator, summary, time, group, user, image) {
    this.add = {};
    this.add.doc = {};
    this.add.doc.id = id;
    this.add.doc.title = title;
    this.add.doc.time = time;
    this.add.doc.summary = summary;
    this.add.doc.creator = creator;
    this.add.doc.image = image;
    this.add.doc.user = user;
    this.add.doc.group = group;

    this.add.boost = 1.0;
    this.add.overwrite = true;
    this.add.commitWithin = 1000;
}

function index(id, title, creator, summary, time, group, user, image) {


    var data = new Document(id, title, creator, summary, time, group, user, image);
    //console.log('data:', data.add.doc.image);
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