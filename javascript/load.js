var documents = {};
var user = {};
user.id = $(location).attr('search').substr(4);
console.log(user.id);
init();