'use strict';

let SimplePager = require('kabanery-lumine/lib/page/simplePager');
let lumineView = require('kabanery-lumine/lib/util/lumineView');
let n = require('kabanery-lumine/lib/util/n');
let TerminalView = require('../../../../src/view/terminal');

// common views
// let Hn = require('kabanery-lumine/lib/view/layout/hn');
// let Vn = require('kabanery-lumine/lib/view/layout/vn');

/**
 * // some common signals
 * let {KABANERY_DO_RENDER} = require('kabanery-lumine/lib/flow/baseSignalActions');
 */

/**
 *  SimplePager encapsulate notice and loading view.
 *  
 *      .notice.text
 *      .notice.show
 *      .loading.show
 */

/**
 * syncBindWithKeyMap:
 *     sync child props with parent props
 *     demo: n(Input, syncBindWithKeyMap(ctx, {[parent props]: 'value'}, {bindedProps: {}}))
 */

/**
 * deliver signal 
 *     demo: n(Button, {onsignal: onSignalType('click', deliver(ctx, SIGNAL_TYPE))}, 'save')
 */

module.exports = SimplePager(lumineView(() => {
    //
    return n('div', {
        style: {
            padding: 8
        }
    }, [
        n(TerminalView, {
            commands: [{
                user: 'root',
                cwd: '/home/root',
                command: 'ls',
                output: `LICENSE      index.js     package.json src
README.md    node_modules sample       test`
            }, {
                user: 'root',
                cwd: '/home/root',
                command: 'pwd',
                output: '/home/root/.............................................................................'
            }, {
                user: 'root',
                cwd: '/home/root',
                command: 'npm i',
                output: `up to date in 5.365s
                npm WARN docway-cli-sample-api-quickstart@0.0.1 No description
                npm WARN docway-cli-sample-api-quickstart@0.0.1 No repository field.
                
                up to date in 5.536s
                npm WARN docway-cli-sample-cli-options@0.0.1 No description
                npm WARN docway-cli-sample-cli-options@0.0.1 No repository field.
                
                up to date in 5.565s
                npm WARN docway-cli-sample-api-quickstart@0.0.1 No description
                npm WARN docway-cli-sample-api-quickstart@0.0.1 No repository field.
                
                + docway@0.0.1
                updated 1 package in 15.358s
                npm WARN docway-cli-sample-quickstart@0.0.1 No repository field.
                
                + docway@0.0.1
                updated 1 package in 18.408s
                npm WARN docway-cli-sample-cli-options@0.0.1 No description
                npm WARN docway-cli-sample-cli-options@0.0.1 No repository field.
                
                + docway@0.0.1
                updated 1 package in 18.124s
                ## test
                
                Usage: docway
                    --config [config js file]
                
                
                Options:
                  --version   Show version number                                      [boolean]
                  -h, --help  Show help                                                [boolean]`
            }]
        })
    ]);
}, {
    defaultProps: {}
}));
