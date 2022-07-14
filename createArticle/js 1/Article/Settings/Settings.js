import ArticleAPI from "../../../../utils/ArticleAPI.js";
import hostname from "../Module/host.js";

export default class Settings {
   constructor ({readOnly = false} = {}) {
       
    }

    static async getSelectArticle () {
        return ArticleAPI.getArticles("articles");
    }
} 
