export default class ArticleAPI {
    static getArticles (key) {
        let articles = localStorage.getItem(key);
        if(!articles) return [];
        return JSON.parse(articles);
    }
    static putArticle (key, obj) {
        let prevArticle = ArticleAPI.getArticles(key);
        prevArticle.push(obj);
        ArticleAPI.saveArticle(key, prevArticle);

    }
    static saveArticle (key, storage) {
        localStorage.setItem(key, JSON.stringify(storage));
    }

    static getArticleById (key, id) {
        let articles = ArticleAPI.getArticles(key);
        const targetArticle = articles.find(article => article.id === id);

        if(!targetArticle) return {};
        return targetArticle;
    }

    static deleteArticleById (key, id) {
        let articles = ArticleAPI.getArticles(key);
        const targetArticle = articles.find(article => article.id === id);
        
        if(!targetArticle) return;
        articles.splice(articles.indexOf(targetArticle), 1);
        localStorage.setItem(key, JSON.stringify(articles));
    }

    static updateArticle (key, obj) {
        let articles = ArticleAPI.getArticles(key);
        const targetArticle = articles.find(article => article.id === obj.id);

        if(!targetArticle) return;
        articles[articles.indexOf(targetArticle)] = {...obj};
        localStorage.setItem(key, JSON.stringify(articles));
    }
}