/**
 * Created by liaokaien on 3/11/15.
 */
function insertionSort(items) {
    var result = [];
    for (var q = 0; q < items.length; q++) {
        result.push(items[q]);
    }

    var len = result.length, // number of result in the array
        value, // the value currently being compared
        i, // index into unsorted section
        j; // index into sorted section

    for (i = 0; i < len; i++) {
        value = result[i];
        for (j = i - 1; j > -1 && result[j] < value; j--) {
            result[j + 1] = result[j];
        }

        result[j + 1] = value;
    }

    return result;
}

function Component() {
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
    this.option = $('<li></li>').addClass('option');
}

function init(user) {
    //clear();
    var before = [2034, 1155, 3098, 2182];
    console.log(insertionSort(before));

    var query = '*:*';
    $.ajax({
        'url': 'http://localhost:8983/solr/search/select?rows=200&fq=user%3D' + user + '&q=' + encodeURIComponent(query) + '&wt=json',
        type: 'GET',
        'success': function(data) { /* process e.g. data.response.docs... */
                var groupList = [];
                var docs = JSON.parse(data).response.docs;
                //console.log(docs.length);
                for (var i = 0; i < docs.length; i++) {
                    var element = new Component();
                    $('.main').append(element.post.attr('id', docs[i].id));
                    //console.log(docs[i].id);
                    var post = $('#' + docs[i].id);
                    post.append(element.group.text(docs[i].group));
                    // Add group name to groupList if it does not exist in the list.
                    if (groupList.indexOf(docs[i].group[0]) < 0) {
                        groupList.push(docs[i].group[0]);
                        //console.log(groupList);

                    }
                    post.append(element.title.text(docs[i].title));
                    post.append(element.summary.html('<span>Summary</span>' + docs[i].summary));
                    post.append(element.info);
                    post.append(element.operation);
                    var group = post.find('.group');
                    // console.log(docs[i]);
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
                    var isFollowing = (docs[i].isFollowing[0] === true ? 'Unfollow' : 'Follow');
                    var likes = docs[i].likes[0];
                    var isLiked = (docs[i].isLiked[0] === true ? 'Unlike' : 'Like');
                    var comments = docs[i].comments[0];

                    info.append(element.comments.html('<span>Comments</span>(' + comments + ')'));
                    info.append(element.likes.html('<span>' + isLiked + '</span>(' + likes + ')'));
                    info.append(element.follow.html('<span>' + isFollowing + '</span>'));
                    var operation = post.find('.operation');
                    operation.append(element.textbox.attr('placeholder', 'Add a comment'));
                    operation.append(element.button.attr('value', 'Submit'));


                }
                for (i = 0; i < groupList.length; i++) {
                    var op = new Component();
                    $('.options').append(op.option.text(groupList[i]));
                }

                //console.log($('.option').length);

                $('.select_title').click(function() {
                    //console.log('toggle');
                    $('.options').toggle();
                });

                $('.option').click(function() {
                    var groupname = $(this).text();
                    $('.options').hide();
                    //console.log(groupname);
                    $('#group_name').text(groupname);
                    if (groupname !== 'All groups') {
                        // $('.group').show();
                        $('.group').each(function() {
                            if ($(this).text() !== groupname) {
                                $(this).parent().hide();
                            } else {
                                // console.log($(this).text());
                                $(this).parent().show();
                            }
                        });
                    } else {
                        //console.log('all');
                        $('.post').show();
                    }
                });
                // sent httprequest.
                $('.likes').click(function() {
                    var isLiked = $(this).find('span').text();
                    var data = {
                        'is-liked': (isLiked == 'Like' ? true : false)
                    };

                    var id = $(this).parent().parent().attr('id');

                    //IN.API.Raw("/posts/" + id + '/relation-to-viewer/is-liked').method('PUT').body(JSON.stringify(data)).result(onSuccess);
                });

                $('.follow').click(function() {
                    //console.log($(this).find('span').text());
                });
            } // end loop



    });
}

function search(q) {
    var query = q;
    $.ajax({
        'url': 'http://localhost:8983/solr/search/select?q=' + encodeURIComponent(query) +
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
            //console.log('idSet:', idSet);
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
    });
    //clean docs in this idset

}


function Document(id, title, creator, summary, time, group, user, image, comments, likes, isFollowing, isLiked) {
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
    this.add.doc.comments = comments;
    this.add.doc.likes = likes;
    this.add.doc.isFollowing = isFollowing;
    this.add.doc.isLiked = isLiked;
    this.add.boost = 1.0;
    this.add.overwrite = true;
    this.add.commitWithin = 5000;
    this.optimize = {
        "waitSearcher": false
    };
}

function index(id, title, creator, summary, time, group, user, image, comments, likes, isFollowing, isLiked) {


    var data = new Document(id, title, creator, summary, time, group, user, image, comments, likes, isFollowing, isLiked);
    console.log(time);
    $.ajax({
        url: 'http://localhost:8983/solr/search/update?wt=json',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(data),
        type: 'POST',
        success: function(data) { /* process e.g. data.response.docs... */
            //  console.log('success');
        }
    });
}

//

function onSuccess(data) {
    console.log(data);
}
