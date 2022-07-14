import { Toolbox } from "./toolbox.js";
export class Spacing {

    /** 
        *@param {object} data
        *@param {boolean} readonly
    */

    constructor({data, readonly = false}, {onFocusIn, onFocusOut} = {}) {
        this.data = this.checkData(data);
        this._css = this.CSS;
        this.readonly = readonly;
        this.wrapper = this.createSpacing();

        this.onFocusIn = onFocusIn || function () {};
        this.onFocusOut = onFocusOut || function () {};

        if(!this.readonly) {
            this.setEventListeners();
        }
    }
    createSpacing() {
        let elem = document.createElement('div');
        elem.classList.add(this._css.wrapper);
        if(!this.readonly) {
            elem.tabIndex = 1;
        }
        elem.style.height = this.data.height;
        return elem;
    }
    static get toolbox () {
        return {
            icon: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrows-alt-v" class="svg-inline--fa fa-arrows-alt-v fa-w-8" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill="currentColor" d="M214.059 377.941H168V134.059h46.059c21.382 0 32.09-25.851 16.971-40.971L144.971 7.029c-9.373-9.373-24.568-9.373-33.941 0L24.971 93.088c-15.119 15.119-4.411 40.971 16.971 40.971H88v243.882H41.941c-21.382 0-32.09 25.851-16.971 40.971l86.059 86.059c9.373 9.373 24.568 9.373 33.941 0l86.059-86.059c15.12-15.119 4.412-40.971-16.97-40.971z"></path></svg>',
            text: 'Spacing'
        }
    }
    setEventListeners () {   
        this.wrapper.addEventListener("focusin", (e) => {
            this.onFocusIn({parent: e.target, target: e.target});
        });
        this.wrapper.addEventListener("focusout", (e) => {
            this.onFocusOut({parent: e.target, target: e.target});
        });
    }
    checkData(data) {
        let newData = {}
        if(typeof data != 'object') {
            data = {};
        }
        newData.height = data.height || "15px"
        return newData;
    }
    render() {
        return this.wrapper;
    }
    save () {
        return {
            height: this.wrapper.style.height   
        }
    }
    get CSS () {
        return {
            wrapper: 'kg-article-spacing'
        }
    }
    setFocus () {
        this.wrapper.focus();
    }
}