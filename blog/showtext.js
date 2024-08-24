document.addEventListener("DOMContentLoaded", function () {
    var search = window.location.search;
    var newurl = new URLSearchParams(search);
    var content = newurl.get("content");
    var id = decodeURIComponent(content);
    if (id <= 100) {
        fetchdata(id);
    }
    else {
        document.write("sorry: undefined id number")
    }
})
async function fetchdata(id) {

    var url = "https://jsonplaceholder.typicode.com/posts";
    var targeturl = url + "/" + id;
    var request = await fetch(targeturl);
    if (request.ok) {
        var data = await request.json();
        var bodydisplayer = document.querySelector("#content");
        var titledisplayer = document.querySelector("#div-h2");
        var title = data.title;
        var body = data.body;
        bodydisplayer.innerHTML = body;
        titledisplayer.innerHTML = title;
    }
}