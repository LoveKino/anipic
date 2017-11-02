'use strict';

const {
    headlessOpen
} = require('./util');
const assert = require('assert');
const {
    executeCommandWithImages,
    executeCommandsWithImages
} = require('..');

describe('index', () => {
    it('executeCommandWithImages', () => {
        return executeCommandWithImages('echo "123"', {}, {
            captureOptions: {
                open: headlessOpen
            }
        }).then(({
            images,
            commandResult
        }) => {
            assert.equal(commandResult.stdout, '123\n');
            assert.equal(images.length, 2);
        });
    });

    it('executeCommandsWithImages', () => {
        return executeCommandsWithImages(['echo "123"'], {}, {
            captureOptions: {
                open: headlessOpen
            }
        }).then(({
            images,
            commandResults
        }) => {
            assert.equal(commandResults[0].stdout, '123\n');
            assert.equal(images.length, 2);
        });
    });
});
