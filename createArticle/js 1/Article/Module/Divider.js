import { Toolbox } from "./toolbox.js";
export default class Divider {
    constructor ({data = {}, settings = {}, readonly = false, styles = {}}, {onFocusIn, onFocusOut} = {}) {

        this.data = this.checkData(data);
        this.settings = settings;
        this.readonly = readonly;
        this.styles = styles;

        this.css = {
            wrapper: "kg-article-divider"
        }

        this.element = this.createDivider();

        this.onFocusIn = onFocusIn || function () {};
        this.onFocusOut = onFocusOut || function () {};

        if(!this.readonly) {
            this.setEventListeners();
        }
    }
    createDivider () {
        let elem = document.createElement("div");

        elem.classList.add(this.css.wrapper, "kg-article-divider-" + this.data.type);
        elem.setAttribute("contenteditable", this.currentType.textAllow);

        if(!this.readonly)
            elem.setAttribute("tabindex", "0");
        elem.innerHTML = this.data.text;
        
        for(let key in this.styles) {
            elem.style[key] = this.styles[key];
        }

        return elem;
    }

    get types () {
        let supportedTypes = [
            {
                style: "stars",
                textAllow: false
            },
            {
                style: "arrows",
                textAllow: false
            },
            {
                style: "dotted",
                textAllow: false
            },
            {
                style: "content",
                textAllow: true
            }
        ]

        return supportedTypes;
    }
    get currentType () {
        let type = this.types.find(type => type.style === this.data.type);
        
        if(!type) 
            type = this.defaultType;
        
        return type;
    }
    get defaultType () {
        
        if(typeof this.settings === "object" && this.settings.defaultType) {
            let userDefault = this.types.find(type => type.style === this.settings.defaultType);

            if(userDefault)
                return userDefault;
        }
        return this.types[0];
    }

    checkData (data) {
        let newData = {};
        if(typeof data !== "object") {
            data = {};
        }
        
        newData.text = data.text || '';
        newData.type = this.checkType(data.type).style || this.defaultType.style;

        return newData;
    }
    static get toolbox () {
        return {
            icon: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" class="svg-inline--fa fa-ellipsis-h fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"></path></svg>',
            text: "Divider"
        }
    }
    checkType(type) {
        let valid = this.types.find(t => t.style === type); 
        return valid || {};   
    }
    setEventListeners () {
        this.element.addEventListener("focusin", (e) => {
            this.onFocusIn({parent: e.target, target: e.target, settings: this.toolboxSettings});
        })
        this.element.addEventListener("focusout", (e) => {
            this.onFocusOut({parent: e.target, target: e.target, settings: this.toolboxSettings});
        })
    }
    render () {
        return this.element;
    }
    get toolboxSettings () {
        return {
            Color: '',
            Style: ''
        }
    }
    save () {
        let text = this.element.innerText || '';
        let arr = this.element.classList.value.split(/[' ']/g);
        let idx = arr.indexOf('kg-article-divider-dotted') >= 0 ? arr.indexOf('kg-article-divider-dotted') : (arr.indexOf('kg-article-divider-arrows') >= 0 ? arr.indexOf('kg-article-divider-arrows') : (arr.indexOf('kg-article-divider-stars') >= 0 ? arr.indexOf('kg-article-divider-stars') : -1));
        
        let dividerType = idx >= 0 ? arr[idx] : 'kg-article-divider';
        return {
            text: text,
            type: dividerType,
            style: this.element.getAttribute('style')
        }
    }
    setFocus () {
        this.element.focus();
    }
}