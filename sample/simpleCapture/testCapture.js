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
    command: 'test',
    output: `myanimated.gif
    node_modules
    package.json
    test.js
    /Users/yuer/workspaceforme/work/basis/tool/anipic/sample/commandsGif
    {
      "name": "anipic-sample-commandsGif",
      "version": "0.0.1",
      "description": "",
      "main": "index.js",
      "scripts": {
          "test": "echo \\"Error: no test specified\\" && exit 1"
        },
      "author": "",
      "license": "ISC",
      "dependencies": {
          "canvas": "^1.6.7",
          "es6-promisify": "^5.0.0",
          "gifencoder": "^1.1.0"
        },
      "devDependencies": {}
    }
    'use strict';
    
    const {
        CommandCapture,
        imagesToGif
    } = require('../..');
    
    let commandCapture = new CommandCapture();
    commandCapture.exec('ls').then(() => {
        return commandCapture.exec('pwd');
    }).then(() => {
        return commandCapture.exec('cat package.json');
    }).then(() => {
        return commandCapture.exec('cat test.js');
    }).then(() => {
        imagesToGif(commandCapture.images, 'myanimated.gif');
    });
`
}]).then((data) => {
    return base64ToPNG(data);
});
