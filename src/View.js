const vscode = require('vscode');
const DocumentationProvider = require('./documentation_provider');
const EventEmitter = require('events').EventEmitter;
const path = require('path');

class View extends EventEmitter {
    constructor({ context }) {
        super();
        this.context = context;
        this.documentationProvider = new DocumentationProvider();
        this.onPanelDisponse = this.onPanelDisponse.bind(this);
        this.isAddPostMessage = false;
        this.eventMessage = (message) => {
            //接收命令
            let href = message['href'];
            let originUrl = this.docUrl;
            let splitDocUrl = originUrl.split('//');
            let restUrlArr = splitDocUrl[1].split('/');
            let newHref = '';
            if (originUrl.endsWith('.html') || originUrl.endsWith('/')) {
                restUrlArr.pop();
            }
            if (href.includes('../')) {
                restUrlArr.pop();
                href = href.replace('../', '')
            }
            if (href.includes('./')) {
                href = href.replace('./', '')
            }
            newHref = splitDocUrl[0] + '//' + restUrlArr.join('/') + '/' + href;
            console.log(newHref);
            this.show({ docUrl: newHref });

        };
    }
    create(options = {}) {
        this.panel = vscode.window.createWebviewPanel(
            View.CODE,
            View.NAME,
            vscode.ViewColumn.One,
            { enableScripts: true, preserveFocus: true, enableCommandUris: true }
        );
        this.panel.onDidDispose(
            this.onPanelDisponse,
            null,
            this.context.subscriptions
        );
    }
    show({ docUrl }) {
        this.docUrl = docUrl;
        if (!this.panel) {
            this.create();
        }
        if (this.panel && !this.panel.visible) {
            this.panel.reveal(vscode.ViewColumn.Beside, true);
        }
        this.setContent(this.documentationProvider.loading());
        return this.documentationProvider
            .getDoc(docUrl)
            .then((html) => {
                this.setContent(html);
                // 必须要setContent后才可以加通信
                if (!this.isAddPostMessage) {
                    this.panel.webview.onDidReceiveMessage(this.eventMessage, undefined, this.context.subscriptions);

                }
                this.isAddPostMessage = true;
            })
            .catch((error) => {
                this.setContent(
                    `Problem finding docs, Error: ${error.message}`
                );
            });
    }

    setContent(html) {
        this.panel.webview.html = html;
    }

    onPanelDisponse() {
        this.panel = null;
        this.isAddPostMessage = false;
        this.eventMessage = null;
        this.emit('dispose');
    }
}
View.CODE = 'flutter doc';
View.NAME = 'flutter doc';
module.exports = View;
