
export default class List {
    constructor ({data = {}, settings = {}, readonly = false} = {}, {onFocusIn, onFocusOut} = {}) {
        this._css = this.CSS;
        this.readonly = readonly;
        this.settings = this.checkSettings(settings);
        this.data = this.checkData(data);

        this.wrapper = this.createWrapper();

        this.onFocusIn = onFocusIn || function () {};
        this.onFocusOut = onFocusOut || function () {};

    }

    createWrapper () {
        let element = document.createElement("ul");
        element.classList.add(this._css.wrapper);

        return element;
    }
    createListItem (item) {

        let listItem = document.createElement("li");
        let itemContent = document.createElement("div");
 
        itemContent.innerHTML = item.text || '';
        itemContent.setAttribute("contenteditable", !this.readonly);

        itemContent.classList.add(this._css.listContent);
        listItem.classList.add(this._css.listElement);

        if(!this.readonly) {
            itemContent.addEventListener("focusin", (e) => {
                this.onFocusIn({parent: this.wrapper, target: e.target, settings: this.toolboxSettings});
            })
            itemContent.addEventListener("focusout", (e) => {
                this.onFocusOut({parent: this.wrapper, target: e.target, settings: this.toolboxSettings});
            })
        }

        listItem.appendChild(itemContent);

        return listItem;
    }
    enterPress (event) {
        event.preventDefault();
        
        let currentItem = document.activeElement.closest("." + this._css.listElement);
        
        const newItem = this.createListItem({
            text: ""
        })

        this.wrapper.insertBefore(newItem, currentItem.nextSibling);
        this.moveCaret(this.getContent(newItem), true);
    } 

    backspacePress (event) {

        let items = this.list;
        let currentItem = document.activeElement.closest("." + this._css.listElement);
        let currentIndex = items.indexOf(currentItem);
        let prevItem = items[currentIndex - 1];

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

    checkData (data) {
        let newData = {};

        if(typeof data !== 'object')
            data = {};

        newData.list = data.list || [];
        newData.style = data.style || this.settings.defaultStyle;
        newData.listStyle = data.listStyle || this.settings.defaultListStyle;

        return newData;
    }

    checkSettings (settings) {
        let newSettings = {};

        if(typeof settings !== 'object')
            settings = {};

        newSettings.defaultStyle = settings.defaultStyle || "ul";
        newSettings.defaultListStyle = settings.defaultListStyle || "dotted";

        return newSettings;
    }

    static get toolbox () {
        return {
            icon: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="list-ul" class="svg-inline--fa fa-list-ul fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M48 48a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm448 16H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"></path></svg>',
            text: 'List'
        }
    }

    render () {

        if(!this.data.list || !this.data.list.length && !this.readonly) {
            this.data.list = [
                {
                    text: ""
                }
            ]
        }

        this.data.list.map(item => {
            this.wrapper.appendChild(this.createListItem(item))
        })
        
        if(!this.readonly)
        this.wrapper.addEventListener("keydown", (e) => {
            switch(e.key.toLowerCase()) {
                case "enter":
                    this.enterPress(e);
                    break;
                case "backspace":
                    this.backspacePress(e);
                    break;
            }
        })

        return this.wrapper;
    }

    get toolboxSettings () {
        return {
            Color: "rgb(255, 255, 255)",
            Bold: '',
            Italics: '',
            Underlined: '',
            Center: ''
        }
    }

    save () {
        
        let retItmes = this.list.map(item => {
            let content = this.getContent(item);

            return {
                text: content.innerHTML,
                style: content.getAttribute('style')
            };
        });

        retItmes = retItmes.filter(item => item.text.trim().length !== 0);

        return {
            list: retItmes
        };
    }
    get list () {
        return Array.from(this.wrapper.querySelectorAll("." + this._css.listElement));
    }
    get CSS () {
        return {
            wrapper: "kg-article-list",
            listContent: "kg-article-list-item__content",
            listElement: "kg-article-list-item"
        }
    }

    getContent (el) {
        return el.querySelector("." + this._css.listContent);
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
    setFocus () {
        this.moveCaret(this.getContent(this.list[0]), true); 
    }
}