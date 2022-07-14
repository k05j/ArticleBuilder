let elements = document.body.getElementsByClassName("onClick-minimize");

for(let elem of elements) {
    let objList = document.querySelectorAll(elem.getAttribute("data-minimize-target"));
    let div = elem.querySelector(".article-minimize");

    for(let obj of objList) {
        if(div)
        changeDiv(obj, div, elem.getAttribute("data-minimize-toggle"));
    }

    elem.onclick = () => {
        for(let obj of objList) { 
            obj.classList.toggle(elem.getAttribute("data-minimize-toggle"));
            if(div)
            changeDiv(obj, div, elem.getAttribute("data-minimize-toggle"));
        }
    }
}


function changeDiv (obj, div, classname) {
    if(obj.classList.contains(classname)) {
        div.innerHTML = '<i class="fas fa-sort-down"></i>';
    }else {
        div.innerHTML = '<i class="fas fa-sort-up"></i>';
    }
}