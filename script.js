/**
 * Created by liaokaien on 3/11/15.
 */
  
    // Setup an event listener to make an API call once auth is complete
function onLinkedInLoad() {
        IN.Event.on(IN, "auth", getProfileData);
    }
    // Handle the successful return from the API call
function onSuccess(data) {
    var groups = [];
    for(var i=0;i<data.groupMemberships._total;i++){
	groups.push(data.groupMemberships.values[i].group);
    }
    for (var i=0;i<groups.length;i++){
	getTopic(groups[i]);
    }
}
    // Handle an error response from the API call
    function onError(error) {
        console.log(error);
    }

    // Use the API call wrapper to request the member's basic profile data
    function getProfileData() {
        IN.API.Raw("/people/~:(group-memberships)").result(onSuccess).error(onError);
    }

function getTopic(group){
    this.groupName = group.name;      
	IN.API.Raw("/groups/"+group.id+"/posts:(id,summary,creator,title,creation-timestamp)?count=30")
	.result(success).error(onError);
     }

function success(data){
   console.log(groupName);
    var posts = data.values;
   for(var i=0;i<posts.length;i++){
       var creator = posts[i].creator.firstName+" ";
       creator += posts[i].creator.lastName;
       var title = posts[i].title;
       var summary = posts[i].summary;
       var date = new Date( posts[i].creationTimestamp) ;
       var sn = $('.post').length;
       $('body').append('<section class=\'post\'></section>');
       	$('.post').eq(sn).append('<h3>Group:&nbsp'+groupName+'</h3>');
	$('.post').eq(sn).append('<h4>title&nbsp</h4>');
	$('.post').eq(sn).append('<p>'+title+'</p>');
	$('.post').eq(sn).append('<h4>creator&nbsp</h4>');
	$('.post').eq(sn).append('<p>'+creator+'</p>');
	$('.post').eq(sn).append('<h4>summary&nbsp</h4>');
        $('.post').eq(sn).append('<p>'+summary+'</p>');
       	$('.post').eq(sn).append('<h4>date&nbsp</h4>');
        $('.post').eq(sn).append('<p>'+date+'</p>');
       
	//$('.post').eq(i).append('<p>groups:&nbsp'+groups[i].name+'</p>');
       
	}
    }
