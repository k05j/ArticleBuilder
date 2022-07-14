let amountOfModals = 0;

export default class inputModal {
    /***
     * @param {Object} data
     * @param {String} settings
     * @param {Function} input
     */
    constructor({data, settings}, {gotInput} = {}, {moreComplex = false} = {}) {
        amountOfModals++;
        this.data = data;
        this.typeOfInput = this.validateSettings(settings);
        this.inputFunction = gotInput;
        this.moreComplex = moreComplex;
        this.modal = this.setUpModal();
        this.button = this.setUpButton();

        if (!this.button) return;

        document.body.appendChild(this.modal);
        this.finalInputButton = this.modal.querySelector('.uploadJS-uploadBtn');
        this.modalInput = this.modal.querySelector('.uploadJS-input');

        this.finalInputButton.addEventListener('click', () => {
            if (typeof gotInput === 'function') {
                this.inputFunction(this.modalInput);
            }else {
                console.error('Wrong datatype of parameter ' + typeof input);
            }
        })

    }
    validateSettings(string) {
        if (!['number', 'color'].includes(string)) {
            return '';
        }
        return string;
    }
    setUpModal() {
        let modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute("id", 'input' + amountOfModals);
        modal.setAttribute("aria-labelledby", 'input' + amountOfModals);
        modal.setAttribute("aria-hidden", "true");
        modal.setAttribute("role", "dialog");

        if (this.moreComplex === false || this.moreComplex === {}) {
            modal.innerHTML = `
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Input</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <input class="uploadJS-input form-control" type='${this.typeOfInput}'>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary uploadJS-uploadBtn">Confirm</button>
                        </div>
                    </div>
                </div>
            `
        }else {
            modal.innerHTML = `
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Input</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <select class="form-select uploadJS-input">
                                    <option selected>Select your design</option>
                                    <option value="stars">Stars</option>
                                    <option value="arrows">Arrows</option>
                                    <option value="dotted">Dotted</option>
                                    <option value="content">Content</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary uploadJS-uploadBtn">Confirm</button>
                        </div>
                    </div>
                </div>
            `
        }

        return modal;
    }
    setUpButton() {
        let tempBtn = this.data.domButton || document.querySelector("#" + 'notFound');

        if(!tempBtn) {
            console.warn('Not found');
            return;
        }else {
            tempBtn.innerText = this.data.text;
        }
        
        tempBtn.type = "button";
        tempBtn.setAttribute("data-bs-toggle", 'modal');
        tempBtn.setAttribute("data-bs-target", '#input' + amountOfModals);

        return tempBtn;
    }
}