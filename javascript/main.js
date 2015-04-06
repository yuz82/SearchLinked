/**
 * Created by liaokaien on 3/11/15.
 */
// Setup an event listener to make an API call once auth is complete

var args = {
    count: 0,
    all: 0,
    group: [],
    name: ''
};

function onLinkedInLoad() {
        //clear();
        console.log('onload');
        IN.Event.on(IN, "auth", getProfileData);

    }
    // Handle the successful return from the API call
function onSuccess(data) {
        var groups = [];
        args.name = data.id;
        console.log(args.name);

        for (var i = 0; i < data.groupMemberships._total; i++) {
            groups.push(data.groupMemberships.values[i].group);
            args.group.push(data.groupMemberships.values[i].group.name);
        }
        args.all = groups.length;
        console.log(args.group);
        console.log(groups);
        for (i = 0; i < groups.length; i++) {
            window.thisTime = i;
            var d = new Date();
            console.log(thisTime, d.getTime());
            getTopic(groups[i]);
        }
    }
    // Handle an error response from the API cal
function onError(error) {
    console.log(error);
}

// Use the API call wrapper to request the member's basic profile data
function getProfileData() {
    IN.API.Raw("/people/~:(id,group-memberships)").result(onSuccess).error(onError);
}

function getTopic(group) {
    var d = new Date();
    console.log("getTopic:", d.getTime(), group.name);
    var q = "/groups/" + group.id + "/posts:(id,summary,creator,title,creation-timestamp,likes,comments,relation-to-viewer)?count=50";
    //console.log(q);
    IN.API.Raw(q).result(insert).error(onError);
}

function insert(data) {
    var d = new Date();
    var posts = data.values;

    args.count++;

    for (var i = 0; i < posts.length; i++) {
        var creator = posts[i].creator.firstName + " ";
        creator += posts[i].creator.lastName;
        var title = posts[i].title;
        var summary = posts[i].summary;
        var timestamp = new Date(posts[i].creationTimestamp);
        if (posts[i].creator.pictureUrl) {
            var image = posts[i].creator.pictureUrl;
        } else {
            image = 'images/favicon.png';

        }


        var id = posts[i].id;
        var user = args.name;
        var comments = posts[i].comments._total;
        var likes = posts[i].likes._total;
        var isLiked = posts[i].relationToViewer.isLiked;
        var isFollowing = posts[i].relationToViewer.isFollowing;
        var group = args.group[args.count - 1];
        //console.log(args.all, args.count, group);
        index(id, title, creator, summary, timestamp, group, user, image, comments, likes, isFollowing, isLiked);
    }
    if (args.count == args.all) {
        location = 'http://www.liaokaien.com:8983/solr/search/index.html?id=' + args.name;
    }
}