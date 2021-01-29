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
        }
    }
    request.open("GET", "http://localhost:8080/parsing?url=" + url, true);
    request.send();
}

function makeItemHtml(item) {
    var mainDom = document.getElementById("itemBox");

    var appendedElem = appendElement(item);
    mainDom.innerHTML += appendedElem;

    addDragEvent();
}

function appendElement(item) {
    var str = "";
    var itemId = "itemId" + inx;
    var deleteId = "deleteId" + inx;

    str += "<div class='itemClass' id='" + itemId + "' draggable='true'>"
    str += "<img src='" + item.imgUrl + "'>";
    str += "<p>" + item.shopName + "</p>";
    str += "<p>" + item.lowestPrice + "</p>";
    str += "<p>" + item.starRate + "</p>";
    str += "<p class='arrow_box'>" + item.description + "</p>";
    str += "<button class='deleteItem' id='"+ deleteId +"' onclick='deleteItem(this.id)'>아이템 삭제</button>";
    str += "</div>"

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
        });
    });

    container.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector(".dragging");
        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
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

function deleteItem(deleteId) {
    inx--;
    var deleteDom = document.getElementById(deleteId);
    document.getElementById("itemBox").removeChild(deleteDom.parentElement);
}
