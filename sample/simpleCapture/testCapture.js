'use strict';

const {
    capture
} = require('../../');
const path = require('path');
const promisify = require('es6-promisify');
const fs = require('fs');

const writeFile = promisify(fs.writeFile);

function base64ToPNG(data) {
    data = data.replace(/^data:image\/png;base64,/, '');
    return writeFile(path.resolve(__dirname, './image.png'), data, 'base64');
}

capture('terminal', [{
    user: 'root',
    cwd: '/home/yuer',
    command: 'ls',
    output: 'workspace fun'
}]).then((data) => {
    return base64ToPNG(data);
});
