import Settings from "../../Article/Settings/Settings.js";
import hostname from "../../Article/Module/host.js";
import ArticleAPI from "../../../../utils/ArticleAPI.js";

export default class Sidenav {
    constructor ({data, holder, tools}, {onItemStartDrag, onItemEndEvent, onArticleClick} = {}) {
        this.holder = holder;
        this.items = [];
        this.tools = tools;
        this.data = data || {}
        this.css = {
            wrapper: "sidenav",
            toolbox: "sidenav-toolbar",
            toolHeader: "sidenav-toolheader",
            toolHeaderHeader: "toolheader-header",
            toolHeaderExtendBtn: "toolheader-extendBtn",
            toolHeaderSettingsBtn: "toolheader-settingsBtn",
            extendBar: "sidenav-extendbar",
            extendBarContainer: "extendbar-container",
            extendBarCloseBtn: "extendbar-closeBtn",
            extendBarOpen: "sidenav-extendbar--open",
            sidenavOpen: "sidenav--open",
            extendBarShowArticle: "extendbar-showArticle"
        }

        this.wrapper = this.createSidenav();
        this.extendWrapper = this.createExtendBar();
        this.currentState = 'Sidenav';

        this.holder.appendChild(this.extendWrapper);

        this.sidenavHeader = this.wrapper.querySelector("." + this.css.toolHeader);

        this.onItemStartDrag = onItemStartDrag;
        this.onItemEndEvent = onItemEndEvent;
        this.onArticleClick = onArticleClick || function () {};
        
        this.initializeItems();
        this.createHeader();
        this.createItems();
    }
    createSidenav () {
        let elem = document.createElement("nav");
        elem.classList.add(this.css.wrapper);
        elem.innerHTML = `
            <div class="${this.css.toolHeader}"></div>
            <div class="${this.css.toolbox}"></div>
        `      
        return elem;
    }
    clearButtons () {  
        for (let i = 0; i < this.wrapper.querySelector('.sidenav-toolbar').childNodes.length; i++) {
            this.wrapper.querySelector('.sidenav-toolbar').childNodes[i].setAttribute('hidden', 'true');
        }
    }
    render () {
        return this.wrapper;
    }
    createExtendBar () {
        let wrapper = document.createElement("nav");
        let container = document.createElement("div");
        let closeBtn = document.createElement("button");
        let showArticle = document.createElement("button");

        showArticle.classList.add(this.css.extendBarShowArticle);
        showArticle.innerHTML = "Show Article";
        showArticle.addEventListener("click", () => {
            this.showArticle();
        })

        closeBtn.classList.add(this.css.extendBarCloseBtn)
        closeBtn.innerHTML = `<i class="fas fa-times"></i>`;

        container.classList.add(this.css.extendBarContainer);
        wrapper.classList.add(this.css.extendBar);

        container.appendChild(closeBtn);
        container.appendChild(showArticle);
        wrapper.appendChild(container);

        closeBtn.onclick = () => {
            this.extendWrapper.classList.remove(this.css.extendBarOpen);
            this.wrapper.classList.remove(this.css.sidenavOpen);
        }
        return wrapper;
    }
    createHeader () {
        let extendBtn = document.createElement("button");
        let header = document.createElement("h2");
        let settingsBtn = document.createElement("button");

        extendBtn.classList.add(this.css.toolHeaderExtendBtn);
        header.classList.add(this.css.toolHeaderHeader);
        settingsBtn.classList.add(this.css.toolHeaderSettingsBtn);

        extendBtn.innerHTML = `<i class="fas fa-angle-double-left"></i>`
        settingsBtn.innerHTML = `<i class="fas fa-cogs"></i>`
        header.innerText = this.data.header || "";

        extendBtn.onclick = () => {
            this.extendWrapper.classList.toggle(this.css.extendBarOpen);
            this.wrapper.classList.toggle(this.css.sidenavOpen);
        }

        this.sidenavHeader.append(extendBtn);
        this.sidenavHeader.append(header);
        this.sidenavHeader.append(settingsBtn);
    }
    createItems () {
        for(let key of this.items) {
             
            let elem = document.createElement("div");
            elem.classList.add("sidenav-toolbox");
            elem.setAttribute("draggable", "true");
            
            if(key.icon) {
                //TODO: create Icon
                let icon = document.createElement("div");
                icon.classList.add("toolbox-icon");
                icon.innerHTML = key.icon;
                elem.appendChild(icon);
            }
            if(key.text) {
                //TODO: create Textbox
                //TIP: When Icon place text under the icon other center the text
                let text = document.createElement("div");
                text.classList.add("toolbox-text");
                text.innerHTML = key.text;
                
                elem.appendChild(text);
            }
            if(key.tooltip) {
                //TODO: create a Tooltip when hover
                let tooltip = document.createElement("div");
                tooltip.classList.add("toolbox-tooltip");
                tooltip.innerHTML = key.tooltip;
                elem.appendChild(tooltip);
            }
            elem.addEventListener("dragstart", (e) => {
                e.target.classList.add("dragging");
                if(typeof this.onItemStartDrag === "function")
                    this.onItemStartDrag(e);
            })
            elem.addEventListener("dragend", (e) => {
                e.target.classList.remove("dragging");
                if(typeof this.onItemEndEvent === "function")
                    this.onItemEndEvent(e);
            })
            this.wrapper.querySelector(".sidenav-toolbar").appendChild(elem);
        }
    }
    get extendContainer () {
        return this.extendWrapper.querySelector("." + this.css.extendBarContainer);
    }
    initializeItems () {
        for(let key in this.tools) {
            this.items.push(this.tools[key].class.toolbox)
        }
    }

    async showArticle () {
        let articles = await Settings.getSelectArticle();
        if(articles === undefined) return;

        let backBtn = document.createElement("button");
        backBtn.classList.add("backBtn");
        backBtn.innerHTML = "Back";

        backBtn.addEventListener("click", () => {
            this.wrapper.querySelector("." + this.css.toolbox).innerHTML = "";
            this.wrapper.querySelector("." + this.css.toolbox).classList.remove("sidenav-toolbar--article");
            this.createItems();
        })
        this.wrapper.querySelector("." + this.css.toolbox).innerHTML = ""
        this.wrapper.querySelector("." + this.css.toolbox).classList.add("sidenav-toolbar--article");
        this.wrapper.querySelector("." + this.css.toolbox).appendChild(backBtn);
    
        
        articles.map(article => {
            backBtn.after(this.createArticle(article));
        });
        backBtn.after(this.createDivider());

        backBtn.after(this.createArticle({title: "New Article", description: "Create a New Article", _id: undefined}));

        backBtn.after(this.createDivider());
    }
    createDivider () {
        let divider = document.createElement("div");
        divider.style.borderBottom = "1px solid #606060";
        divider.style.margin = ".5rem 0";
        return divider;
    }
    createArticle (data) {  
        let elem = document.createElement("div");
        elem.classList = "previewArticle";
        elem.innerHTML = `
            <header class="d-flex align-items-baseline"><span class="text-clip me-auto white-space">${data.title}</span><button class="btn btn-outline-danger btn-sm">X</button></header>
            <div>${data.description}</div>
        `;
        elem.querySelector('button').addEventListener('click', () => {
            ArticleAPI.deleteArticleById("articles", data.id);
            //location.reload();
        });
        elem.addEventListener("click", () => {
            this.onArticleClick(data.id);
        });
        return elem;
    }

    remove () {
        this.sidenavHeader.remove();
        this.wrapper.remove();
        this.extendWrapper.remove();
    }
}