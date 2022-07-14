export default class PartAPI {
    constructor ({block, base, tools}) {
        this.block = block;
        this.base = base;
        this.tools = tools;
    }
    get API_BASE () {
        return this.base + "/blog";
    }
}