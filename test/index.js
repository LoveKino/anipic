'use strict';

const assert = require('assert');
const {
    executeCommandWithImages,
    executeCommandsWithImages
} = require('..');

describe('index', () => {
    it('executeCommandWithImages', () => {
        return executeCommandWithImages('echo "123"').then(({
            images,
            commandResult
        }) => {
            assert.equal(commandResult.stdout, '123\n');
            assert.equal(images.length, 2);
        });
    });

    it('executeCommandsWithImages', () => {
        return executeCommandsWithImages(['echo "123"']).then(({
            images,
            commandResults
        }) => {
            assert.equal(commandResults[0].stdout, '123\n');
            assert.equal(images.length, 2);
        });
    });
});
