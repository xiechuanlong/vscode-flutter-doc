const { print } = require('util');
const vscode = require('vscode');
const { commands } = vscode;
const { getExtension } = require('./helper');

class FlutterDocController {
    constructor(context, view, docUrl) {
        this.context = context;
        this.view = view;
        this.docUrl = docUrl;
        // 监听vscode事件
        let disposable = commands.registerCommand('flutterDoc.show', () => {
            this.view.show({ docUrl: this.docUrl });
        });

       context.subscriptions.push(disposable);
    }
    dispose() {
        this.view.dispose();
    }
}
module.exports = FlutterDocController;
