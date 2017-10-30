'use strict';

const {
    executeCommandsWithImages,
    imagesToGif
} = require('../..');

executeCommandsWithImages(['ls', 'pwd']).then(({
    images
}) => imagesToGif(images, 'myanimated.gif'));
