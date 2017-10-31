'use strict';

const {
    CommandCapture,
    imagesToGif
} = require('../..');

let commandCapture = new CommandCapture();
let options = {
    cwd: __dirname
};
commandCapture.exec('ls', options).then(() => {
    return commandCapture.exec('pwd', options);
}).then(() => {
    return commandCapture.exec('cat package.json', options);
}).then(() => {
    return commandCapture.exec('cat test.js', options);
}).then(() => {
    imagesToGif(commandCapture.images, __dirname + '/myanimated.gif');
});
