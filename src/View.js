const vscode = require('vscode');
const DocumentationProvider = require('./documentation_provider');
const EventEmitter = require('events').EventEmitter;

class View extends EventEmitter {
    constructor({ context }) {
        super();
        this.context = context;
        this.documentationProvider = new DocumentationProvider();
        this.onPanelDisponse = this.onPanelDisponse.bind(this);
    }
    create(options = {}) {
        this.panel = vscode.window.createWebviewPanel(
            View.CODE,
            View.NAME,
            vscode.ViewColumn.One,
            { enableScripts: true, preserveFocus: true, enableCommandUris: true}
        );
        // Reset when the current panel is closed
        this.panel.onDidDispose(
            this.onPanelDisponse,
            null,
            this.context.subscriptions
        );
    }
    show({ docUrl }) {
        if (!this.panel) {
            this.create();
        }
        if (this.panel && !this.panel.visible) {
            this.panel.reveal(vscode.ViewColumn.Beside, true);
        }

        return this.documentationProvider
            .getDoc(docUrl)
            .then((html) => {
                this.setContent(html);
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
        this.emit('dispose');
    }
}
View.CODE = 'flutter doc';
View.NAME = 'flutter doc';
module.exports = View;
