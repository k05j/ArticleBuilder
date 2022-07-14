import { Header } from "./js 1/Article/Module/Header.js";
import { Paragraph } from "./js 1/Article/Module/Paragraph.js";
import  List  from './js 1/Article/Module/List.js';
import  Divider from "./js 1/Article/Module/Divider.js";
import { ImageArticle } from './js 1/Article/Module/image.js';
import { PDFExtract } from "./js 1/Article/Module/extractPdf.js";
import { Spacing } from "./js 1/Article/Module/Spacing.js";
import ArticleBuilder from "./js 1/ArticleBuilder/ArticleBuilder.js";
import CheckList from "./js 1/Article/Module/CheckList.js";
import Downloadable from './js 1/Article/Module/Downloadable.js';
import Settings from "./js 1/Article/Settings/Settings.js";
import ArticleAPI from "../utils/ArticleAPI.js";

const App = () => {
    let ab = new ArticleBuilder(
        {
            holder: document.querySelector("#app"),
            tools: {
                paragraph: {
                    class: Paragraph,
                    allowToolbox: true
                },
                header: {
                    class: Header,
                    allowToolbox: true
                },
                list: {
                    class: List,
                    allowToolbox: true
                },
                divider: {
                    class: Divider,
                    allowToolbox: true
                },
                image: {
                    class: ImageArticle,
                    allowToolbox: true
                },
                pdf: {
                    class: PDFExtract,
                    allowToolbox: true
                },
                checklist: {
                    class: CheckList,
                    allowToolbox: true
                },
                spacing : {
                    class: Spacing,
                    allowToolbox: true
                },
                downloadable: {
                    class: Downloadable,
                    allowToolbox: true
                }
            }
        }
    );
    document.querySelector("#app").appendChild(ab.render());

    ab.onArticleChange = (id) => {
        loadNewArticle(ab, id);
    }
}

async function loadNewArticle(ab, id) {
        if(id === undefined) {
            window.location.reload();
        }
        ab.remove();
        ab = undefined;
        let article = ArticleAPI.getArticleById("articles", id);
        ab = new ArticleBuilder(
            {
                holder: document.querySelector("#app"),
                tools: {
                    paragraph: {
                        class: Paragraph,
                        allowToolbox: true
                    },
                    header: {
                        class: Header,
                        allowToolbox: true
                    },
                    list: {
                        class: List,
                        allowToolbox: true
                    },
                    divider: {
                        class: Divider,
                        allowToolbox: true
                    },
                    image: {
                        class: ImageArticle,
                        allowToolbox: true
                    },
                    pdf: {
                        class: PDFExtract,
                        allowToolbox: true
                    },
                    checklist: {
                        class: CheckList,
                        allowToolbox: true
                    },
                    spacing : {
                        class: Spacing,
                        allowToolbox: true
                    },
                    downloadable : {
                        class: Downloadable,
                        allowToolbox: true
                    }
                },
                data: article
            },
        );
        ab.onArticleChange = (id) => {
            ab = loadNewArticle(ab, id);
        }
        document.querySelector("#app").appendChild(ab.render());
        return ab;
}

App();