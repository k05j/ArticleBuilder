import UploadJS from "../../../js 2/uploadJS.js";
import { PDFExtract } from '../Module/extractPdf.js';
import {ImageArticle} from '../Module/image.js';
import inputModal from "../../../js 2/inputModal.js";
import Divider from "./Divider.js";

let previousElementForToolbox = '';

export class Toolbox {
    /***
     * @param {String} type //used to specify the type of the toolbox
     * @param {Object} options //the buttons needed (just as color, size e.g)
     * @param {Object} currElement //the element on which to bind the toolbox
     * @param {Object} currSidenav sidenav class to handle the toolbox render
     */
    constructor({type, options, currElement = '', currSidenav = ''}) {
        this.options = options;
        this.currentElement = currElement;
        this.sidenav = currSidenav;
        this.amountOfButtons = Toolbox.createToolbox(this.options, currElement, this.sidenav);

        this.currentElement.classList.add('kg-article-highlighted');

        //if it is the first time assign the previousElement
        if (previousElementForToolbox === '') previousElementForToolbox  = this.currentElement;
        //if it is a further time, remove the old element and add the new one
        if (previousElementForToolbox !== this.currentElement) {
            previousElementForToolbox.classList.remove('kg-article-highlighted');
            previousElementForToolbox = this.currentElement;
        }
    }
    static createToolbox(options, currElement, sidenav) {
        //loop throught every old sidenav button and hide it, therefore there is space for the toolbox
        let currentToolbox = sidenav.wrapper.querySelector("." + sidenav.css.toolbox);
        currentToolbox.innerHTML = "";
        

        let backBtn = document.createElement("button");
        backBtn.classList.add(...["sidenav-toolbox"]);
        backBtn.style.border = "none";
        backBtn.style.backgroundColor = "#eb4034"
        backBtn.innerHTML = "Back";

        backBtn.addEventListener("click", () => {
            if(document.querySelector(".kg-article-highlighted"))
                document.querySelector(".kg-article-highlighted").classList.remove("kg-article-highlighted");
            sidenav.wrapper.querySelector("." + sidenav.css.toolbox).innerHTML = "";
            sidenav.createItems();
        })

        currentToolbox.appendChild(backBtn);
        
        

        let buttons = {
            amount: 0,
            btns: [],
            active: false
        }
        for (let key in options) {
            buttons.amount++;

            let toolbx = document.createElement('div');
            toolbx.classList.add('sidenav-toolbox');
            toolbx.setAttribute('draggable', false);

            let button = document.createElement('div');
            button.innerText = key;
            button.classList.add('toolbox-text');

            toolbx.addEventListener('click', e => {
                let lookUpIdx = {
                    'Color': 0,
                    'Level': 1,
                    'Font_Size': 2,
                    'Style': 3,
                    'MakeResizeable': 4,
                    'Upload': 5,
                    'Bold': 6,
                    'Italics': 7,
                    'Underlined': 8,
                    'File_Download': 9,
                    'Center': 10
                };
                switch(lookUpIdx[button.innerHTML]) {
                    case 0:
                        changeColor(currElement, button);
                        break;

                    case 1:
                        changeLevel(currElement, button);
                        break;

                    case 2:
                        changeFont_Size(currElement, button);
                        break;

                    case 3:
                        changeStyle(currElement, button);
                        break;

                    case 4:
                        makeResizeable(currElement);
                        break;

                    case 5:
                        upload(currElement, button);
                        break;

                    case 6:
                        bold(currElement);
                        break;
                    
                    case 7:
                        italics(currElement);
                        break;

                    case 8:
                        underlined(currElement);
                        break;

                    case 9:
                        download(currElement, button);
                        break;

                    case 10:
                        centerText(currElement);
                        break;

                    default:
                        alert('Error! Bitte kontaktieren Sie KG-Development');
                        return;

                }
            });
            toolbx.appendChild(button);
            currentToolbox.appendChild(toolbx);
            buttons.btns.push(button);
        }
        return buttons;
    }
    removeBox() {
        sidenav.wrapper.querySelector("." + sidenav.css.toolbox).innerHTML = "";
        this.currentElement.classList.remove('kg-article-highlighted');
        this.previousElementForToolbox = '';
    }
}

const centerText = (element) => {
    element.setAttribute('style', `${cloneAttributeStringAndInsertValue(element, `text-align: center; margin: 0 auto;`)}`);
}

const underlined = (element) => {
    element.setAttribute('style', `${cloneAttributeStringAndInsertValue(element, `text-decoration: underline;`)}`);
}

const italics = (element) => {
    element.setAttribute('style', `${cloneAttributeStringAndInsertValue(element, `font-style: italic;`)}`);
}

const bold = (element) => {
    element.setAttribute('style', `${cloneAttributeStringAndInsertValue(element, `font-weight: bold;`)}`);
}

const changeColor = (element, button) => {
    let input = new inputModal(
        {
            data: {
                domButton: button,
                text: 'Color'
            },
            settings: 'color'
        },
        {
            gotInput(input) {
                element.setAttribute('style', `${cloneAttributeStringAndInsertValue(element, `color: ${input.value};`)}`);
            }
        }
    );
    button.click();
}

const cloneAttributeStringAndInsertValue = (element, additionalValue) => {
    let attributeString = element.getAttribute('style') || '';

    if (attributeString.includes(additionalValue)) {
        attributeString = attributeString.replace(additionalValue, '').trim();
        return attributeString;
    }
    attributeString += `${additionalValue}`;

    return attributeString;
}

//the whole purpose of this function is to change the level of any given header
const changeLevel = (element, button) => {
    //calling the input class (any input)
    let input = new inputModal(
        {
            data: {
                domButton: button,
                text: 'Level'
            },
            settings: 'number',
        },
        {
            gotInput(input) {
                let level = input.valueAsNumber;
                if (![1, 2, 3, 4, 5, 6].includes(level)) {
                    return;
                }
                let newHeader = document.createElement(`h${level}`);
    
                cloneAttributes(newHeader, element);

                newHeader.innerHTML = element.innerHTML;

                //now let's remove the highlighted class, as the new element won't be in focus anyway
                newHeader.classList.remove('kg-article-highlighted');
                //we now replace the header from the old parent
                document.querySelector('.kg-article-highlighted').replaceWith(newHeader);
            }
        }
    );
    button.click();
}

function cloneAttributes(target, source) {
    [...source.attributes].forEach( attr => { target.setAttribute(attr.nodeName ,attr.nodeValue) })
  }

const changeFont_Size = (element, button) => {
    let input = new inputModal(
        {
            data: {
                domButton: button,
                text: 'Font_Size'
            },
            settings: 'number',
        },
        {
            gotInput(input) {
                element.setAttribute('style', `${cloneAttributeStringAndInsertValue(element, `font-size: ${input.value}px;`)}`);
            }
        },
        {
            moreComplex: false
        }
    ); 
    button.click();
}

const changeStyle = (element, button) => {
    let input = new inputModal(
        {
            data: {
                domButton: button,
                text: 'Style'
            },
            settings: 'text'
        },
        {
            gotInput(input) {
                let classArray = [...element.classList];

                //delete the article divider classes
                
                for (let i in classArray) {
                    if (['kg-article-divider-stars', 'kg-article-divider-dotted', 'kg-article-divider-arrows', 'kg-article-divider-content'].includes(classArray[i])) {
                        classArray.splice(i, 1);
                    }
                }
                //reset the classlist
                element.classList = "";
                for (let i in classArray) {
                    element.classList.add(classArray[i]);
                }
                //add the new class
                element.classList.add("kg-article-divider-" + input.value);
            }
        },
        {
            moreComplex: true
        }
    )
    button.click();
}

const makeResizeable = (element) => {
    //IMPORTANT: this only works with elements, that are NOT <br/> tags, as br tags are always resizeable, you cannot change that
    element.classList.toggle('resizeable');
}

const upload = (element, button) => {
    let upload = new UploadJS(
        {
            data: {
                lang: "ger",
                domElem: button,
                text: 'Upload'
            }
        },
        {
           onUploadClick (input) {
                if (input.files[0].type === 'application/pdf') {
                    let PDF = new PDFExtract({
                        data: {
                            path: input.files[0]
                        },
                        readonly: false
                    });
                    (async () => {
                        await PDF.readPDF(PDF.data.path);
                        document.querySelector('.kg-article-highlighted').appendChild(PDF.render());  
                    })();
                }else if (['image/png', 'image/jpg', 'image/jpeg'].includes(input.files[0].type)) {
                    let image = new ImageArticle({
                        readonly: false,
                        alreadyThere: false
                    });
                    (async () => {
                        await image.uploadFile(input.files[0]);
                        document.querySelector('.kg-article-highlighted').setAttribute("src", "/image/" + input.files[0].name);
                    })();
                }
           },
           onFileChange (input) {
                
           }
        }
    )
    button.click();
}

const download = (currElement, button) => {
    let upload = new UploadJS(
        {
            data: {
                lang: "ger",
                domElem: button,
                text: 'Upload'
            }
        },
        {
           onUploadClick (input) {
                if (input.files[0].type === 'application/pdf') {
                    let PDF = new PDFExtract({
                        data: {
                            path: input.files[0]
                        },
                        readonly: false
                    });
                    (async () => {
                        await PDF.readPDF(PDF.data.path);
                        document.querySelector('.kg-article-highlighted').childNodes[0].setAttribute('href', '/extract-text/' + input.files[0].name);  
                    })();
                }
           },
           onFileChange (input) {
                
           }
        }
    )
    button.click();
}   