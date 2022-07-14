export class Paragraph {
    /**
     * @param {object} data
     */
    constructor ({data, readonly = false}, {onFocusIn, onFocusOut} = {}) {
        this.css = "kg-article-paragraph";
        this.data = data || {};
        this.readonly = readonly;
        this.holder = Paragraph.createParagraph(this.data.text || "", !readonly, this.css);

        this.onFocusIn = onFocusIn || function () {};
        this.onFocusOut = onFocusOut || function () {};

        if(!this.readonly) {
            this.setEventListeners();
        }
    }
    static createParagraph (text, readonly, css) {
        //now the real element is created. this has the effect that even though we change the paragraph/header etc. the parent holder with all the event listeners remains the same
        let paragraph = document.createElement('div');
        paragraph.setAttribute('contenteditable', String(readonly));
        paragraph.innerText = text;
        paragraph.classList.add(css);

        return paragraph;
    }
    static get toolbox () {
        return {
            icon: `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="paragraph" class="svg-inline--fa fa-paragraph fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M448 48v32a16 16 0 0 1-16 16h-48v368a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16V96h-32v368a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16V352h-32a160 160 0 0 1 0-320h240a16 16 0 0 1 16 16z"></path></svg>`,
            text: "Paragraph"
        }
    }
    get toolboxSettings () {
        return {
            Font_Size: '',
            Color: '',
            Bold: '',
            Italics: '',
            Underlined: '',
            Center: ''
        }
    }
    
    setEventListeners () {

        this.holder.addEventListener("focusin", (e) => {
            this.onFocusIn({parent: e.target, target: e.target, settings: this.toolboxSettings});
        });
        this.holder.addEventListener("focusout", (e) => {
            this.onFocusOut({parent: e.target, target: e.target, settings: this.toolboxSettings});
        });
        
    }
    render () {
        return this.holder;
    }

    save () {
        return {
            text: this.holder.innerText,
            style: this.holder.getAttribute('style')
        }
    }
    setFocus () {
        this.holder.focus();
    }
}