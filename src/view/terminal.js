'use strict';

const lumineView = require('kabanery-lumine/lib/util/lumineView');
const n = require('kabanery-lumine/lib/util/n');
const Angle = require('kabanery-lumine/lib/view/cssShapes/angle');

const renderCommand = (command, props) => {
    return n('div', [
        n('div', [
            n('div', {
                style: props.style.userPrompt
            }, command.user),

            n('div', {
                style: props.style.cwdPrompt
            }, [
                n('span', {
                    style: props.style.cwdDirectoryPrompt
                }, '...'),

                command.cwd.split('/').slice(-2).map((item) => {
                    if (item) {
                        return n('span', {
                            style: props.style.cwdDirectoryPrompt
                        }, [
                            Angle({
                                direction: 'right',
                                color: 'white',
                                bold: 2,
                                length: 6
                            }),
                            n('span', {
                                style: {
                                    paddingLeft: 5
                                }
                            }, item)
                        ]);
                    }
                })
            ]),

            command.command && n('div', {
                style: props.style.currentCommand
            }, command.command),

            command.output && n('pre', {
                style: {
                    padding: '0 0 0 5',
                    margin: '1 0 1 0',
                    fontSize: 14
                }
            }, command.output)
        ])
    ]);
};

module.exports = lumineView(({
    props
}) => {
    return n('div', {
        style: props.style.container
    }, [
        props.commands.map((command) => {
            return renderCommand(command, props);
        })
    ]);
}, {
    defaultProps: {
        commands: [{
            user: 'root',
            cwd: '/home/root',
            command: ''
        }],

        style: {
            container: {
                width: 600,
                height: 400,
                backgroundColor: 'rgb(2, 40, 51)',
                color: 'white',
                fontSize: 14
            },

            userPrompt: {
                display: 'inline-block',
                padding: '2 8',
                backgroundColor: 'rgb(20, 136, 173)'
            },

            cwdPrompt: {
                display: 'inline-block',
                padding: '2 8',
                backgroundColor: 'rgb(88, 88, 88)'
            },

            cwdDirectoryPrompt: {
                display: 'inline-block',
                padding: '0 5 0 0'
            },

            currentCommand: {
                display: 'inline-block',
                padding: '0 0 0 5'
            }
        }
    }
});
