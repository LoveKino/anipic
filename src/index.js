'use strict';

const {
    capture
} = require('./capture');

const {
    imagesToGif,
    exec
} = require('./util');

const OS = require('os');

const executeCommandWithImages = (command, options, {
    executor,
    captureOptins,
    history = []
} = {}) => {
    executor = executor || exec;
    let user = OS.userInfo().username;
    let cwd = (options && options.cwd) || process.cwd();

    return capture('terminal', history.concat([{
        user,
        cwd,
        command,
        output: ''
    }]), captureOptins).then((startImg) => {
        return executor(command, options).then((commandResult) => {
            let output = commandResult.stdout || commandResult.stderr;
            let commandState = {
                user,
                cwd,
                command,
                output
            };

            // TODO current cwd
            return capture('terminal', history.concat([commandState, {
                user,
                cwd,
                command: '',
                output: ''
            }])).then((endImg) => {
                return {
                    images: [startImg, endImg],
                    commandResult,
                    commandState
                };
            });
        });
    });
};

const executeCommandsWithImages = (commands, options, {
    executor,
    captureOptins,
    history = []
} = {}) => {
    if (!commands.length) {
        return Promise.resolve({
            images: [],
            commandResults: []
        });
    }

    return executeCommandWithImages(commands[0], options, {
        executor,
        captureOptins,
        history
    }).then((item) => {
        return executeCommandsWithImages(commands.slice(1), options, {
            executor,
            captureOptins,
            history: history.concat([item.commandState])
        }).then((prev) => {
            return {
                images: item.images.concat(prev.images),
                commandResults: prev.commandResults.concat([item.commandResult])
            };
        });
    });
};

module.exports = {
    capture,
    imagesToGif,
    executeCommandWithImages,
    executeCommandsWithImages
};
