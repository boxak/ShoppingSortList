var inx = 0;

function addItem() {
    var url = document.getElementById("itemInput").value;

    var request = new XMLHttpRequest();
    request.onload = function() {
        if (request.status == 200) {
            var str = request.responseText;
            var obj = JSON.parse(str);
            makeItemHtml(obj);
        }
    }
    request.open("GET","http://localhost:8080/parsing?url="+url,true);
    request.send();
}

function makeItemHtml(item) {
    var mainDom = document.getElementById("main-page");
    var innerElem = mainDom.innerHTML;
    mainDom.innerHTML = "";

    var appendedElem = appendElement(item);
    mainDom.innerHTML+=appendedElem;
    mainDom.innerHTML+=innerElem;
}

function appendElement(item) {
    var str = "";
    var itemId = "itemId" + inx;

    str+="<div class='itemClass' id='"+ itemId +"' draggable='true'>"
    str+="<img src='" + item.imgUrl + "'>";
    str+="<p>"+ item.shopName +"</p>";
    str+="<p>"+ item.lowestPrice + "</p>";
    str+="<p>"+ item.starRate + "</p>";
    str+="</div>"
    str+="<br>"
    
    inx++;

    return str;
}

const draggables = document.querySelectorAll(".itemClass");
const container = document.querySelectorAll("#main-page");

draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", () => {
        draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
    });
});

container.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector(".dragging");
})
