'use strict';

const browserJsEnv = require('browser-js-env');
const path = require('path');

/**
 * capture picture
 */
let capture = (type, data, options = {}) => {
    if (options.clean === undefined) {
        options.clean = true;
    }
    if (type === 'terminal') {
        return browserJsEnv(`
const n = require('kabanery-lumine/lib/util/n');
const TerminalView = require('${path.join(__dirname, './view/terminal.js')}');
const domtoimage = require('dom-to-image');
const {mount} = require('kabanery');

mount(n('div', {
    id: 'view-container'
}, [
    n(TerminalView, {
        commands: ${JSON.stringify(data)}
    })
]), document.body);

// hack
module.exports = new Promise((resolve) => {
    setTimeout(() => {
        try {
            resolve(domtoimage.toPng(document.getElementById('view-container').childNodes[0]));
        } catch(err) {
            reject(err);
        }
    }, 0);
});
`, options);
    }
};

module.exports = {
    capture
};
