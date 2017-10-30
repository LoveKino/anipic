'use strict';

const {
    CommandCapture,
    imagesToGif
} = require('../..');

let commandCapture = new CommandCapture();
commandCapture.exec('ls').then(() => {
    return commandCapture.exec('pwd');
}).then(() => {
    imagesToGif(commandCapture.images, 'myanimated.gif');
});
