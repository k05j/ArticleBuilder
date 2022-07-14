export default class Part {
    constructor({data, api, readonly = false}, {onFocus, onDelete, onMove} = {}) {
        this.data = data || {};
        this.api = api;
        this.readonly = readonly;
        this.css = Part.CSS;
        this.id = this.data.id || undefined;
        if(this.id === undefined)
        this.id = Math.random() * 100000;
        
        this.tool = this.data.type || undefined;
        this.toolInstance = this.api.tools[this.tool] ? new this.api.tools[this.tool].class({readonly: readonly, data: this.data.data}) : undefined;
        
        this.wrapper = this.createWrapper();     
        this.content = this.wrapper.querySelector("." + this.css.content);
        
        if(!this.readonly) {
            this.editbox = this.createEditBox();
            this.addEventListeners();
        }

        this.onFocus = onFocus || function () {};
        this.onDelete = onDelete || function () {};
        this.onMove = onMove || function () {};

    }
    createWrapper () {
        let wrapper = document.createElement("div");
        let content = document.createElement("div");

        content.classList.add(this.css.content);
        content.appendChild(this.toolInstance ? this.toolInstance.render() : this.EmptyTool);

        wrapper.classList.add(this.css.wrapper);

        wrapper.appendChild(content);

        return wrapper;

    }
    
    addEventListeners () {
        this.wrapper.addEventListener("mouseover", () => {
            if(this.toolInstance)
            this.wrapper.classList.add(this.css.partHover);
        })
        this.wrapper.addEventListener("mouseleave", () => {
            if(this.wrapper.contains(this.editbox)) {
                this.wrapper.removeChild(this.editbox);
                this.wrapper.classList.remove(this.css.partHover);
            }
        });
        this.wrapper.addEventListener("mouseenter", () => {
            if(this.toolInstance)
            this.wrapper.appendChild(this.editbox);
        })
        this.wrapper.addEventListener("dblclick", (e) => {
            this.onDelete(this.wrapper);
        });
        this.content.addEventListener("dragover", (e) => {
            e.preventDefault();
            this.wrapper.classList.add(this.css.wrapperDragOver);
        });
        this.content.addEventListener("dragend", () => {
            this.wrapper.classList.remove(this.css.wrapperDragOver);
        });
        this.content.addEventListener("dragleave", () => {
            this.wrapper.classList.remove(this.css.wrapperDragOver);
        });
        this.content.addEventListener("drop", (e) => {
            let draggable = document.querySelector(".dragging");
            Object.keys(this.api.tools).map(item => {
                if(item.toLowerCase() === draggable.querySelector(".toolbox-text").innerHTML.toLowerCase()) {
                    
                    this.tool = item.toLowerCase();
                    this.toolInstance = new this.api.tools[item].class({data: {}});
                    this.content.innerHTML = "";
                    this.content.appendChild(this.toolInstance.render());
                    this.toolInstance.onFocusIn = (e) => {
                        this.onFocus(e);
                        this.wrapper.classList.add(this.css.partFocus);
                    }
                    this.toolInstance.onFocusOut = (e) => {
                        this.wrapper.classList.remove(this.css.partFocus);
                    }
                    this.toolInstance.setFocus();
                }
            })
            this.wrapper.classList.remove(this.css.wrapperDragOver);
        })
        if(this.toolInstance) {
            this.toolInstance.onFocusIn = (e) => {
                this.onFocus(e);
                this.wrapper.classList.add(this.css.partFocus);
            }
            this.toolInstance.onFocusOut = () => {
                this.wrapper.classList.remove(this.css.partFocus);       
            }
        }
    }

    createEditBox () {
        let wrapper = document.createElement("div");
        wrapper.classList.add(this.css.editboxWrapper);
        
        let delBtn = document.createElement("button");
        delBtn.classList.add(this.css.editboxDelBtn);
        delBtn.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>'

        delBtn.addEventListener("click", () => {
            this.onDelete(this.wrapper);
        })

        let moveUpBtn = document.createElement("button");
        moveUpBtn.classList.add(this.css.editboxMoveUpBtn);
        moveUpBtn.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" class="svg-inline--fa fa-arrow-up fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg>'

        moveUpBtn.addEventListener("click", () => {
            this.onMove({wrapper: this.wrapper, dir: 1});
        })

        let moveDownBtn = document.createElement("button");
        moveDownBtn.classList.add(this.css.editboxMoveDownBtn);
        moveDownBtn.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-down" class="svg-inline--fa fa-arrow-down fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path></svg>'

        moveDownBtn.addEventListener("click", () => {
            this.onMove({wrapper: this.wrapper, dir: -1});
        })

        wrapper.appendChild(delBtn);
        wrapper.appendChild(moveUpBtn);
        wrapper.appendChild(moveDownBtn);

        return wrapper;
    }

    render () {
        return this.wrapper;
    }

    static get CSS () {
        return {
            wrapper: "kg-article-part",
            content: "kg-article-part__content",
            partFocus: "kg-article-part--focus",
            emptyTool: "kg-article-part-empty",
            emptyToolText: "kg-article-part-empty-text",
            wrapperDragOver: "kg-article-part--dragover",
            editboxWrapper: "kg-article-part-editbox-wrapper",
            editboxDelBtn: "editbox-delBtn",
            editboxMoveUpBtn: "editbox-moveUpBtn",
            editboxMoveDownBtn: "editbox-moveDownBtn",
            partHover: "kg-article-part--hover"
        }
    }
    get createId() {
        return new Promise ((resolve, reject) => {
            fetch(this.api.API_BASE + "/newId").then(res => res.json().then(data => resolve(data))).catch(err => reject(err));
        })
    }

    get EmptyTool () {

        let elem = document.createElement("div");
        if(this.data.type === "empty-text") {
            elem.innerHTML = this.data.data.text || "No Description";
            elem.classList.add(this.css.emptyToolText);
        } else {
            elem.classList.add(this.css.emptyTool);
            elem.innerText = `Drag Item Here`;
        }
        return elem;
    }
    save () {
        if(!this.toolInstance)
            return undefined;
        let part = {
            type: this.tool,
            data: this.toolInstance.save(),
            id: this.id
        };  
        return part;
    }
}