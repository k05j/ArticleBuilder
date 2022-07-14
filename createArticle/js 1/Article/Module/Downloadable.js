export default class Downloadable {
    /**
     * @param {object} data
     */
     constructor ({data, readonly = false}, {onFocusIn, onFocusOut} = {}) {
        this.css = "kg-article-downloadable";
        this.data = data || {};
        this.readonly = readonly;
        this.holder = Downloadable.createDownloadable(this.data.text || "", !readonly, this.css, this.data);

        this.onFocusIn = onFocusIn || function () {};
        this.onFocusOut = onFocusOut || function () {};

        if(!this.readonly) {
            this.setEventListeners();
        }
    }
    static createDownloadable (text, readonly, css, data) {
        //now the real element is created. this has the effect that even though we change the paragraph/header etc. the parent holder with all the event listeners remains the same
        let downloadable = document.createElement('div');
        downloadable.setAttribute('style', 'text-align: center;');

        let linkToDownload = document.createElement('a');
        linkToDownload.setAttribute('download', '');
        linkToDownload.setAttribute('href', '');
        if (data.attributes) {
            linkToDownload.setAttribute('href', data.attributes.href);
        }

        let icon = document.createElement('img');
        icon.setAttribute('src', '../../Wahlen/pdf.jpg');
        icon.style.width = '5%';

        linkToDownload.appendChild(icon);

        downloadable.setAttribute('contenteditable', String(readonly));
        downloadable.innerText = text;
        downloadable.classList.add(css);

        downloadable.appendChild(linkToDownload);

        return downloadable;
    }
    static get toolbox () {
        return {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            width="64" height="64"
            viewBox="0 0 172 172"
            style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ffffff"><path d="M149.06667,43.49272l-43.49272,-43.49272h-82.64061v172h126.13333zM108.93333,19.57394l20.55939,20.55939h-20.55939zM34.4,160.53333v-149.06667h63.06667v40.13333h40.13333v108.93333z"></path><path d="M91.73333,122.69626v-48.16292h-11.46667v48.16292l-15.21518,-13.75731l-7.68737,8.51039l28.63588,25.88399l28.63588,-25.88399l-7.68737,-8.51039z"></path></g></g></svg>`,
            text: "Downloadable"
        }
    }
    get toolboxSettings () {
        return {
            File_Download: ''
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
        const attributeNodeArray = [...this.holder.childNodes[0].attributes];

        const attrs = attributeNodeArray.reduce((attrs, attribute) => {
            attrs[attribute.name] = attribute.value;
            return attrs;
        }, {});
        return {
            text: '',
            style: this.holder.getAttribute('style'),
            attributes: attrs
        }
    }
    setFocus () {
        this.holder.focus();
    }
}