/**
 * Created by liaokaien on 3/11/15.
 */
// Setup an event listener to make an API call once auth is complete

var args = {
    count: 0,
    all: 0
};

function onLinkedInLoad() {
        console.log('onload');
        //clear();
        IN.Event.on(IN, "auth", getProfileData);

    }
    // Handle the successful return from the API call
function onSuccess(data) {
        var groups = [];
        window.groups = groups;
        for (var i = 0; i < data.groupMemberships._total; i++) {
            groups.push(data.groupMemberships.values[i].group);
        }
        args.all = groups.length;
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
    IN.API.Raw("/people/~:(group-memberships)").result(onSuccess).error(onError);
}

function getTopic(group) {
    var d = new Date();
    console.log("getTopic:", d.getTime(), group.name);
    this.groupName = group.name;
    var q = "/groups/" + group.id + "/posts:(id,summary,creator,title,creation-timestamp)?count=30";
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
        var id = posts[i].id;
        index(id, title, creator, summary, timestamp);
    }
    if (args.count == args.all) {
        location = 'http://www.liaokaien.com:8983/solr/search/index.html';
    }
}