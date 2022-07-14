import { Toolbox } from "./toolbox.js";
export default class CheckList {
    
    /**
     * @
     * 
     * @param {list: [{text: string, checked: boolean}]} data
     * @param {object} settings
     * @param {boolean} readonly
     */
    
    constructor({data, settings = {}, readonly = false} = {}, {onFocusIn, onFocusOut} = {}) {
        this.data = this.checkData(data);
        this.readonly = readonly;
        this.settings = settings;
        this.css = {
            wrapper: "kg-article-checklist",
            listElement: "kg-article-checklist-item",
            listElementChecked: "kg-article-checklist-item--checked",
            listbox: "kg-article-checklist-box",
            listcontent: "kg-article-checklist-item__content",
            addBtn: "kg-article-checklist-addBtn"
        }
        this.elements = {
            wrapper: this.createWrapper(),
            items: []
        }

        this.onFocusIn = onFocusIn || function () {}
        this.onFocusOut = onFocusOut || function () {}
    }

    createWrapper () {
        let elem = document.createElement("ul");
        elem.classList.add(this.css.wrapper);

        return elem;
    }
    createListItem (item) {

        let checkListItem = document.createElement("li");
        let checkbox = document.createElement("span");
        let itemContent = document.createElement("div");
 
        itemContent.innerHTML = item.text || '';
        itemContent.setAttribute("contenteditable", !this.readonly);

        itemContent.classList.add(this.css.listcontent);
        checkbox.classList.add(this.css.listbox);
        checkListItem.classList.add(this.css.listElement);

        if(item.checked) 
            checkListItem.classList.add(this.css.listElementChecked);
        
        checkListItem.appendChild(checkbox);
        checkListItem.appendChild(itemContent);

        if(!this.readonly) {
            itemContent.addEventListener("focusin", (e) => {
                this.onFocusIn({parent: this.elements.wrapper, target: e.target, settings: this.toolboxSettings});
            })
            itemContent.addEventListener("focusout", (e) => {
                this.onFocusOut({parent: this.elements.wrapper, target: e.target, settings: this.toolboxSettings});
            })
        }

        return checkListItem;
    }
    enterPress (event) {
        event.preventDefault();
        
        let currentItem = document.activeElement.closest("." + this.css.listElement);
        
        const newItem = this.createListItem({
            text: "",
            checked: false
        })

        this.elements.wrapper.insertBefore(newItem, currentItem.nextSibling);
        this.moveCaret(this.getContent(newItem), true);
    }
    backspacePress (event) {

        let items = this.items;
        let currentItem = document.activeElement.closest("." + this.css.listElement);
        let currentIndex = items.indexOf(currentItem);
        let prevItem = this.items[currentIndex - 1];

        if(!prevItem) {
            return;
        }

        const selection = window.getSelection();
        const caretAtTheBeginning = selection.focusOffset === 0;

        if (!caretAtTheBeginning) {
        return;
        }

        event.preventDefault();

        let prevItemContent = this.getContent(prevItem);
        this.moveCaret(prevItemContent, undefined, prevItemContent.childNodes.length)
        
        currentItem.remove();
    }
    toggleCheckbox (event) {
        let checkListItem = event.target.closest("." + this.css.listElement);
        let checkBox = checkListItem.querySelector("." + this.css.listbox);

        if(checkBox.contains(event.target)) {
            checkListItem.classList.toggle(this.css.listElementChecked);
        }
    }
    
    checkData(data) {
        let newData = {};
        if(typeof data !== "object") {
            data = {};
        }
        newData.list = data.list || [];

        return newData;
    }
    static get toolbox () {
        return {
            icon: `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="tasks" class="svg-inline--fa fa-tasks fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M139.61 35.5a12 12 0 0 0-17 0L58.93 98.81l-22.7-22.12a12 12 0 0 0-17 0L3.53 92.41a12 12 0 0 0 0 17l47.59 47.4a12.78 12.78 0 0 0 17.61 0l15.59-15.62L156.52 69a12.09 12.09 0 0 0 .09-17zm0 159.19a12 12 0 0 0-17 0l-63.68 63.72-22.7-22.1a12 12 0 0 0-17 0L3.53 252a12 12 0 0 0 0 17L51 316.5a12.77 12.77 0 0 0 17.6 0l15.7-15.69 72.2-72.22a12 12 0 0 0 .09-16.9zM64 368c-26.49 0-48.59 21.5-48.59 48S37.53 464 64 464a48 48 0 0 0 0-96zm432 16H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"></path></svg>`,
            text: 'CheckList'
        }
    }
    setEventListenerToolbox (options, callback) {
        this.elements.wrapper.addEventListener('click', e => {
            let box = new Toolbox({
                type: 'CheckList',
                options: options,
                currElement: this.elements.wrapper  
            });
            this.elements.wrapper.addEventListener('focusout', () => {
                box.removeBox();
                callback();
            });
        });
    }
    render () {
        if(!this.data.list || !this.data.list.length && !this.readonly) {
            this.data.list = [
                {
                    text: "",
                    checked: false
                }
            ]
        }

        this.data.list.map(item => {
            this.elements.wrapper.appendChild(this.createListItem(item))
        })

        if(this.readonly)
            return this.elements.wrapper;
        
        this.elements.wrapper.addEventListener("keydown", (e) => {
            switch(e.key.toLowerCase()) {
                case "enter":
                    this.enterPress(e);
                    break;
                case "backspace":
                    this.backspacePress(e);
                    break;
            }
        })
        this.elements.wrapper.addEventListener("click", e => {
            this.toggleCheckbox(e);
        })

        return this.elements.wrapper;
    }

    get items() {
        return Array.from(this.elements.wrapper.querySelectorAll("." + this.css.listElement));
    }
    getContent (el) {
        return el.querySelector("." + this.css.listcontent);
    }
    
    moveCaret(element, toStart = false, offset = undefined) {
        const range = document.createRange();
        const selection = window.getSelection();
      
        range.selectNodeContents(element);
      
        if (offset !== undefined) {
          range.setStart(element, offset);
          range.setEnd(element, offset);
        }
      
        range.collapse(toStart);
      
        selection.removeAllRanges();
        selection.addRange(range);
    }
    get toolboxSettings () {
        return {
            Color: '',
            Font_Size: '',
            Color: '',
            Bold: '',
            Italics: '',
            Underlined: '',
            Center: ''
        }
    }
    save () {
        let retItems = this.items.map(item => {
            let content = this.getContent(item);

            return {
                text: content.innerHTML,
                checked: item.classList.contains(this.css.listElementChecked),
                style: content.getAttribute('style')
            };
        });

        retItems = retItems.filter(item => item.text.trim().length !== 0);

        return {
            list: retItems
        };
    }

    setFocus () {
        this.moveCaret(this.getContent(this.items[0]), true); 
    }
}