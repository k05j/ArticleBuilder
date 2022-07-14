
export default class Modal {
    
    /**
     * @param {Object} data
     * @param {Object} holder   
     * @param {String} apiBase  
     * @param {String} id       
     * @param {Object} config  
     * 
     * @param {Function} onload
     */
    constructor({data, holder, apiBase, id, config = {}} = {}, {onLoad} = {}) {
        this.data = data || {};
        this.onLoad = onLoad || function () {};
        this.holder = holder || undefined;
        this.apiBase = apiBase || undefined;
        this.config = config || {};

        
        (async () => {
            this.id = id || await this.getId();
            
            this.wrapper = this.setUpModal();
            
            if(this.holder) {
                this.holder.appendChild(this.wrapper);
                this.modal = new bootstrap.Modal(this.wrapper, this.config);
            }
            
            if(this.data.header) this.data.header.map(header => this.modalHeader.appendChild(this.createModalItem(header)));
            if(this.data.closeBtn) this.modalHeader.appendChild(this.createModalItem({type: "button", classList: ["btn-close"], attributes: {"data-bs-dismiss": "modal", "aria-label": "Close"}}))
            if(this.data.body) this.data.body.map(body => this.modalBody.appendChild(this.createModalItem(body)));
            if(this.data.footer) this.data.footer.map(footer => this.modalFooter.appendChild(this.createModalItem(footer)));
            this.onLoad();
        })();
    }

    //Sets up the modal wrapper
    setUpModal() {
        let modal = document.createElement('div');
        modal.classList.add(this.CSS.mdoal, 'fade');
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute("id", this.id);
        modal.setAttribute("aria-labelledby", this.id);
        modal.setAttribute("aria-hidden", "true");
        modal.setAttribute("role", "dialog");

        modal.innerHTML = `
        <div class="${this.CSS.modalDialog}" role="document">
            <div class="${this.CSS.modalContent}">
                <div class="${this.CSS.modalHeader}">
                    <h5 class="${this.CSS.modalTitle}">${this.data.title || ""}</h5>
                </div>
                <div class="${this.CSS.modalBody}">
                   
                </div>
                <div class="${this.CSS.modalFooter}">
                    
                </div>
            </div>
        </div>
        `
        return modal;
    }

    createModalItem (config) {

        if(!config || typeof config !== "object") return;

        let elem = document.createElement(config.type || "div");
        
        if(config.classList || Array.isArray(config.classList)) {
            elem.classList.add(...config.classList);
        }
        if(config.innerHTML) {
            elem.innerHTML = config.innerHTML;
        }
        for(let key in config.styles) {
            elem.style[key] = config.style[key];
        }
        for(let key in config.attributes) {
            elem.setAttribute(key, config.attributes[key]);
        }
        if(Array.isArray(config.events)) {
            config.events.map(event => {
                elem.addEventListener(event.type, event.callback);
            });
        }
        
        return elem;
        
    }

    get modalHeader () {
        return this.wrapper.querySelector("." + this.CSS.modalHeader);
    }

    get modalTitle () {
        return this.wrapper.querySelector("." + this.CSS.modalTitle);
    }

    get modalBody () {
        return this.wrapper.querySelector("." + this.CSS.modalBody);
    }

    get modalFooter () {
        return this.wrapper.querySelector("." + this.CSS.modalFooter);
    }

    //returns css
    get CSS () {
        return {
            mdoal: "modal",
            modalDialog: "modal-dialog",
            modalContent: "modal-content",
            modalHeader: "modal-header",
            modalBody: "modal-body",
            modalTitle: "modal-title",
            modalFooter: "modal-footer"
        }
    }

    //If there is no holder you can also render it
    render () {
        return this.wrapper;
    }

    //Gets from the server a id
    async getId() {
        // let response = await fetch(this.apiBase + "/uuid");
        // if(response.ok)
        //     return await response.json();
        return Math.random() * 100000;
    }
}