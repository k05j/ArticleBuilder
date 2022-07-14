export default class UploadJS {
    /**
     * 
     * @param {string} bindId
     * @param {object} settings
     * @param {object} data
     */

    constructor ({data, settings}, {onUploadClick, onFileChange} = {}) {
        this.settings = UploadJS.checkSettings(settings);
        this.data = this.checkData(data);
       
        this.uploadBtn = this.setUpButton();
        this.uploadModal = this.setUpModal();

        this.onUploadClick = onUploadClick;
        this.onFileChange = onFileChange;

        if(!this.uploadBtn) return;
        document.body.appendChild(this.uploadModal);

        this.uploadModalBtn = this.uploadModal.querySelector(".uploadJS-uploadBtn");
        this.uploadModalInput = this.uploadModal.querySelector(".uploadJS-input")
        
        this.uploadModalBtn.addEventListener("click", () => {
            if(typeof onUploadClick === "function") {
                this.onUploadClick(this.uploadModalInput);
            }
            else {
                console.warn(this.data.lang.errors.onUploadClick)
            }    
        })

        this.uploadModalInput.addEventListener("change", () => {
            if(typeof onFileChange === "function") {
                this.onFileChange(this.uploadModalInput);
            }
        })
    } 
    setUpButton () {
        
        let tempBtn = this.data.domElem || document.querySelector("#" + this.data.bindId);

        if(!tempBtn) {
            console.warn(this.data.lang.errors.noMatchingId + this.data.bindId);
            alert(this.data.lang.errors.noMatchingId + this.data.bindId);
            return;
        }else {
            tempBtn.innerHTML = this.data.text;
        }
        
        tempBtn.type = "button"
        tempBtn.setAttribute("data-bs-toggle", "modal")
        tempBtn.setAttribute("data-bs-target", "#" + this.data.modalId)
        return tempBtn;
    }
    setUpModal () {
        let tempModal = document.createElement("div");
        tempModal.classList.add("modal", "fade")
        tempModal.setAttribute("tabindex", "-1");
        tempModal.setAttribute("id", this.data.modalId);
        tempModal.setAttribute("aria-labelledby", this.data.modalId);
        tempModal.setAttribute("aria-hidden", "true");
        tempModal.setAttribute("role", "dialog");

        tempModal.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${this.data.lang.modalTitle}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <input class="uploadJS-input form-control" type="file" accept="image/*, application/pdf"/>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${this.data.lang.close}</button>
                    <button type="button" class="btn btn-primary uploadJS-uploadBtn">${this.data.lang.upload}</button>
                </div>
            </div>
        </div>
        `

        return tempModal;
    }
    static checkSettings (settings) {
        let newSettings = {};
        if(typeof settings !== "object") {
            settings = {};
        }
        newSettings.defaultLang = UploadJS.getLanguage(settings.defaultLang) || UploadJS.getLanguage("en");

        newSettings.defaultBindId = settings.defaultBindId || "uploadJS";
        newSettings.defaultBtnText = settings.defaultBtnText || newSettings.defaultLang.upload;
        newSettings.defaultModalId = settings.defaultModalId || "uploadModal";

        return newSettings;
    } 
    checkData (data) {
        let newData = {}
        if(typeof data !== "object") {
            data = {};
        }
        
        newData.lang = UploadJS.getLanguage(data.lang) || this.settings.defaultLang;

        newData.bindId = data.bindId || this.settings.defaultBindId;
        newData.text = data.text || newData.lang.upload;
        newData.domElem = data.domElem || false;
        newData.modalId = data.modalId || this.settings.defaultModalId;

        return newData;
    }
    static getLanguage (lang) {

        let ger = {
            upload: "Hochladen",
            close: "Schließen",
            modalTitle: "Wählen Sie eine Datei aus",
            errors: {
                noMatchingId: "Diese Id konnte nicht gefunden werden | id: ",
                onUploadClick: "onUploadClick ist nicht definiert oder ist keine Funktion"
            }
        }
        let en = {
            upload: "upload",
            close: "close",
            modalTitle: "Choose a file",
            errors: {
                noMatchingId: "Can't find id | id: ",
                onUploadClick: "onUploadClick is not defined or not a function"
            }
        }

        switch (lang) {
            case "ger": 
                return ger;
            case "en":
                return en;
        }
        return undefined;
    }
    closeModal () {
        bootstrap.Modal.getInstance(this.uploadModal).hide();
    }
}