var url = "https://jsonplaceholder.typicode.com/posts";
async function getdata() {
    try {
        var request = await fetch(url);
        if (request.ok) {
            var data = await request.json();
            showdata(data);

        }
        else {
            console.log("error")
        }
    } catch (error) {
    }

}
getdata()
function showdata(data) {
    var main = document.querySelector(".box2");
    data.forEach((post) => {
        var title = post.title
        var a = document.createElement("a");
        var div = document.createElement("div");
        a.setAttribute("class", "box-a");
        div.setAttribute("class", "box-div");
        a.setAttribute("href", "showtext.html?id=" + post.id);
        a.setAttribute("target", "blank");
        a.innerHTML = title;
        div.appendChild(a);
        main.appendChild(div);
        a.addEventListener("click", function (a) {
            a.preventDefault()
            encodeId(post.id)
        }
        )
    });
}
function encodeId(id) {
    var Id = id
    var encodedId = encodeURIComponent(Id);
    var newTab = window.open("showtext.html?content=" + encodedId, "_blank");
    newTab.focus();
}
