function print() {
    var url = document.getElementById("input").value;

    var request = new XMLHttpRequest();
    request.onload = function() {
        if (request.status == 200) {
            var str = request.responseText;
            var obj = JSON.parse(str);
            console.log(obj);
        }
    }
    request.open("GET","http://localhost:8080/parsing?url="+url,true);
    request.send();
}