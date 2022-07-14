import { Toolbox } from "./toolbox.js";

export class PDFExtract {
    constructor({data, readonly = false}, {onFocusIn, onFocusOut} = {}) {
        this.css = 'kg-article-PDF';
        this.data = data;
        this.readonly = readonly;
        this.holder = PDFExtract.createPDF(!this.readonly, this.css);

        this.onFocusIn = onFocusIn || function () {};
        this.onFocusOut = onFocusOut || function () {};

        if(!this.readonly) {
            this.setEventListeners();
        }
    }
    static createPDF(readonly, css) {
        let parent = document.createElement('div');

        let elem = document.createElement('div');
        elem.classList.add(css);
        elem.setAttribute("contenteditable", String(readonly));

        parent.appendChild(elem);

        return parent;
    }
    static get toolbox () {
        return {
            icon: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-pdf" class="svg-inline--fa fa-file-pdf fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z"></path></svg>',
            text: 'PDF'
        }
    }
    /***
     * @param {FormData} path
     */
    async readPDF(path) {
        let form = new FormData();
        form.append('upload', path);

        fetch('http://localhost:80/extract-text', {
            method: 'POST',
            body: form
        }).then(res => {
            res.text().then(res => {
                if (res === 'Wrong file type uploaded') {
                    alert(res);
                    return;
                }
                this.holder.innerText = res;
            });
        }).catch((err) =>{
            console.error(err);
        });
    }
    setEventListeners () {
        this.holder.addEventListener("focusin", (e) => {
            this.onFocusIn({parent: e.target, target: e.target, settings: this.toolboxSettings});
        })
        this.holder.addEventListener("focusout", (e) => {
            this.onFocusOut({parent: e.target, target: e.target, settings: this.toolboxSettings});
        })
    }
    get toolboxSettings () {
        return {
            Upload: '',
        }
    }
    save () {
        return {
            text: this.holder.innerText
        }
    }
    render () {
        return this.holder;
    }
    setFocus () {
        this.holder.focus();
    }
};