import CheckList from "../createArticle/js 1/Article/Module/CheckList.js";
import Divider from "../createArticle/js 1/Article/Module/Divider.js";
import Downloadable from "../createArticle/js 1/Article/Module/Downloadable.js";
import { PDFExtract } from "../createArticle/js 1/Article/Module/extractPdf.js";
import { Header } from "../createArticle/js 1/Article/Module/Header.js";
import { ImageArticle } from "../createArticle/js 1/Article/Module/image.js";
import List from "../createArticle/js 1/Article/Module/List.js";
import { Paragraph } from "../createArticle/js 1/Article/Module/Paragraph.js";
import { Spacing } from "../createArticle/js 1/Article/Module/Spacing.js";
import ArticleBuilder from "../createArticle/js 1/ArticleBuilder/ArticleBuilder.js";
import ArticleAPI from "./utils/ArticleAPI.js";

async function App () {
    document.querySelector("#addBtn").addEventListener("click", () => {
        window.location.href = "/createArticle/createArticle.html";
    })
    const app = document.querySelector("#articleRender");
    const articles = ArticleAPI.getArticles("articles") || [];

    articles.map(article => {
        let newArticle = new ArticleBuilder(
            {
                readOnly: true,
                descriptionMode: true,
                holder: document.querySelector("#articleRender"),
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
                },
                data: article,
                callback: function() {
                    document.querySelector('#articleRender').innerHTML = "";
                    renderFullPage(article);
                },
                editorMode: false,
                sidenavMode: true
            },
        );
        if (app.childNodes.length > 1) {
            app.insertBefore(newArticle.render(), app.childNodes[2]);
        }else {
            app.appendChild(newArticle.render());
        }
    })
}

function renderFullPage(article) {
    let newArticle = new ArticleBuilder(
        {
            readOnly: true,
            descriptionMode: false,
            holder: document.querySelector("#articleRender"),
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
            },
            data: article,
            callback: function() {
                location.reload();
            },
            editorMode: false
        },
    );
    document.querySelector('#articleRender').innerHTML = "";
    document.querySelector('#articleRender').appendChild(newArticle.render());
    window.scrollTo(0, 0)
}

App();