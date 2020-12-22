const FlutterDocController = require('./src/flutter_doc_controller');
const View = require('./src/view');
const vscode = require('vscode');

const docUrl = 'https://book.flutterchina.club/chapter1/install_flutter.html';
function activate(context) {
  try {
    const webView = new View({ context });
    let esdoc = new FlutterDocController(context, webView, docUrl);

    context.subscriptions.push(esdoc);
  } catch (error) {
    console.error(error);
  }
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
