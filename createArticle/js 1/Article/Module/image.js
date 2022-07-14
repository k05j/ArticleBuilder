import hostname from './host.js';

export class ImageArticle {
    constructor({data, readonly = false, alreadyThere = true}, {onFocusIn, onFocusOut} = {}) {
        this.css = {
            image: 'kg-article-image__content',
            wrapper: "kg-article-image"
        };
        this.data = data || {};
        this.readonly = readonly;

        this.holder = ImageArticle.createImage(this.data.url || 'https://via.placeholder.com/300.png?text=Click+to+edit', this.css);
        

        if(!this.readonly) {
            this.setEventListeners();
        }
    }
    async uploadFile(path) {
        let form = new FormData();
        form.append('upload', path);
        let response = await fetch(`${hostname}/image`, {
            method: 'POST',
            headers: {
                "Content-Length": path.size
            },
            body: form
        })
        return path;   
    }
    static createImage (url, css) {
        let element = document.createElement('div');
        element.classList.add(css.wrapper)
        element.style.textAlign = "center"; 
        element.tabIndex = -1;
        
        let img = document.createElement('img');
        img.classList.add(css.image);
        img.setAttribute('src', url);
        element.appendChild(img);

        return element;
    }
    static get toolbox () {
        return {
            icon: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="image" class="svg-inline--fa fa-image fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"></path></svg>',
            text: 'Image'
        }
    }
    setEventListeners () {
        this.holder.addEventListener("focusin", (e) => {
            this.onFocusIn({parent: e.target, target: this.holder.lastChild, settings: this.toolboxSettings});
        })
        this.holder.addEventListener("focusout", (e) => {
            this.onFocusOut({parent: e.target, target: this.holder.lastChild, settings: this.toolboxSettings});
        })
    }
    render () {
        return this.holder;
    }
    get toolboxSettings () {
        return {
            MakeResizeable: 'false',
            Upload: ''
        }
    }
    save () {
        return {
            url: this.holder.childNodes[0].getAttribute('src'),
            width: "200px",
            heigh: "100px"
        }
    }
    setFocus () {
        this.holder.focus();
    }
}