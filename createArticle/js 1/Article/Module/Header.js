import  ArticleBuilder  from "../../ArticleBuilder/ArticleBuilder.js";
import { Toolbox } from "./toolbox.js";

let currElem = null;

export class Header {
    constructor ({data, readonly, settings = {}} = {}, {onFocusIn, onFocusOut} = {}) {
        this.css = {
            wrapper: "kg-article-header"
        };
        this.data = this.checkData(data);
        this.settings = settings || {};
        this.readonly = readonly;
        this.element = this.createElement();

        this.onFocusIn = onFocusIn || function () {}
        this.onFocusOut = onFocusOut || function () {}

        if(!this.readonly) {
            this.setEventListeners();
        }
    }
    
    createElement () {
        //this is the parent element, so even though we change something within the toolbox, the event listeners are bound on the parent
        let parent = document.createElement('div');

        let elem = document.createElement(this.defaultLevel.tag);
        if (this.data.level) {
            elem = document.createElement(`h${this.data.level}`);
        }

        elem.classList.add(this.css.wrapper);

        elem.setAttribute("contenteditable", String(!this.readonly));

        elem.dataset.placeholder = this.settings.placeholder || 'Enter Text...';

        elem.innerText = this.data.text || '';

        //now append the child to the parent, so we change easily change anything from the element
        parent.appendChild(elem);

        return parent;
    }
    /**
     * @param {number} level
     */
    set level (level) {
        
        this.newData = {
            text: this.element.innerHTML,
            level
        }
    }
    static get toolbox () {
        return {
            icon: `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heading" class="svg-inline--fa fa-heading fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M448 96v320h32a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H320a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h32V288H160v128h32a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H32a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h32V96H32a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-32v128h192V96h-32a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16z"></path></svg>`,
            text: "Header"
        }
    }

    get currentLevel () {
        let level = this.levels.find(l => l.number === this.data.level)
        
        if(!level) level = this.defaultLevel;

        return level;
    }
    get levels () {
        const supportedLevles = [
            {
                number: 1,
                tag: "h1"
            },
            {
                number: 2,
                tag: "h2"
            },
            {
                number: 3,
                tag: "h3"
            },
            {
                number: 4,
                tag: "h4"
            },
            {
                number: 5,
                tag: "h5"
            },
            {
                number: 6,
                tag: "h6"
            },
        ]
        return supportedLevles;
    }
    get defaultLevel () {
        if( this.settings &&this.settings.defaultLevel) {
            let userDefaultLevel = this.levels.find(level => level.number === this.settings.defaultLevel);
            if(userDefaultLevel) return userDefaultLevel;
        }
        return this.levels[0];
    }
    /**
     * @param {{ level: number; text: string; }} data
     */
     set newData (data) {
        this.data = this.checkData(data)

        if(this.data.level !== undefined && this.element.parentElement) {
            let newHeader = this.createElement();

            newHeader.innerHTML = this.element.innerHTML;
            this.element.parentNode.replaceChild(newHeader, this.element);
            this.element = newHeader;
        }

        if (!data.text) {
            this.element.innerHTML = this.data.text || '';
        }
    }
    checkData (data) {
        let newData = {}
        if(typeof data !== "object") {
            data = {}
        }
        newData.text = data.text || '';
        newData.level = parseInt(data.level) || this.defaultLevel.number;
    
        return data;
    }
    setEventListeners () {
        this.element.addEventListener("focusin", (e) => {
            this.onFocusIn({parent: e.target, target: e.target, settings: this.toolboxSettings});
        });
        this.element.addEventListener("focusout", (e) => {
            this.onFocusOut({parent: e.target, target: e.target, settings: this.toolboxSettings});
        });
    }
    render () {
        return this.element;
    }
    get toolboxSettings () {
        return {
            Color: "rgb(255, 255, 255)",
            Level: 1,
            Bold: '',
            Italics: '',
            Underlined: '',
            Center: ''
        }
    }
    save () {
        let st = '';
        let tag = '';
        if (this.element.childNodes.length > 1) {
            st = this.element.childNodes[1].getAttribute('style');
            tag = this.element.childNodes[1].tagName;
            tag = tag.slice(1, 2);
        }else {
            st = this.element.childNodes[0].getAttribute('style');
            tag = this.element.childNodes[0].tagName;
            tag = tag.slice(1, 2);
        }
        return {
            text: this.element.innerText,
            level: tag,
            style: st
        }
    }
    setFocus () {
       this.element.querySelector("." + this.css.wrapper).focus();
    }
}