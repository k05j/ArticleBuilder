const activateSidenav = () => {
    const offset = 350;
    let sidenavTargets = document.querySelectorAll(".sidenav-target");
    let sidenav = document.querySelector(".sidenav");
    createToolbar();
    let items = undefined;

    createItemListContainer();

    items = document.querySelectorAll(".sidenav-item");

    bindOnClick();

    window.onscroll = (e) => {
        findClosest(this.scrollY);
    }
    
    findClosest(window.pageYOffset + offset - 100);

    function setActive(key) {
        if(items) {
            for(let item of items) {
                item.classList.remove("sidenav-item-active");
            }
        }
        key.classList.add("sidenav-item-active");
    }
    
    function createItemListContainer () {
        const items = document.createElement("div");
        items.classList.add("sidenav-items");
    
        for(let key of sidenavTargets) {
            const text = key.getAttribute("data-text");
            if(sidenav && text)
            items.innerHTML += `<div class="sidenav-item" data-bind='[data-text="${text}"]'>${text}</div>`
        }
    
        if (sidenav != null)
            sidenav.append(items);
    }
    
    function findClosest(scrollY) {
        for(let key of items) {
            let item =  document.querySelector(key.getAttribute("data-bind"));
            if(!item) return;
            if(scrollY + offset > item.getBoundingClientRect().y + window.pageYOffset) {
                setActive(key);
            }
        }
    }
    
    function createToolbar () {
        if (sidenav != null) {
            sidenav.innerHTML += `
            <div class="sidenav-tools">
                <div class="sidenav-tool">
                    <button id="switchBtn" class="expendBtn"><i class="fas fa-angle-double-left"></i></button>
                </div>
            </div>
            `
            sidenav.querySelector("#switchBtn").onclick = () => {
                sidenav.classList.toggle("sidenav-open");
            }
        }
    }

    function bindOnClick() {
        for(let key of items) {
            let item =  document.querySelector(key.getAttribute("data-bind"));
            key.onclick = () => {
               if(item)
                item.scrollIntoView(true);
            }    
        }
    }
}

function toggleSidenav (state) {
    if(document.querySelector(".sidenav")) {
        document.querySelector(".sidenav").setAttribute("hidden", state);
    }
}

if(document.querySelectorAll(".sidenav-target").length > 0) {
    activateSidenav();
}