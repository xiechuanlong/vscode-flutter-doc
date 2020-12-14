const axios = require('axios');
const jsdom = require('jsdom');

class DocumentationProvider {
    fetchResource(url) {
        return axios.get(url);
    }

    parseDocumentation(rawHtml) {
        return new jsdom.JSDOM(rawHtml);
    }

    async getDoc(url) {
        const rawHtml = await this.fetchResource(url);
        const jsdom = await this.parseDocumentation(rawHtml.data);
        return rawHtml.data;
    }
}

module.exports = DocumentationProvider;
