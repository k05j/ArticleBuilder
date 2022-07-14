import Part from "../Article/Component/Part/Part.js";
import Sidenav from "./Sidenav/Sidenav.js";
import PartAPI from "../Article/Component/Part/api.js";
import { Toolbox } from "../Article/Module/toolbox.js";
import Settings from "../Article/Settings/Settings.js";
import Modal from "../../js 2/Modal.js";
import ArticleAPI from "../../../utils/ArticleAPI.js";


export default class ArticleBuilder {
    constructor ({holder, tools, readOnly = false, data, callback, editorMode = true, descriptionMode = false, sidenavMode = false} = {}, {namesArray, elementsArray} = {}) {
        this.holder = holder;
        this.tools = ArticleBuilder.checkTools(tools);
        this.elementsArray = elementsArray;
        this.namesArray = namesArray;
        this.css = this.CSS;
        this.readOnly = readOnly;
        this.descriptionMode = descriptionMode;
        this.editorMode = editorMode;
        this.sidenavMode = sidenavMode || false;

        this.onArticleChange = function () {};

        this.settings = new Settings({readOnly: this.readOnly});
        
        this.data = this.checkData(data);

        this.wrapper = this.createWrapper(callback);

        if(!readOnly) {
            this.addEventListeners();
            this.sidenav = new Sidenav({
                data: {
                    header: "Articlebuilder"
                },
                holder: holder, 
                tools: this.getAllowToolbox
            });
            this.sidenav.onArticleClick = (id) => {
                this.onArticleChange(id);
            }
            
            //createing save Modal
            this.saveModal = new Modal({
                holder: holder,
                apiBase: "http://localhost:5500",
                data: {
                    title: "Save Article",
                    closeBtn: true,
                    body: [
                        {
                            type: "div",
                            classList: ["row", "mb-3"],
                            innerHTML: `
                                <label class="col-sm-3 col-form-label">Title</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control" id="titleInput" value="${this.data.title}" placeholder="Enter Title"/>
                                </div>
                            `,
                            events: [{
                                type: "change",
                                callback: (e) => {this.data.title = e.target.value; this.wrapper.querySelector("." + this.css.title).innerHTML = this.data.title}
                            }]
                        },
                        {
                            type: "div",
                            classList: ["row"],
                            innerHTML: `
                                <label class="col-sm-3 col-form-label">Description</label>
                                <div class="col-sm-9">
                                    <textarea class="form-control" placeholder="Enter Description" maxlength="200">${this.data.description}</textarea>
                                </div>
                            `,
                            events: [{
                                type: "change",
                                callback: (e) => {this.data.description = e.target.value}
                            }]
                        },
                        {
                            type: "div",
                            classList: ["row"],
                            innerHTML: `
                                <label class="col-sm-3 form-check-label">Public</label>
                                <div class="col-sm-9">
                                    <input type="checkbox" class="form-check-input" id="titleInput" checked="${this.data.public}" placeholder="Enter Title"/>
                                </div>
                            `,
                            events: [{
                                type: "change",
                                callback: (e) => {this.data.public = e.target.checked}
                            }]
                        }
                    ],
                    footer: [
                        {
                            type: "button",
                            innerHTML: "Save",
                            classList: ["btn", "btn-success"],
                            events: [
                                {
                                    type: "click",
                                    callback: async () => {

                                        let parts = this.data.parts.filter(part => part.save() !== undefined);
                                        
                                        if(this.data.id !== undefined) {
                                            ArticleAPI.updateArticle("articles", {title: this.data.title, parts: parts.map(part => {return part.save()}),
                                            description: this.data.description, created: this.data.created, lastChange: Date.now(),
                                            public: this.data.public, id: this.data.id});
                                        }else {
                                            let id = createID();
                                            ArticleAPI.putArticle("articles", {title: this.data.title, parts: parts.map(part => {return part.save()}),
                                            description: this.data.description, created: this.data.created, lastChange: Date.now(),
                                            public: this.data.public, id: id});
                                            this.data.id = id;
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            });

            //When modal finished with loading then the saveBtn can be created. We need it because of async functions in modal
            this.saveModal.onLoad = () => {
                this.saveBtn = this.createSaveBtn();
                this.sidenav.extendContainer.appendChild(this.saveBtn);

                let backBtn = document.createElement("a");
                backBtn.classList.add(...["btn", "btn-danger", "ms-auto", "me-2"]);
                backBtn.href = "/";
                backBtn.innerText = "Back"

                this.sidenav.extendContainer.appendChild(backBtn);
                this.renderSidenav();
            }
            
        }
    }
    createWrapper (callback) {
        let elem = document.createElement("div");
        let parts = document.createElement("div");
        
        
        let article = document.createElement("div");
        article.classList.add("sidenav-target");
        article.classList.add(this.css.article);
        article.setAttribute("data-text", this.data.title);
        
        let title = document.createElement("div");
        title.innerText = this.data.title;
        title.setAttribute("contenteditable", !this.readOnly);
        title.addEventListener("blur", (e) => {
            this.saveModal.modalBody.querySelector("#titleInput").value = e.target.innerText.trim();
            this.data.title = e.target.innerText.trim();
        })
        title.classList.add(this.css.title);

        let footer = document.createElement("div");
        footer.classList.add(this.css.footer);

        //the Button for the GET request for the articles
        let button = document.createElement('button');
        if (this.descriptionMode) {
            button.innerText = 'Mehr anzeigen';
            button.classList.add('btn');
            button.classList.add('btn-primary');
            button.classList.add('btn-md');

            button.addEventListener('click', () => {
                callback();
            });
            footer.appendChild(button);
        }else if (!this.editorMode && !this.descriptionMode) {
            button.innerText = 'Zurück';
            button.classList.add('btn');
            button.classList.add('btn-primary');
            button.classList.add('btn-md');

            button.addEventListener('click', () => {
                callback();
            });
            footer.appendChild(button);
        }
        
        elem.classList.add(this.css.wrapper);
        parts.classList.add(this.css.parts);

        article.appendChild(title);
        article.appendChild(parts);
        article.appendChild(footer);

        if(!this.readOnly) {
            let addPartBtn = document.createElement("button");
            addPartBtn.classList.add(this.css.addPartBtn);
            addPartBtn.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>';
            parts.appendChild(addPartBtn);
        }

        elem.appendChild(article);
        return elem;
    }
    addEventListeners () {
        this.wrapper.querySelector("." + this.css.addPartBtn).addEventListener("click", () => {
            this.renderSidenav();
            let newPart = this.addNewPart()
            this.data.parts.push(newPart);
            
            //this codeline here removes the highlighted class from the part, as the old part is not in focus anymore
            if(document.querySelector(".kg-article-highlighted")) {
                document.querySelector('.kg-article-highlighted').classList.remove('kg-article-highlighted');
            }
        })
        this.wrapper.querySelector("." + this.css.addPartBtn).addEventListener("dragover", (e) => {e.preventDefault()})
        this.wrapper.querySelector("." + this.css.addPartBtn).addEventListener("drop", (e) => {
            let draggable = document.querySelector(".dragging");
            Object.keys(this.tools).map(item => {
                if(item.toLowerCase() === draggable.querySelector(".toolbox-text").innerHTML.toLowerCase()) {
                    let newPart = this.addNewPart({type: item.toLowerCase(), data: {}})
                    this.data.parts.push(newPart);
                    newPart.toolInstance.setFocus();
                }
            })
            this.wrapper.classList.remove(this.css.wrapperDragOver);
        })
    }
    checkData (data) {
        let newData = {};

        if(typeof data != 'object'){
            data = {};
        }
        newData.title = data.title || "";
        newData.description = data.description || "";
        newData.created = data.created || Date.now();
        newData.lastChange = data.lastChange || Date.now();
        newData.parts = data.parts || [];
        newData.public = data.public || true;
        newData.id = data.id || undefined;

        return newData;
    }
    renderSidenav() {
        if (this.sidenav.currentState === 'Sidenav') {
            this.holder.appendChild(this.sidenav.render());
        }else {
            this.sidenav.currentState = 'Sidenav';
            this.sidenav.clearButtons();
            this.sidenav.createItems();
            this.holder.appendChild(this.sidenav.render());
        }
    }
    createSaveBtn () {
        let btn = document.createElement("button");

        btn.classList.add(this.css.saveBtn);
        btn.innerText = "Save";

        btn.addEventListener("click", async () => {
            this.saveModal.modal.show();
        })
        return btn;
    }
    static checkTools (tools) {
        return (typeof tools !== "object") ? {} : tools;
    }
    get getAllowToolbox () {
        let allowToolbox = {};
        for(let key in this.tools) {
            if(this.tools[key].allowToolbox)
                allowToolbox[key] = this.tools[key];
        }
        return allowToolbox;
    }
    //this function here adds a new part to the main wrapper. it also enables the toolbox event listeners
    addNewPart ({type = undefined, data = {}, id = undefined} = {}) {
        let newPart = new Part({
            readonly: this.readOnly,
            api:  new PartAPI({
                    base: "http://localhost:80",
                    tools: this.tools 
                }),
            data: {
                type: type,
                data: data,
                id: id
            }
        });

        //if the part is on focus, the function shall add a new toolbox (create one)
        newPart.onFocus = (e) => {
            this.sidenav.currentState = 'Toolbox';
            new Toolbox({
                type: '',
                options: e.settings,
                currElement: e.target,
                currSidenav: this.sidenav
            });
        }
        newPart.onDelete = (e) => {
            if(!confirm("Wollen Sie wirklich diesen Part löschen?")) return;
            let parts = this.partNodes;
            let index = parts.indexOf(e);
            this.data.parts.splice(index, 1);
            this.wrapper.querySelector("." + this.css.parts).removeChild(parts[index]);
            
        }
        newPart.onMove = (e) => {
            let parts = this.partNodes;
            let index = parts.indexOf(e.wrapper);
            if((index === 0 && e.dir === 1) || (index === parts.length - 1 && e.dir === -1)) return;
            
            if(e.dir === 1) {
                parts[index + e.dir * -1].before(parts[index]);
            }else {
                parts[index + e.dir * -1].after(parts[index]);
            }
            
            let temp = this.data.parts[index];
            this.data.parts[index] = this.data.parts[index + (e.dir * -1)];
            this.data.parts[index + (e.dir * -1)] = temp;

            
        }
        if(!this.readOnly) {
            this.wrapper.querySelector("." + this.css.addPartBtn).before(newPart.render());
        }else {
            this.wrapper.querySelector("." + this.css.parts).appendChild(newPart.render());
        }
        return newPart;
    }
    static returnOptions(name) {
        return getAccordingOptions(name);
    }

    get CSS () {
        return {
            wrapper: "kg-articlebuilder",
            parts: "article-body",
            saveBtn: "kg-article-save",
            addPartBtn: "kg-articlebuilder-addPartBtn",
            title: "article-header",
            footer: "article-footer",
            article: "article"
        };
    }
    render () {
        if(!this.descriptionMode) {
            this.data.parts = this.data.parts.map(part => {
                part = this.addNewPart({type: part.type, data: part.data, id: part.id})

                if (part.data.type === 'header') {
                    for (let i = 1; i <= 6; i++) {
                        if (part.content.querySelector(`h${i}`)) {
                            part.data.data.style !== null ? part.content.querySelector(`h${i}`).setAttribute('style', part.data.data.style) : '';
                        }
                    }
                }else if (part.data.type === 'divider') {
                    part.data.data.style !== null ? (part.content.childNodes[0].classList.add(part.data.data.type), part.content.childNodes[0].setAttribute('style', part.data.data.style)) : '';
                }else if (part.data.type !== 'list' && part.data.type !== 'checklist') {
                    part.data.data.style !== null ? part.content.setAttribute('style', part.data.data.style) : '';
                }else if (part.data.type !== 'downloadable') {
                    for (let j = 0; j < part.content.childNodes[0].childNodes.length; j++) {
                        part.data.data.list[j].style !== null ? part.content.childNodes[0].childNodes[j].setAttribute('style', part.data.data.list[j].style) : '';
                    }
                }
                return part;
            });
        }else {
            this.addNewPart({
                type: "empty-text",
                data: {
                    text: this.data.description
                },
                id: "empty_" + this.data.id
            })
        }
        return this.wrapper;
    }
    get partNodes () {
        return Array.from(this.wrapper.querySelectorAll("." + Part.CSS.wrapper));
    }

    remove () {
        this.sidenav.remove();
        this.wrapper.remove();
    }
}

const createID = () => {
    return Math.random();
}