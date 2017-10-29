'use strict';

let {
    SPA
} = require('kabanery-lumine/lib/page/flowPfcSPA');
let pageSignalActionMap = require('./pageSignalAction');
let pageViewMap = require('./pageView');


SPA({
    
    pageViewMap,
    pageSignalActionMap,
    pageOptionsMap: {
        indexPage: {
            localStateStore: false,
            localStateStoreWhiteList: []
        }
    },
    defaultPage: 'indexPage'
});