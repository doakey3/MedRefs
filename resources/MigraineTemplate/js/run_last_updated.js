(function() {
last_updateds = document.getElementsByClassName("last_updated");
for (var i = 0; i < last_updateds.length; i++) {
    var mydate = new Date(document.lastModified);
    var newdate = new Intl.DateTimeFormat("en-US", {year: "numeric", month: "long", day: "numeric"}).format(mydate).replace(/\./g, '-');
    last_updateds[i].innerHTML = newdate;
} 
}());
