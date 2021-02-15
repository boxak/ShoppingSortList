var inx = 0;

function addItem() {
    var url = document.getElementById("itemInput").value;

    var request = new XMLHttpRequest();
    request.onload = function () {
        if (request.status == 200) {
            var str = request.responseText;
            var obj = JSON.parse(str);
            makeItemHtml(obj);
            document.getElementById("itemInput").value = "";
            document.getElementById("alarming").textContent = "";
        } else {
            document.getElementById("alarming").textContent =
            "주소가 정확히 입력되지 않았습니다. 다시 확인해주세요";
            document.getElementById("alarming").style.color = "red";
            document.getElementById("itemInput").value = "";
        }
    }
    request.open("GET", "http://3.34.83.41:8000/parsing?url=" + url, true);
    request.send();
}

function makeItemHtml(item) {
    var mainDom = document.getElementById("itemBox");

    var appendedElem = appendElement(item);
    mainDom.innerHTML += appendedElem;

    addDragEvent();
    addDeleteEvent();
    setZIndex();
}

function appendElement(item) {
    var str = "";
    var itemId = "itemId" + inx;
    var deleteId = "deleteId" + inx;

    str += "<div class='itemClass' id='" + itemId + "' draggable='true' data-tooltip='"+ item.description +"' data-tooltip-location='bottom'>"
    str += "<div class='wrappers'>"
    str += "<div class='imgWrapper'>"
    str += "<img src='" + item.imgUrl + "'>";
    str += "</div><div class='infoWrapper'>"
    str += "<p class='info'>" + item.shopName + "</p>";
    str += "<p class='info'>최저가 : " + item.lowestPrice + "</p>";
    str += "<p class='info'>평점 : " + item.starRate + "</p>";
    str += "</div></div>"
    str += "<button class='deleteItem' id='"+ deleteId +"'>아이템 삭제</button>";
    str += "</div>"

    var text = 

    inx++;

    return str;
}

function addDragEvent() {
    const draggables = document.querySelectorAll(".itemClass");
    const container = document.querySelector("#itemBox");

    draggables.forEach(draggable => {
        draggable.addEventListener("dragstart", () => {
            draggable.classList.remove("itemClass");
            draggable.classList.add("dragging");
        });

        draggable.addEventListener("dragend", () => {
            draggable.classList.remove("dragging");
            draggable.classList.add("itemClass");
            setZIndex();
        });
    });

    container.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector(".dragging");
        if (afterElement == null && draggable != null) {
            container.appendChild(draggable);
        } else if (draggable!=null && afterElement != null) {
            container.insertBefore(draggable, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".itemClass:not(.dragging)")];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element
    }
}

function addDeleteEvent() {
    const deletables = document.querySelectorAll(".deleteItem");

    deletables.forEach(deletable => {
        deletable.addEventListener("click", () => {
            document.getElementById("itemBox").removeChild(deletable.parentElement);
        });
    });
}

// function deleteItem(deleteId) {
//     inx--;
//     var deleteDom = document.getElementById(deleteId);
//     document.getElementById("itemBox").removeChild(deleteDom.parentElement);
// }

window.onload = function() {
    document.getElementById("itemInput").addEventListener("change", addItem);
};

function setZIndex() {
    var doms = document.getElementsByClassName("itemClass");
    for (var i = 0;i<doms.length;i++) {
        var dom = doms[i];
        dom.style.zIndex = doms.length - i;
    }
}