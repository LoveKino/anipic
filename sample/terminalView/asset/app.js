/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 37);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * basic types
 */

let truth = () => true;

let isUndefined = v => v === undefined;

let isNull = v => v === null;

let isFalsy = v => !v;

let likeArray = v => !!(v && typeof v === 'object' && typeof v.length === 'number' && v.length >= 0);

let isArray = v => Array.isArray(v);

let isString = v => typeof v === 'string';

let isObject = v => !!(v && typeof v === 'object');

let isFunction = v => typeof v === 'function';

let isNumber = v => typeof v === 'number' && !isNaN(v);

let isBool = v => typeof v === 'boolean';

let isNode = (o) => {
    return (
        typeof Node === 'object' ? o instanceof Node :
        o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
    );
};

let isPromise = v => v && typeof v === 'object' && typeof v.then === 'function' && typeof v.catch === 'function';

let isRegExp = v => v instanceof RegExp;

let isReadableStream = (v) => isObject(v) && isFunction(v.on) && isFunction(v.pipe);

let isWritableStream = v => isObject(v) && isFunction(v.on) && isFunction(v.write);

/**
 * check type
 *
 * types = [typeFun]
 */
let funType = (fun, types = []) => {
    if (!isFunction(fun)) {
        throw new TypeError(typeErrorText(fun, 'function'));
    }

    if (!likeArray(types)) {
        throw new TypeError(typeErrorText(types, 'array'));
    }

    for (let i = 0; i < types.length; i++) {
        let typeFun = types[i];
        if (typeFun) {
            if (!isFunction(typeFun)) {
                throw new TypeError(typeErrorText(typeFun, 'function'));
            }
        }
    }

    return function() {
        // check type
        for (let i = 0; i < types.length; i++) {
            let typeFun = types[i];
            let arg = arguments[i];
            if (typeFun && !typeFun(arg)) {
                throw new TypeError(`Argument type error. Arguments order ${i}. Argument is ${arg}. function is ${fun}, args are ${arguments}.`);
            }
        }
        // result
        return fun.apply(this, arguments);
    };
};

let and = (...args) => {
    if (!any(args, isFunction)) {
        throw new TypeError('The argument of and must be function.');
    }
    return (v) => {
        for (let i = 0; i < args.length; i++) {
            let typeFun = args[i];
            if (!typeFun(v)) {
                return false;
            }
        }
        return true;
    };
};

let or = (...args) => {
    if (!any(args, isFunction)) {
        throw new TypeError('The argument of and must be function.');
    }

    return (v) => {
        for (let i = 0; i < args.length; i++) {
            let typeFun = args[i];
            if (typeFun(v)) {
                return true;
            }
        }
        return false;
    };
};

let not = (type) => {
    if (!isFunction(type)) {
        throw new TypeError('The argument of and must be function.');
    }
    return (v) => !type(v);
};

let any = (list, type) => {
    if (!likeArray(list)) {
        throw new TypeError(typeErrorText(list, 'list'));
    }
    if (!isFunction(type)) {
        throw new TypeError(typeErrorText(type, 'function'));
    }

    for (let i = 0; i < list.length; i++) {
        if (!type(list[i])) {
            return false;
        }
    }
    return true;
};

let exist = (list, type) => {
    if (!likeArray(list)) {
        throw new TypeError(typeErrorText(list, 'array'));
    }
    if (!isFunction(type)) {
        throw new TypeError(typeErrorText(type, 'function'));
    }

    for (let i = 0; i < list.length; i++) {
        if (type(list[i])) {
            return true;
        }
    }
    return false;
};

let mapType = (map) => {
    if (!isObject(map)) {
        throw new TypeError(typeErrorText(map, 'obj'));
    }

    for (let name in map) {
        let type = map[name];
        if (!isFunction(type)) {
            throw new TypeError(typeErrorText(type, 'function'));
        }
    }

    return (v) => {
        if (!isObject(v)) {
            return false;
        }

        for (let name in map) {
            let type = map[name];
            let attr = v[name];
            if (!type(attr)) {
                return false;
            }
        }

        return true;
    };
};

let listType = (type) => {
    if (!isFunction(type)) {
        throw new TypeError(typeErrorText(type, 'function'));
    }

    return (list) => any(list, type);
};

let typeErrorText = (v, expect) => {
    return `Expect ${expect} type, but got type ${typeof v}, and value is ${v}`;
};

module.exports = {
    isArray,
    likeArray,
    isString,
    isObject,
    isFunction,
    isNumber,
    isBool,
    isNode,
    isPromise,
    isNull,
    isUndefined,
    isFalsy,
    isRegExp,
    isReadableStream,
    isWritableStream,

    funType,
    any,
    exist,

    and,
    or,
    not,
    mapType,
    listType,
    truth
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(19);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact
} = __webpack_require__(44);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let styles = (...styleObjects) => {
    return Object.assign({}, ...styleObjects);
};

let isMapObject = (v) => {
    return v && typeof v === 'object' && !Array.isArray(v);
};

let deepMergeMap = (tar, def, path = '', options = {}) => {
    let blackList = options.blackList || [];
    if (blackList.findIndex((item) => item === path) !== -1) {
        return tar;
    }
    if (isMapObject(def)) {
        tar = tar || {};
        if (isMapObject(tar)) {
            for (let name in def) {
                tar[name] = deepMergeMap(tar[name], def[name], path === '' ? name : path + '.' + name, options);
            }
        }
        return tar;
    } else {
        if (tar === undefined) return def;
        return tar;
    }
};

let resolveFnValue = (fn, ...args) => {
    if (typeof fn === 'function') {
        return resolveFnValue(fn(...args));
    }

    return fn;
};

let get = (obj, key = '') => {
    key = key.trim();
    let parts = !key ? [] : key.split('.');

    let partLen = parts.length;
    for (let i = 0; i < partLen; i++) {
        let part = parts[i].trim();
        if (part) {
            obj = obj[part];
        }
    }

    return obj;
};

let set = (obj, key = '', value) => {
    key = key.trim();
    let parts = !key ? [] : key.split('.');
    if (!parts.length) return;
    let parent = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        let part = parts[i];
        part = part.trim();
        if (part) {
            let next = parent[part];
            if (!isObject(next)) {
                next = {};
                parent[part] = next;
            }
            parent = next;
        }
    }

    parent[parts[parts.length - 1]] = value;
    return obj;
};

let isObject = (v) => v && typeof v === 'object';

let likeArray = (v) => v && typeof v === 'object' && typeof v.length === 'number';

module.exports = {
    styles,
    isMapObject,
    deepMergeMap,
    resolveFnValue,
    get,
    set,
    isObject,
    likeArray
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let lumineViewer = __webpack_require__(103);

module.exports = (viewFun, options) => lumineViewer(viewFun)(options);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n,
    parseArgs
} = __webpack_require__(6);

module.exports = (...args) => {
    let tagName = args[0];

    if (typeof tagName === 'string') {
        return n(...args);
    } else { // regard as lumine view
        let {
            attributes,
            childs
        } = parseArgs(args, {
            doParseStyle: false
        });

        return tagName({
            props: attributes,
            children: childs
        });
    }
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(31);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact, reverse, overArgs
} = __webpack_require__(85);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact,
    reverse,
    overArgs
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(43);

/**
 * @readme-doc
 *
 * ## features
 *
 * - simple DOM DSL, construct dom tree quickly
 *
 * - data-driven view, include updating view by data
 *
 * - Just functions, easy to compose
 *
 * [readme-lang:zh]## 特征
 *
 * - 简单的DOM DSL，快速构建DOM结构
 *
 * - 数据驱动视图，包括通过数据更新视图
 *
 * - 以函数为核心，易于复合
 *
 */

/**
 * @readme-quick-run
 *
 * Using method n to construct dom node quickly.
 *
 * [readme-lang:zh]用方法n快速构造dom节点
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {n, mount} = kabanery;
 *
 * mount(n('div', {
 *   id: 'qu',
 *   style: {
 *      backgroundColor: 'red'
 *   }
 * }, [
 *      n('span class=go style="font-size:16px"', 'hello!')
 * ]), document.body);
 *
 * console.log(document.getElementById('qu').outerHTML); // print result
 */

/**
 * @readme-quick-run
 *
 * Basic way to construct a view.
 *
 * [readme-lang:zh]构造一个组件的简单方法
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data) => {
 *      let {type} = data;
 *
 *      return n('div', {
 *         id: 'test1',
 *         style: {
 *            fontSize: 10
 *         }
 *      },[
 *          type === 2 && n('span', 'second'),
 *          type === 3 && n('div', 'third')
 *      ]);
 * });
 *
 * mount(MyView({type: 3}), document.body);
 *
 * console.log(document.getElementById('test1').outerHTML); // print result
 */

/**
 * @readme-quick-run
 *
 * Using update api to update a view.
 *
 * [readme-lang:zh]运用update api去更新一个view
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data, {update}) => {
 *      return n('div', {
 *         id: 'a',
 *         style: {
 *            fontSize: 10
 *         },
 *         onclick: () => {
 *            update('show', !data.show);
 *         }
 *      }, [
 *          data.show && n('div', 'show text')
 *      ]);
 * });
 *
 * mount(MyView({show: false}), document.body);
 *
 * document.getElementById('a').click(); // simulate user action
 * console.log(document.getElementById('a').outerHTML); // print result
 */


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let Signal = (type, data) => {
    return {
        type,
        data
    };
};

let isSignalType = (s, type) => {
    return s.type === type;
};

let onSignalType = (expectType, fn) => (signal, ...rest) => {
    if (isSignalType(signal, expectType)) {
        return fn(signal, ...rest);
    }
};

let deliver = (ctx, type, extra) => (sourceSignal, sourceData, sourceCtx) => {
    ctx.notify(Signal(type, {
        sourceType: 'delivered',
        sourceSignal,
        sourceData,
        sourceCtx,
        extra
    }));
};

module.exports = {
    Signal,
    onSignalType,
    isSignalType,
    deliver
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    reduce
} = __webpack_require__(1);
let {
    funType, isObject, or, isString, isFalsy
} = __webpack_require__(0);

let defineProperty = (obj, key, opts) => {
    if (Object.defineProperty) {
        Object.defineProperty(obj, key, opts);
    } else {
        obj[key] = opts.value;
    }
    return obj;
};

let hasOwnProperty = (obj, key) => {
    if (obj.hasOwnProperty) {
        return obj.hasOwnProperty(key);
    }
    for (var name in obj) {
        if (name === key) return true;
    }
    return false;
};

let toArray = (v = []) => Array.prototype.slice.call(v);

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let set = (sandbox, name = '', value) => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    let parent = sandbox;
    if (!isObject(parent)) return;
    if (!parts.length) return;
    for (let i = 0; i < parts.length - 1; i++) {
        let part = parts[i];
        parent = parent[part];
        // avoid exception
        if (!isObject(parent)) return null;
    }

    parent[parts[parts.length - 1]] = value;
    return true;
};

/**
 * provide property:
 *
 * 1. read props freely
 *
 * 2. change props by provide token
 */

let authProp = (token) => {
    let set = (obj, key, value) => {
        let temp = null;

        if (!hasOwnProperty(obj, key)) {
            defineProperty(obj, key, {
                enumerable: false,
                configurable: false,
                set: (value) => {
                    if (isObject(value)) {
                        if (value.token === token) {
                            // save
                            temp = value.value;
                        }
                    }
                },
                get: () => {
                    return temp;
                }
            });
        }

        setProp(obj, key, value);
    };

    let setProp = (obj, key, value) => {
        obj[key] = {
            token,
            value
        };
    };

    return {
        set
    };
};

let evalCode = (code) => {
    if (typeof code !== 'string') return code;
    return eval(`(function(){
    try {
        ${code}
    } catch(err) {
        console.log('Error happened, when eval code.');
        throw err;
    }
})()`);
};

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let runSequence = (list, params = [], context, stopV) => {
    if (!list.length) {
        return Promise.resolve();
    }
    let fun = list[0];
    let v = fun && fun.apply(context, params);
    if (stopV && v === stopV) {
        return Promise.resolve(stopV);
    }
    return Promise.resolve(v).then(() => {
        return runSequence(list.slice(1), params, context, stopV);
    });
};

module.exports = {
    defineProperty,
    hasOwnProperty,
    toArray,
    get,
    set,
    authProp,
    evalCode,
    delay,
    runSequence
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * @readme-quick-run
 *
 * ## test tar=js r_c=FSM
 *
 *
 * let {
 *     stateGraphDSL, fsm, WAIT, MATCH
 * } = FSM;
 *
 * let {
 *     g, c, union, range, sequence, circle, left, repeat
 * } = stateGraphDSL;
 *
 * let hexDigit = union(range('0', '9'), range('A', 'F'), range('a', 'f'));
 *
 * let escapeSymbols = union('"', '\\', '\/', 'b', 'f', 'n', 'r', 't');
 *
 * let stringDFA = g(
 *     c('"', g('enter',
 *         c('\\', g(
 *             c(escapeSymbols, 'enter'),
 *             c('u',
 *                 g(repeat(hexDigit, 4, 'enter'))
 *             ))),
 *         c('"', 'accept'),
 *         c(left(), 'enter')
 *     )));
 *
 * let m = fsm(stringDFA);
 * console.log(m('"').type === WAIT);
 * console.log(m('a').type === WAIT);
 * console.log(m('b').type === WAIT);
 * console.log(m('"').type === MATCH);
 *
 **/
module.exports = __webpack_require__(73);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    map
} = __webpack_require__(1);
let {
    isObject, isNode
} = __webpack_require__(0);

let parseArgs = __webpack_require__(45);

let parseStyle = __webpack_require__(20);

const KABANERY_NODE = 'kabanery_node';

// TODO general proxy n way

let cn = (elementType) => {
    return (...args) => {
        let {
            tagName, attributes, childs
        } = parseArgs(args);

        if (isKabaneryNode(attributes)) {
            childs = [attributes];
            attributes = {};
        }

        // plugin
        runPlugins(attributes['plugin'], tagName, attributes, childs);

        let {
            attrMap, eventMap
        } = splitAttribues(attributes);

        return {
            tagName,
            attrMap,
            eventMap,
            elementType,
            type: KABANERY_NODE, childNodes: childs,
        };
    };
};

let isKabaneryNode = (v) => isObject(v) && v.type === KABANERY_NODE;

let bindPlugs = (typen, plugs = []) => (...args) => {
    let {
        tagName, attributes, childs
    } = parseArgs(args);

    let oriPlugs = attributes.plugin = attributes.plugin || [];
    attributes.plugin = oriPlugs.concat(plugs);

    let node = typen(tagName, attributes, childs);

    return node;
};

let runPlugins = (plugs = [], tagName, attributes, childExp) => {
    for (let i = 0; i < plugs.length; i++) {
        let plug = plugs[i];
        plug && plug(tagName, attributes, childExp);
    }
};

let splitAttribues = (attributes) => {
    let attrMap = {},
        eventMap = {};
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            eventMap[name.substring(2)] = item;
        } else if (name !== 'plugin') {
            attrMap[name] = item;
        }
    }
    return {
        attrMap,
        eventMap
    };
};

// TODO svg
let toHTML = (node) => {
    if (isNode(node)) {
        return node.outerHTML;
    } else if (isKabaneryNode(node)) {
        let {
            tagName, attrMap, childNodes
        } = node;
        let attrStr = map(attrMap, (value, key) => `${key}="${value}"`).join(' ');
        attrStr = attrStr ? ' ' + attrStr : '';
        return `<${tagName}${attrStr}>${map(childNodes, toHTML).join('')}</${tagName}>`;
    } else {
        return node + '';
    }
};

module.exports = {
    n: cn('html'),
    svgn: cn('svg'),
    cn,
    bindPlugs,
    isKabaneryNode,
    toHTML,
    parseArgs,
    parseStyle
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let uuidv4 = __webpack_require__(21);

let seed = uuidv4();

module.exports = {
    eventMapHook: `__eventMap_${seed}`,
    globalEventTypePrefix: `__event_type_id_${seed}_`,
    stopPropagationFlag: '__stopPropagation'
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    createElement, createSvgElement
} = __webpack_require__(55);

let {
    bindEvents
} = __webpack_require__(13);

let {
    map
} = __webpack_require__(1);

let {
    isKabaneryNode
} = __webpack_require__(10);

let reduceNode = (node) => {
    if (isKabaneryNode(node)) {
        let tarNode = null;
        if (node.elementType === 'html') {
            tarNode = createElement(node.tagName, node.attrMap, map(node.childNodes, reduceNode));
        } else {
            tarNode = createSvgElement(node.tagName, node.attrMap, map(node.childNodes, reduceNode));
        }

        bindEvents(tarNode, node.eventMap);
        return tarNode;
    } else {
        return node;
    }
};

module.exports = reduceNode;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let EventMatrix = __webpack_require__(56);

let {
    eventMapHook
} = __webpack_require__(11);

let {
    listenEventType,
    clearEvents,
    attachDocument,
    dispatchEvent
} = EventMatrix();

let bindEvents = (node, eventMap) => {
    // hook event at node
    node[eventMapHook] = eventMap;

    for (let type in eventMap) {
        listenEventType(type);
    }
};

module.exports = {
    bindEvents,
    attachDocument,
    dispatchEvent,
    clearEvents
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(70);


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    WAIT: 2,
    MATCH: 1,
    QUIT: 0
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    reduce
} = __webpack_require__(5);

/**
 *
 * valide LR(1) item: LR(1) item [A→α.β, a] is valide for prefix ρ=δα, if exists:
 *      S *⇒ δAω ⇒ δαβω
 *
 * inference: if [A→α.Bβ,a] is valide for ρ=δα, and B→θ is a production, then for any b ϵ FIRST(βa), [B→.θ,b] is valide for predix ρ=δα
 *
 * LR(1) item: [head, body, dotPosition, [...forward]]
 *
 * important: when closure is builded, it's immutable
 */

let buildClosure = (items, grammer, LR1Grammer) => {
    let appendedItems = items;
    let itemsMap = {};
    let prefixMap = {};

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        itemsMap[item.serialize()] = true;
        prefixMap[item.serializePrefix()] = item;
    }

    while (true) { // eslint-disable-line
        let newAppendedItems = reduce(appendedItems, (prev, item) => {
            let newItems = LR1Grammer.expandItem(item);
            return prev.concat(newItems);
        }, []);

        let noRepeatedNewItems = [];

        for (let i = 0; i < newAppendedItems.length; i++) {
            let item = newAppendedItems[i];
            let itemId = item.serialize();

            if (!itemsMap[itemId]) {
                // add new item
                noRepeatedNewItems.push(item);
                itemsMap[item.serialize()] = true;
                let prefixCacheItem = prefixMap[item.serializePrefix()];
                if (prefixCacheItem) {
                    prefixMap[item.serializePrefix()] = prefixCacheItem.concatForwards(item.getForwards());
                } else {
                    prefixMap[item.serializePrefix()] = item;
                }
            }
        }

        if (!noRepeatedNewItems.length) break;

        items = items.concat(noRepeatedNewItems);
        appendedItems = noRepeatedNewItems;
    }

    let serializedText = JSON.stringify(Object.keys(itemsMap).sort());

    let result = [];

    for (let name in prefixMap) {
        result.push(prefixMap[name]);
    }

    return {
        items: result,
        serializedText
    };
};

let sameClosure = (closure1, closure2) => closure1.serializedText === closure2.serializedText;

module.exports = {
    buildClosure,
    sameClosure
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = {
    P_PROGRAM: 'PROGRAM := EXPRESSION_LIST',

    P_EXPRESSION_LIST_0: 'EXPRESSION_LIST := EXPRESSION',
    P_EXPRESSION_LIST_1: 'EXPRESSION_LIST := EXPRESSION semicolon EXPRESSION_LIST',

    P_EXPRESSION_0: 'EXPRESSION := QUERY_EXPRESSION',
    P_EXPRESSION_1: 'EXPRESSION := UPDATE_EXPRESSION',
    P_EXPRESSION_2: 'EXPRESSION := ',

    P_UPDATE_EXPRESSION_0: 'UPDATE_EXPRESSION := PATH assign QUERY_EXPRESSION',
    P_UPDATE_EXPRESSION_1: 'UPDATE_EXPRESSION := delete PATH',
    P_UPDATE_EXPRESSION_2: 'UPDATE_EXPRESSION := append PATH assign QUERY_EXPRESSION',

    P_QUERY_EXPRESSION_0: 'QUERY_EXPRESSION := ATOM_DATA',
    P_QUERY_EXPRESSION_1: 'QUERY_EXPRESSION := variableName',
    P_QUERY_EXPRESSION_2: 'QUERY_EXPRESSION := PATH',
    P_QUERY_EXPRESSION_3: 'QUERY_EXPRESSION := variableName leftBracket rightBracket',
    P_QUERY_EXPRESSION_4: 'QUERY_EXPRESSION := variableName leftBracket QUERY_EXPRESSION_LIST rightBracket',

    P_QUERY_EXPRESSION_LIST_0: 'QUERY_EXPRESSION_LIST := QUERY_EXPRESSION',
    P_QUERY_EXPRESSION_LIST_1: 'QUERY_EXPRESSION_LIST := QUERY_EXPRESSION comma QUERY_EXPRESSION_LIST',

    P_PATH_0: 'PATH := nodeName',
    P_PATH_1: 'PATH := nodeName PATH',
    P_PATH_2: 'PATH := nodeNameVariable',
    P_PATH_3: 'PATH := nodeNameVariable PATH',

    P_ATOM_DATA_0: 'ATOM_DATA := true',
    P_ATOM_DATA_1: 'ATOM_DATA := false',
    P_ATOM_DATA_2: 'ATOM_DATA := null',
    P_ATOM_DATA_3: 'ATOM_DATA := string',
    P_ATOM_DATA_4: 'ATOM_DATA := number',

    T_ATOM: 'atom',
    T_PATH: 'path',
    T_FUNCTION: 'function',
    T_VARIABLE_NAME: 'variableName',
    T_ASSIGN: 'assign',
    T_DELETE: 'delete',
    T_APPEND: 'append',
    T_NODE_NAME: 'nodeName',
    T_NODE_NAME_VARIABLE: 'nodeNameVariable',

    A_DEFAULT: 'default'
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let shadowFrame = __webpack_require__(41);

let startMomenter = __webpack_require__(42);

let getX = (elem) => {
    var x = 0;
    while (elem) {
        x = x + elem.offsetLeft;
        elem = elem.offsetParent;
    }
    return x;
};

let getY = (elem) => {
    var y = 0;
    while (elem) {
        y = y + elem.offsetTop;
        elem = elem.offsetParent;
    }
    return y;
};

let getClientX = (elem) => {
    return getX(elem) - window.scrollX;
};

let getClientY = (elem) => {
    return getY(elem) - window.scrollY;
};

let removeChilds = (node) => {
    while (node && node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

let once = (node, type, handler, useCapture) => {
    let fun = function(e) {
        let ret = handler.apply(this, [e]);
        node.removeEventListener(type, fun, useCapture);
        return ret;
    };

    node.addEventListener(type, fun, useCapture);
};

let getAttributeMap = (attributes = []) => {
    let map = {};
    for (let i = 0; i < attributes.length; i++) {
        let {
            name, value
        } = attributes[i];
        map[name] = value;
    }
    return map;
};

let getClasses = (clz = '') => {
    let ret = [];
    let items = clz.split(' ');
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        item = item.trim();
        if (item) {
            ret.push(item);
        }
    }
    return ret;
};

module.exports = {
    getX,
    getY,
    getClientX,
    getClientY,
    removeChilds,
    once,
    shadowFrame,
    getAttributeMap,
    startMomenter,
    getClasses
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
} = __webpack_require__(0);

/**
 *
 * preidcate: chose items to iterate
 * limit: when to stop iteration
 * transfer: transfer item
 * output
 */
let iterate = funType((domain = [], opts = {}) => {
    let {
        predicate, transfer, output, limit, def
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);

    let rets = def;
    let count = 0;

    if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let itemRet = iterateItem(domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let itemRet = iterateItem(domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
}, [
    or(isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateItem = (domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    let item = domain[name];
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = iterate;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString,
    isObject
} = __webpack_require__(0);

module.exports = (attr = '', {
    keyWrapper,
    valueWrapper
} = {}) => {
    if (isString(attr)) {
        return attr;
    }

    if (!isObject(attr)) {
        throw new TypeError(`Expect object for style object, but got ${attr}`);
    }
    let styles = [];
    for (let key in attr) {
        let value = attr[key];
        key = convertStyleKey(key);
        value = convertStyleValue(value, key);
        if (keyWrapper) {
            key = keyWrapper(key, value);
        }

        if (valueWrapper) {
            value = valueWrapper(value, key);
        }

        styles.push(`${key}: ${value};`);
    }
    return styles.join('');
};

let convertStyleKey = (key) => {
    return key.replace(/[A-Z]/, (letter) => {
        return `-${letter.toLowerCase()}`;
    });
};

let convertStyleValue = (value, key) => {
    if (typeof value === 'number' && key !== 'z-index') {
        return value + 'px';
    }
    if (key === 'padding' || key === 'margin') {
        let parts = value.split(' ');
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            if (!isNaN(Number(part))) {
                parts[i] = part + 'px';
            }
        }

        value = parts.join(' ');
    }
    return value;
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(52);
var bytesToUuid = __webpack_require__(53);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    attachDocument
} = __webpack_require__(13);

let {
    isNode
} = __webpack_require__(0);

let {
    flat, forEach
} = __webpack_require__(1);

let reduceNode = __webpack_require__(12);

/**
 * @param parentNode
 *      the dom node used hook node we rendered
 */
module.exports = (kabaneryRoots, parentNode) => {
    kabaneryRoots = flat(kabaneryRoots);

    forEach(kabaneryRoots, (item) => {
        item = reduceNode(item);
        if (isNode(item)) {
            parentNode.appendChild(item);
        }
    });

    // attach to document
    attachDocument(getDoc(parentNode));
};

let getDoc = (node) => {
    while (node.parentNode) {
        node = node.parentNode;
    }
    return node;
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(62);
exports.encode = exports.stringify = __webpack_require__(63);


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * @readme-quick-run
 *
 * ## test tar=js r_c=streamTokenSpliter
 *
 * let {
 *     parser, WAIT, QUIT, MATCH
 * } = streamTokenSpliter;

 * let spliter = parser([{
 *     priority: 1,
 *     match: (prefix) => {
 *         if (/^\w*$/.test(prefix)) return MATCH;
 *         return QUIT;
 *     },
 *     name: 'word'
 * }, {
 *     priority: 0,
 *     match: (prefix) => {
 *         if (/^.$/.test(prefix)) return MATCH;
 *         return QUIT;
 *     },
 *     name: 'trash'
 * }]);
 *
 * let tokens1 = spliter('today=is __'); // chunk1
 * let tokens2 = spliter('a good day'); // chunk2
 * let tokens3 = spliter(null); // null means end of stream
 *
 * console.log(tokens1);
 * console.log('\n');
 * console.log(tokens2);
 * console.log('\n');
 * console.log(tokens3);
 */
module.exports = __webpack_require__(72);


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject
} = __webpack_require__(0);

/**
 * basic action types and compose actions
 *
 * action = {
 *   actionType
 * }
 */

const __basic_action_type__ = '7e942534-ea8b-4c75-90fd-705aec328d00';

const LEFT_TYPE = 'left',
    RANGE_TYPE = 'range',
    UNION_TYPE = 'union',
    NORMAL_TYPE = 'normal',
    EPSILON_TYPE = 'epsilon';

let toAction = (v) => {
    if (isAction(v)) return v;
    if (v === null) return {
        content: v,
        actionType: EPSILON_TYPE,
        __basic_action_type__

    };
    return {
        content: v,
        actionType: NORMAL_TYPE,
        __basic_action_type__
    };
};

let left = () => {
    return {
        actionType: LEFT_TYPE,
        __basic_action_type__
    };
};

let range = (start, end) => {
    return {
        actionType: RANGE_TYPE,
        start,
        end,
        __basic_action_type__
    };
};

// union two actions to get a new action
let union = (...actions) => {
    for (let i = 0; i < actions.length; i++) {
        let action = actions[i];
        if (!isAction(action)) {
            actions[i] = toAction(action);
        }
    }

    return {
        actionType: UNION_TYPE,
        actions,
        __basic_action_type__
    };
};

let isAction = (v) => {
    return isObject(v) && v.__basic_action_type__ === __basic_action_type__;
};

let isLeftAction = (v) => isAction(v) && v.actionType === LEFT_TYPE;

let isRangeAction = (v) => isAction(v) && v.actionType === RANGE_TYPE;

let isUnionAction = (v) => isAction(v) && v.actionType === UNION_TYPE;

let isNormalAction = (v) => isAction(v) && v.actionType === NORMAL_TYPE;

let isEpsilonAction = (v) => isAction(v) && v.actionType === EPSILON_TYPE;

module.exports = {
    isAction,
    isLeftAction,
    isRangeAction,
    isUnionAction,
    isNormalAction,
    isEpsilonAction,

    left,
    range,
    toAction,
    union
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(28);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact, reverse, overArgs
} = __webpack_require__(77);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact,
    reverse,
    overArgs
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isPromise, likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, isReadableStream, mapType
} = __webpack_require__(0);

/**
 * @param opts
 *      preidcate: chose items to iterate
 *      limit: when to stop iteration
 *      transfer: transfer item
 *      output
 *      def: default result
 */
let iterate = funType((domain, opts = {}) => {
    domain = domain || [];
    if (isPromise(domain)) {
        return domain.then(list => {
            return iterate(list, opts);
        });
    }
    return iterateList(domain, opts);
}, [
    or(isPromise, isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateList = (domain, opts) => {
    opts = initOpts(opts, domain);

    let rets = opts.def;
    let count = 0; // iteration times

    if (isReadableStream(domain)) {
        let index = -1;

        return new Promise((resolve, reject) => {
            domain.on('data', (chunk) => {
                // TODO try cache error
                let itemRet = iterateItem(chunk, domain, ++index, count, rets, opts);
                rets = itemRet.rets;
                count = itemRet.count;
                if (itemRet.stop) {
                    resolve(rets);
                }
            });
            domain.on('end', () => {
                resolve(rets);
            });
            domain.on('error', (err) => {
                reject(err);
            });
        });
    } else if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let item = domain[i];
            let itemRet = iterateItem(item, domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let item = domain[name];
            let itemRet = iterateItem(item, domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
};

let initOpts = (opts, domain) => {
    let {
        predicate, transfer, output, limit
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);
    return opts;
};

let iterateItem = (item, domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = {
    iterate
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let assembleToken = (tokenType, prefix) => {
    return {
        tokenType,
        name: tokenType.name,
        text: prefix
    };
};

module.exports = {
    assembleToken
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    END_SYMBOL: '$',
    EXPAND_START_SYMBOL: 'S`',
    EPSILON: null
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isPromise, likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, isReadableStream, mapType
} = __webpack_require__(0);

/**
 * @param opts
 *      preidcate: chose items to iterate
 *      limit: when to stop iteration
 *      transfer: transfer item
 *      output
 *      def: default result
 */
let iterate = funType((domain, opts = {}) => {
    domain = domain || [];
    if (isPromise(domain)) {
        return domain.then(list => {
            return iterate(list, opts);
        });
    }
    return iterateList(domain, opts);
}, [
    or(isPromise, isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateList = (domain, opts) => {
    opts = initOpts(opts, domain);

    let rets = opts.def;
    let count = 0; // iteration times

    if (isReadableStream(domain)) {
        let index = -1;

        return new Promise((resolve, reject) => {
            domain.on('data', (chunk) => {
                // TODO try cache error
                let itemRet = iterateItem(chunk, domain, ++index, count, rets, opts);
                rets = itemRet.rets;
                count = itemRet.count;
                if (itemRet.stop) {
                    resolve(rets);
                }
            });
            domain.on('end', () => {
                resolve(rets);
            });
            domain.on('error', (err) => {
                reject(err);
            });
        });
    } else if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let item = domain[i];
            let itemRet = iterateItem(item, domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let item = domain[name];
            let itemRet = iterateItem(item, domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
};

let initOpts = (opts, domain) => {
    let {
        predicate, transfer, output, limit
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);
    return opts;
};

let iterateItem = (item, domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = {
    iterate
};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

let getProductionId = (production) => {
    return `${production[0]} := ${production[1].join(' ')}`;
};

// ignore whitespace
let processTokens = (rawTokens) => {
    let tokens = [];
    for (let i = 0; i < rawTokens.length; i++) {
        let {
            text,
            tokenType
        } = rawTokens[i];

        let name = tokenType.name;

        if (name !== 'whitespace') { // ignore white space
            tokens.push({
                text,
                name
            });
        }
    }

    return tokens;
};

let isObject = v => v && typeof v === 'object';

let isFunction = v => typeof v === 'function';

let isString = v => typeof v === 'string';

module.exports = {
    getProductionId,
    processTokens,
    isObject,
    isFunction,
    isString
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    autoId,
    isObject,

    modifySuccess,
    removeNoneExist,
    removeSuccess
} = __webpack_require__(96);

module.exports = (jsonData, {
    missingValue = undefined
} = {}) => {
    let queryByPath = (path) => {
        let cur = jsonData;
        for (let i = 0; i < path.length; i++) {
            if (!isObject(cur)) {
                return missingValue;
            } else {
                if (cur.hasOwnProperty(path[i])) {
                    cur = cur[path[i]];
                } else {
                    return missingValue;
                }
            }
        }

        return cur;
    };

    let setByPath = (path, value) => {
        let parent = jsonData;

        for (let i = 0; i < path.length - 1; i++) {
            let part = path[i];
            let next = parent[part];
            if (!isObject(next)) { // if is not object, just override to a empty object
                next = {}; // create a new middle node
                parent[part] = next;
            }
            parent = next;
        }

        parent[path[path.length - 1]] = value; // set value
        return modifySuccess(path, value);
    };

    return {
        queryByPath,

        setByPath,

        removeByPath: (path) => {
            let parentPath = path.slice(0, path.length - 1);
            let lastKey = path[path.length - 1];
            let parent = queryByPath(parentPath);
            if (parent === missingValue || !isObject(parent) || !parent.hasOwnProperty(lastKey)) {
                return removeNoneExist(path);
            } else {
                delete parent[lastKey];
                return removeSuccess(path);
            }
        },

        appendByPath: (path, value) => {
            return setByPath(path.concat([autoId()]), value);
        }
    };
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    //DO_SAVE_DATA: 'doSaveData'
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    styles
} = __webpack_require__(2);

let container = {
    position: 'relative',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    border: 0,
    borderRadius: 0,
    overflow: 'auto'
};

let fullParentHeight = {
    height: '100%'
};

let fullParentWidth = {
    width: '100%'
};

let fullWindow = styles(container, {
        position: 'fixed',
        left: 0,
        top: 0,
    },
    fullParentWidth, fullParentHeight);

let fullParent = styles(container, fullParentWidth, fullParentHeight);

let flat = {
    appearance: 'none',
    '-webkit-appearance': 'none',
    '-moz-appearance': 'none',
    boxShadow: 'none',
    borderRadius: 'none',
    border: 0
};

module.exports = {
    fullWindow,
    fullParent,
    fullParentWidth,
    fullParentHeight,
    container,
    flat
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    get,
    set
} = __webpack_require__(2);

let {
    Signal
} = __webpack_require__(7);

const CHILD_SOURCE_TYPE = 'child';

const identity = v => v;

/**
 * binding view with another view's props through a key map
 *
 * keyMap = {
 *    binderKey: bindedKey
 * }
 */

let syncBindWithKeyMap = (ctx, keyMap, {
    bindedProps = {},
    stopSignal,
    autoUpdate = false,
    updatedSignalTypes = null,
    onChildSignal,
    toBinded = identity,
    toBinder = identity
} = {}) => {
    // TODO check

    let viewData = ctx.getData();
    let props = viewData.props;
    let mappings = [];
    for (let binderKey in keyMap) {
        mappings.push([binderKey, keyMap[binderKey]]);
    }

    let mapedPropsValue = mappings.reduce((prev, [binderKey, bindedKey]) => {
        let propValue = get(props, binderKey); // get from binder
        set(prev, bindedKey, toBinded(propValue, binderKey, bindedKey)); // set for binded
        return prev;
    }, {});

    let onsignal = (signal, data, sourceCtx) => {
        // when event happened, sync the data
        mappings.forEach(([binderKey, bindedKey]) => {
            let propValue = get(data.props, bindedKey); // get from child
            set(props, binderKey, toBinder(propValue, binderKey, bindedKey)); // set for parent
        });

        // handle the signal if necessary
        onChildSignal && onChildSignal(signal, data, sourceCtx);

        if (!stopSignal) {
            // pop up the signal, TODO wrap the sigal to resolve chain
            ctx.notify(
                Signal(signal.type, {
                    sourceType: CHILD_SOURCE_TYPE,
                    keyMap,
                    sourceSignal: signal,
                    sourceData: data,
                    sourceCtx
                })
            );
        }

        if (autoUpdate) {
            if (!updatedSignalTypes) {
                ctx.update(); // update binder view
            } else {
                if (updatedSignalTypes.findIndex((type) => type === signal.type) !== -1) {
                    ctx.update(); // update binder view
                }
            }
        }
    };

    // construct child props
    return Object.assign({
        theme: props.theme // extend theme by default
    }, bindedProps, mapedPropsValue, {
        onsignal
    });
};

module.exports = {
    syncBindWithKeyMap
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    SPA
} = __webpack_require__(38);
let pageSignalActionMap = __webpack_require__(98);
let pageViewMap = __webpack_require__(100);


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

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {router, queryPager} = __webpack_require__(39);
let {mount} = __webpack_require__(6);
let n = __webpack_require__(4);
let pfcApis = __webpack_require__(64);
let {signalActionFlow} = __webpack_require__(68);
let {Signal} = __webpack_require__(7);
let {wrapPagePropsWithStore} = __webpack_require__(97);

const PAGE_RENDER_SIGNAL = 'kabanery_page_render';

let SPA = ({
  apiPath = '/api/pfc',
  apiStub = {},
  containerId = 'pager',

  // page configs
  pageViewMap = {},
  pageSignalActionMap = {},
  pageOptionsMap = {},

  defaultPage
}) => {
  // TODO validate params
  let {apiMap, runApi} = pfcApis(apiPath, apiStub);

  // create page map
  let pageMap = {};

  for (let name in pageViewMap) {
    let options = pageOptionsMap[name] || {};
    let PageView = pageViewMap[name];
    let signalActionMap = pageSignalActionMap[name] || {};
    pageMap[name] = {
      title : options[name] || name,
      render : page(PageView, signalActionMap, options)
    };
  }

  let pageEnv = {apiMap, runApi};

  mount(n(`div id="${containerId}"`), document.body); // pager as container

  let {forward, redirect, reload} = router(
      // pages
      queryPager(pageMap, defaultPage || Object.keys(pageMap)[0]),

      // page env
      pageEnv,

      {containerId});

  pageEnv.forward = forward;
  pageEnv.redirect = redirect;
  pageEnv.reload = reload;

  forward(window.location.href);
};

let page = (PageView, signalActionMap,
            {localStateStore = false, localStateStoreWhiteList = []} = {}) =>
    (pageEnv) => {
      let props = {onsignal : signalActionFlow(signalActionMap, pageEnv)};

      if (localStateStore) {
        props = wrapPagePropsWithStore(props,
                                       {whiteList : localStateStoreWhiteList});
      }

      let pageView = n(PageView, props);

      pageView.ctx.notify(Signal(PAGE_RENDER_SIGNAL));

      return pageView;
    };

module.exports = {
  SPA,
  page
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(40);

/**
 * @readme-quick-run
 *
 * ## test tar=js env=browser r_c=spa
 *
 * let {router, queryPager} = spa;
 * let {n, mount} = require('kabanery');
 * mount(n('div id="pager"'), document.body); // pager as contauner
 *
 * let {forward} = router(queryPager({
 *      'page1': {
 *          title: 'page1',
 *          render: () => {
 *              return n('div', 'this is page1');
 *          }
 *      },
 *      'page2': {
 *          render: () => {
 *              return n('div', 'this is page2');
 *          }
 *      }
 * }, 'page1')); // default page is page1
 *
 * module.exports = forward(window.location.href).then(() => {
 *    console.log('page 1 content: ');
 *    console.log(document.getElementById('pager').innerHTML);
 *    return forward('?page=page2').then(() => {
 *      console.log('\n\npage 2 content: ');
 *      console.log(document.getElementById('pager').innerHTML);
 *    });
 * });
 */


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    removeChilds
} = __webpack_require__(18);

let {
    mount
} = __webpack_require__(6);

let {
    parse
} = __webpack_require__(58);

const SINGLE_JUMP_PREFIX = 'single://';

const CONTAINER_ID = 'pager';

let queryPager = (map = [], index) => {
    index = initDefaultPage(map, index);

    return (url) => {
        let urlObject = parse(url, true);
        let pageName = urlObject.query['page'] || index;

        return map[pageName];
    };
};

let restPager = (map = [], index) => {
    index = initDefaultPage(map, index);

    return (url) => {
        let pathname = url.split(/.*\:\/\//)[1];
        let pageName = pathname.split('/')[1];
        pageName = pageName || index;

        return map[pageName];
    };
};

let initDefaultPage = (map = [], index) => {
    if (index === null || index === undefined) {
        for (let name in map) {
            index = name;
            break;
        }
    }
    return index;
};

let renderPage = (render, pageEnv, title, containerId) => {
    return Promise.resolve(render(pageEnv, title)).then((pageNode) => {
        // TODO pager is the default container, make it configurable
        let pager = document.getElementById(containerId);
        // unload old page
        removeChilds(pager);
        // add new page
        mount(pageNode, pager);
        pager.style = 'display:block;';
        document.title = title;

        // hash location
        if (window.location.hash) {
            let item = document.getElementById(window.location.hash.substring(1));
            if (item) {
                window.scrollTo(0, item.offsetTop);
            }
        }
    });
};

/**
 * pager: (url) => {title, render}
 */
let router = (pager, pageEnv, {
    onSwitchPageStart,
    onSwitchPageFinished,
    containerId = CONTAINER_ID
} = {}) => {
    let listenFlag = false;

    /**
     * only entrance for switching pages
     */
    let switchPage = (render, pageEnv, title) => {
        onSwitchPageStart && onSwitchPageStart(render, pageEnv, title);
        let ret = switchBetweenPages(render, pageEnv, title);

        Promise.resolve(ret).then((data) => {
            onSwitchPageFinished && onSwitchPageFinished(null, data);
        }).catch((err) => {
            onSwitchPageFinished && onSwitchPageFinished(err);
        });

        return ret;
    };

    let switchBetweenPages = (render, pageEnv, title) => {
        let ret = renderPage(render, pageEnv, title, containerId);

        if (!listenFlag) {
            listenPageSwitch();
            listenFlag = true;
        }

        return ret;
    };

    let forward = (url, {
        keepLocation
    } = {}) => {
        if (!window.history.pushState) {
            window.location.href = url;
            return;
        }
        let {
            render, title = '', transitionData = {}
        } = pager(url);

        if (url !== window.location.href) {
            window.history.pushState(transitionData, title, url);
        }
        if (!keepLocation) {
            window.scrollTo(0, 0);
        }
        return switchPage(render, pageEnv, title);
    };

    let redirect = (url) => {
        if (!window.history.pushState) {
            window.location.href = url;
            window.location.replace(url);
            return;
        }
        let {
            render, title = '', transitionData = {}
        } = pager(url);

        if (url !== window.location.href) {
            window.history.replaceState(transitionData, title, url);
        }
        return switchPage(render, pageEnv);
    };

    let listenPageSwitch = () => {
        window.onpopstate = () => {
            forward(window.location.href);
        };

        document.addEventListener('click', (e) => {
            // hack kabanery, TODO fix this hack
            setTimeout(() => {
                let target = e.target;
                // hack kabanery, TODO fix this hack
                if (e.__stopPropagation) return;

                while (target) {
                    if (target.getAttribute) { // document does not have getAttribute method
                        let url = (target.getAttribute('href') || '').trim();
                        // matched
                        if (url.indexOf(SINGLE_JUMP_PREFIX) === 0) {
                            e.preventDefault();
                            e.stopPropagation();

                            forward(url.substring(SINGLE_JUMP_PREFIX.length).trim());
                            break;
                        }
                    }
                    target = target.parentNode;
                }
            });
        });
    };

    return {
        forward,
        redirect,
        reload: () => {
            return forward(window.location.href, {
                keepLocation: true
            });
        }
    };
};

module.exports = {
    router,
    queryPager,
    restPager
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let shadowFrame = () => {
    let div = document.createElement('div');
    let sr = div.createShadowRoot();
    sr.innerHTML = '<div id="shadow-page"></div>';

    let frame = null;

    let create = () => {
        let html = document.getElementsByTagName('html')[0];
        html.appendChild(div);

        return sr.getElementById('shadow-page');
    };

    let start = () => {
        if (frame) {
            return frame;
        }
        frame = new Promise(resolve => {
            if (document.body) {
                resolve(create());
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    resolve(create());
                });
            }
        });
        return frame;
    };

    let close = () => {
        frame.then(() => {
            let parent = div.parentNode;
            parent && parent.removeChild(div);
        });
    };

    return {
        start,
        close,
        sr,
        rootDiv: div
    };
};

module.exports = shadowFrame;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let isDomReady = (doc) => doc.readyState === 'complete' ||
    (!doc.attachEvent && doc.readyState === 'interactive');

let startMomenter = (doc = document) => {
    let loadedFlag = false;

    let resolves = [];

    let docReady = () => {
        let ready = () => {
            if (loadedFlag) return;
            loadedFlag = true;
            for (let i = 0; i < resolves.length; i++) {
                resolves[i]();
            }
            resolves = [];
        };
        if (doc.addEventListener) {
            doc.addEventListener('DOMContentLoaded', ready);
            doc.addEventListener('DOMContentLoaded', ready);
        } else {
            doc.attachEvent('onreadystatechange', () => {
                if (document.readyState === 'complete') {
                    ready();
                }
            });
        }
    };

    docReady();

    // generalWaitTime is used for async rendering
    return ({
        generalWaitTime = 0, startTimeout = 10000
    } = {}) => new Promise((resolve, reject) => {
        if (loadedFlag || isDomReady(doc)) { // already ready
            setTimeout(resolve, generalWaitTime);
        } else { // wait for ready
            resolves.push(resolve);
            setTimeout(() => {
                reject(new Error('timeout'));
            }, startTimeout);
        }
    });
};

module.exports = startMomenter;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n,
    svgn,
    bindPlugs,
    toHTML,
    parseArgs,
    isKabaneryNode,
    cn,
    parseStyle
} = __webpack_require__(10);

let plugs = __webpack_require__(47);

let view = __webpack_require__(50);

let mount = __webpack_require__(23);

let N = __webpack_require__(57);

let reduceNode = __webpack_require__(12);

let {
    dispatchEvent,
    clearEvents
} = __webpack_require__(13);

module.exports = {
    n,
    isKabaneryNode,
    cn,
    N,
    svgn,
    view,
    plugs,
    bindPlugs,
    mount,
    toHTML,
    reduceNode,

    parseArgs,
    parseStyle,
    dispatchEvent,
    clearEvents
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let iterate = __webpack_require__(19);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

module.exports = {
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let parseAttribute = __webpack_require__(46);

let {
    isString,
    isObject,
    isNode,
    likeArray,
    isNumber,
    isBool
} = __webpack_require__(0);

let parseArgs = (args, {
    doParseStyle = true
} = {}) => {
    let tagName,
        attributes = {},
        childExp = [];

    let first = args.shift();

    let parts = splitTagNameAttribute(first);

    if (parts.length > 1) { // not only tagName
        tagName = parts[0];
        attributes = parts[1];
    } else {
        tagName = first;
    }

    let next = args.shift();

    let nextAttr = {};

    if (likeArray(next) ||
        isString(next) ||
        isNode(next) ||
        isNumber(next) ||
        isBool(next)) {
        childExp = next;
    } else if (isObject(next)) {
        nextAttr = next;
        childExp = args.shift() || [];
    }

    attributes = parseAttribute(attributes, nextAttr, {
        doParseStyle
    });

    let childs = parseChildExp(childExp);

    return {
        tagName,
        attributes,
        childs
    };
};

let splitTagNameAttribute = (str = '') => {
    if (typeof str !== 'string') return [str];

    let tagName = str.split(' ')[0];
    let attr = str.substring(tagName.length);
    attr = attr && attr.trim();

    tagName = tagName.toLowerCase().trim();
    if (attr) {
        return [tagName, attr];
    } else {
        return [tagName];
    }
};

let parseChildExp = (childExp) => {
    let ret = [];
    if (isNode(childExp)) {
        ret.push(childExp);
    } else if (likeArray(childExp)) {
        for (let i = 0; i < childExp.length; i++) {
            let child = childExp[i];
            ret = ret.concat(parseChildExp(child));
        }
    } else if (childExp) {
        ret.push(childExp);
    }
    return ret;
};

module.exports = parseArgs;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString
} = __webpack_require__(0);

let parseStyle = __webpack_require__(20);

let {
    mergeMap
} = __webpack_require__(1);

const ITEM_REG = /([\w-]+)\s*=\s*(([\w-]+)|('.*?')|(".*?"))/;

// TODO better key=value grammer
// TODO refactor with grammerL: class grammer, id grammer, refer some popular grammer
let parseAttribute = (attributes, nextAttr, {
    doParseStyle
}) => {
    // key=value key=value
    // value='abc' value=true value=123 value="def"
    if (isString(attributes)) {
        let str = attributes.trim(),
            kvs = [];

        let stop = false;
        while (!stop) {
            let newstr = str.replace(ITEM_REG, (matchStr, $1, $2) => {
                kvs.push([$1, $2]);
                return '';
            }).trim();
            if (newstr === str) {
                stop = true;
            }
            str = newstr;
        }

        attributes = {};
        for (let i = 0; i < kvs.length; i++) {
            let [key, value] = kvs[i];
            if (value[0] === '\'' && value[value.length - 1] === '\'' ||
                value[0] === '"' && value[value.length - 1] === '"') {
                value = value.substring(1, value.length - 1);
            }
            attributes[key] = value;
        }
    }
    // merge
    attributes = mergeMap(attributes, nextAttr);

    if (attributes.style && doParseStyle) {
        attributes.style = parseStyle(attributes.style);
    }

    // TODO presudo
    /*
    if (attributes.presudo) {
        for (let name in attributes.presudo) {
            attributes.presudo[name] = parseStyle(attributes.presudo[name]);
        }
    }
   */

    return attributes;
};

module.exports = parseAttribute;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let twowaybinding = __webpack_require__(48);
let eventError = __webpack_require__(49);

module.exports = {
    twowaybinding,
    eventError
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    get, set
} = __webpack_require__(8);

module.exports = (obj, path) => (tagName, attributes, childExp) => {
    let value = get(obj, path, '');
    if (tagName === 'input') {
        attributes.value = value;
    } else {
        childExp.unshift(value);
    }

    if (!attributes.oninput) {
        attributes.oninput = (e) => {
            set(obj, path, e.target.value);
        };
    }
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (catcher) => (tagName, attributes) => {
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            if (typeof item === 'function') {
                attributes[name] = wrapEventHandler(item, catcher);
            }
        }
    }
};

let wrapEventHandler = (fun, catcher) => {
    return function () {
        try {
            let ret = fun.apply(this, arguments);
            ret = Promise.resolve(ret);
            ret.catch(catcher);
            return ret;
        } catch (err) {
            return catcher(err);
        }
    };
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    set
} = __webpack_require__(8);

let {
    isObject,
    isFunction,
    likeArray
} = __webpack_require__(0);

let {
    forEach
} = __webpack_require__(1);

let replace = __webpack_require__(51);

let reduceNode = __webpack_require__(12);

let mount = __webpack_require__(23);

/**
 * render function: (data) => node
 */

// TODO observable for update, append

// class level
let View = (view, construct, {
    afterRender
} = {}) => {
    // TODO class level API
    // instance level
    let viewer = (obj, initor) => {
        // create context
        let ctx = createCtx({
            view,
            afterRender
        });

        return createView(ctx, obj, initor, construct);
    };

    let viewerOps = (viewer) => {
        viewer.create = (handler) => {
            let ctx = createCtx({
                view,
                afterRender
            });

            handler && handler(ctx);

            let inst = (obj, initor) => {
                return createView(ctx, obj, initor, construct);
            };

            inst.ctx = ctx;

            return inst;
        };

        // extend some context
        viewer.expand = (ctxMap = {}) => {
            let newViewer = (...args) => {
                let obj = args[0];
                args[0] = View.ext(obj, ctxMap);

                return viewer(...args);
            };

            viewerOps(newViewer);
            return newViewer;
        };
    };

    viewerOps(viewer);

    return viewer;
};

View.ext = (data, ctxMap = {}) => (ctx) => {
    for (let name in ctxMap) {
        ctx[name] = ctxMap[name];
    }
    if (isFunction(data)) {
        return data(ctx);
    }
    return data;
};

let createView = (ctx, obj, initor, construct) => {
    let data = ctx.initData(obj, ctx);
    // only run initor when construct view
    initor && initor(data, ctx);
    construct && construct(data, ctx);

    // render node
    return ctx.replaceView();
};

let createCtx = ({
    view,
    afterRender
}) => {
    let node = null,
        data = null,
        render = null;

    let update = (...args) => {
        updateData(...args);
        return replaceView();
    };

    let updateData = (...args) => {
        if (args.length === 1 && likeArray(args[0])) {
            let arg = args[0];
            forEach(arg, (item) => {
                set(data, item[0], item[1]);
            });
        } else {
            let [path, value] = args;

            // function is a special data
            if (isFunction(value)) {
                value = value(data);
            }

            set(data, path, value);
        }
    };

    let appendView = (itemView) => {
        if (node) {
            mount(itemView, node);
        }
    };

    let replaceView = () => {
        let newNode = getNewNode();
        newNode = reduceNode(newNode);

        // type check for newNode

        node = replace(node, newNode);

        afterRender && afterRender(ctx);

        if (node) node.ctx = ctx;
        return node;
    };

    let getNewNode = () => {
        if (!render) render = view;
        let ret = render(data, ctx);
        if (isFunction(ret)) {
            render = ret;
            return render(data, ctx);
        } else {
            return ret;
        }
    };

    let initData = (obj = {}) => {
        data = generateData(obj, ctx);
        return data;
    };

    let getNode = () => node;

    let getData = () => data;

    let getCtx = () => ctx;

    // TODO refator
    let transferCtx = (newNode) => {
        node = newNode;
        newNode.ctx = ctx;
    };

    let ctx = {
        update,
        updateData,
        getNode,
        getData,
        transferCtx,
        initData,
        replaceView,
        appendView,
        getCtx
    };

    return ctx;
};

let generateData = (obj, ctx) => {
    let data = null;
    // data generator
    if (isFunction(obj)) {
        data = obj(ctx);
    } else {
        data = obj;
    }

    // TODO need mount event
    if (!isObject(data)) {
        throw new TypeError(`Expect object, but got ${data}. Type is ${typeof data}`);
    }
    return data;
};

module.exports = View;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    toArray
} = __webpack_require__(8);

let {
    isNode
} = __webpack_require__(0);

let {
    forEach
} = __webpack_require__(1);

let {
    eventMapHook
} = __webpack_require__(11);

let applyAttibutes = __webpack_require__(54);

let replaceDirectly = (node, newNode) => {
    let parent = node.parentNode;
    if (parent) {
        // replace
        parent.replaceChild(newNode, node);
        return newNode;
    } else {
        return node;
    }
};

let removeOldNode = (oldNode) => {
    let parent = oldNode.parentNode;
    if (parent) {
        parent.removeChild(oldNode);
    }
};

// TODO using key
let diffNode = (node, newNode) => {
    if (!newNode) {
        return removeOldNode(node);
    }

    if (node.nodeType === 3 && newNode.nodeType === 3) {
        node.textContent = newNode.textContent;
    }

    if (isNode(node) && isNode(newNode)) {
        if (node.nodeType === 3 && newNode.nodeType === 3) {
            node.textContent = newNode.textContent;
            return node;
        }

        if (node.tagName !== newNode.tagName ||
            node.tagName === 'INPUT'
        ) {
            // TODO problems performance
            // TODO nodetype problem
            return replaceDirectly(node, newNode);
        } else {
            editNode(node, newNode);
        }
    }
    return node;
};

let editNode = (node, newNode) => {
    // attributes
    applyAttibutes(node, newNode);

    // hacks for dom
    if (node.tagName === 'TEXTAREA') {
        node.value = newNode.textContent;
    }
    if (node.tagName === 'INPUT') {
        node.value = newNode.getAttribute('value');
    }

    // transfer context
    if (newNode.ctx) {
        newNode.ctx.transferCtx(node);
    }

    // transfer event map
    if (newNode[eventMapHook]) {
        node[eventMapHook] = newNode[eventMapHook];
    }

    let orinChildNodes = toArray(node.childNodes);
    let newChildNodes = toArray(newNode.childNodes);

    // TODO using key
    convertLists(orinChildNodes, newChildNodes, node);
};

let convertLists = (orinChildNodes, newChildNodes, parent) => {
    removeExtra(orinChildNodes, newChildNodes);

    // diff
    forEach(orinChildNodes, (orinChild, i) => {
        diffNode(orinChild, newChildNodes[i]);
    });

    appendMissing(orinChildNodes, newChildNodes, parent);
    return orinChildNodes;
};

let removeExtra = (orinChildNodes, newChildNodes) => {
    // remove
    for (let i = newChildNodes.length; i < orinChildNodes.length; i++) {
        removeOldNode(orinChildNodes[i]);
    }
};

let appendMissing = (orinChildNodes, newChildNodes, parent) => {
    // append
    for (let i = orinChildNodes.length; i < newChildNodes.length; i++) {
        let newChild = newChildNodes[i];
        parent.appendChild(newChild);
    }
};

module.exports = (node, newNode) => {
    let ret = null;

    if (!node) {
        ret = newNode;
    } else if (!newNode) {
        removeOldNode(node);
        ret = null;
    } else {
        ret = diffNode(node, newNode);
    }

    return ret;
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),
/* 53 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    getAttributeMap
} = __webpack_require__(18);

let {
    hasOwnProperty
} = __webpack_require__(8);

let {
    forEach
} = __webpack_require__(1);

let applyAttibutes = (node, newNode) => {
    // attributes
    let orinAttrMap = getAttributeMap(node.attributes);
    let newAttrMap = getAttributeMap(newNode.attributes);

    // update and remove
    forEach(orinAttrMap, (orinValue, name) => {
        if (hasOwnProperty(newAttrMap, name)) {
            let newValue = newAttrMap[name];
            if (newValue !== orinValue) {
                node.setAttribute(name, newValue);
            }
        } else {
            node.removeAttribute(name);
        }
    });

    // append
    forEach(newAttrMap, (newAttr, name) => {
        if (!hasOwnProperty(orinAttrMap, name)) {
            node.setAttribute(name, newAttr);
        }
    });
};

module.exports = applyAttibutes;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isNode
} = __webpack_require__(0);

const svgNS = 'http://www.w3.org/2000/svg';

let applyNode = (node, attributes, childs) => {
    for (let name in attributes) {
        let attr = attributes[name];
        node.setAttribute(name, attr);
    }

    for (let i = 0; i < childs.length; i++) {
        let child = childs[i];
        if (isNode(child)) {
            node.appendChild(child);
        } else {
            node.textContent = child + '';
        }
    }
};

let createElement = (tagName, attributes, childs) => {
    let node = document.createElement(tagName);
    applyNode(node, attributes, childs);
    return node;
};

let createSvgElement = (tagName, attributes, childs) => {
    let node = document.createElementNS(svgNS, tagName);
    applyNode(node, attributes, childs);
    return node;
};

module.exports = {
    createElement,
    createSvgElement
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    contain
} = __webpack_require__(1);

let {
    eventMapHook,
    globalEventTypePrefix,
    stopPropagationFlag
} = __webpack_require__(11);

module.exports = () => {
    let docs = [];
    let eventTypeMap = {};
    let handlerMap = {};

    let listenEventType = (type) => {
        if (!eventTypeMap[type]) {
            updateDocs(type);
        }
        eventTypeMap[type] = true;
    };

    /**
     * attach document used to accept events
     */
    let attachDocument = (doc = document) => {
        if (!contain(docs, doc)) {
            for (let type in eventTypeMap) {
                // prevent multiple version of kabanery to binding multiple times for the same type
                let id = getGlobalEventTypeId(type);
                if (!doc[id]) {
                    addEventListenerToDoc(doc, type);
                    doc[id] = true;
                }
            }
            docs.push(doc);
        }
    };

    let updateDocs = (type) => {
        if (!docs.length) {
            docs.push(document);
        }
        for (let i = 0; i < docs.length; i++) {
            let doc = docs[i];
            addEventListenerToDoc(doc, type);
        }
    };

    let addEventListenerToDoc = (doc, type) => {
        let handler = null;
        if (handlerMap[type]) {
            handler = handlerMap[type];
        } else {
            handler = listener(type);
            handlerMap[type] = handler;
        }
        doc.addEventListener(type, handler);
    };

    let clearEvents = () => {
        for (let type in eventTypeMap) {
            removeListenerType(type);
        }
    };

    let removeListenerType = (type) => {
        let handler = handlerMap[type];
        if (handler) {
            for (let i = 0; i < docs.length; i++) {
                let doc = docs[i];
                doc.removeEventListener(type, handler);
            }
            delete handlerMap[type];
            delete eventTypeMap[type];
        }
    };

    let getDocs = () => docs.slice(0);

    /**
     * e = {
     *  target,
     *  stopPropagation [optional]
     * }
     */
    let listener = (type) => function(e) {
        let ctx = this;
        let target = e.target;

        // hack the stopPropagration function
        let oldProp = e.stopPropagation;
        e.stopPropagation = function(...args) {
            e[stopPropagationFlag] = true;
            return oldProp && oldProp.apply(this, args);
        };

        let nodePath = getNodePath(target);

        for (let i = 0; i < nodePath.length; i++) {
            let node = nodePath[i];
            applyNodeHandlers(e, type, node, ctx);
        }
    };

    let applyNodeHandlers = (e, type, node, ctx) => {
        if (e.__stopPropagation) { // event already been stoped by child node
            return true;
        }

        let handler = getHandler(type, node);
        return handler && handler.apply(ctx, [e]);
    };

    let getHandler = (type, target) => {
        let eventMap = target && target[eventMapHook];
        return eventMap && eventMap[type];
    };

    let dispatchEvent = (type, e) => {
        let handler = handlerMap[type];
        handler && handler(e);
    };

    return {
        listenEventType,
        clearEvents,
        removeListenerType,
        getDocs,
        attachDocument,
        dispatchEvent
    };
};

/**
 * get the path of node
 */
let getNodePath = (target) => {
    let paths = [];
    while (target) {
        paths.push(target);
        target = target.parentNode;
    }
    return paths;
};

let getGlobalEventTypeId = (type) => `${globalEventTypePrefix}${type}`;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(10);

let {
    isArray, isFunction, isObject
} = __webpack_require__(0);

let {
    map
} = __webpack_require__(1);

module.exports = (...args) => {
    let tagName = args[0],
        attrs = {},
        childs = [];
    if (isArray(args[1])) {
        childs = args[1];
    } else if (isFunction(args[1])) {
        childs = [args[1]];
    } else {
        if (isObject(args[1])) {
            attrs = args[1];
            if (isArray(args[2])) {
                childs = args[2];
            } else if (isFunction(args[2])) {
                childs = [args[2]];
            }
        }
    }

    return (...params) => {
        let renderList = (list) => {
            return map(list, (viewer) => {
                if (isArray(viewer)) {
                    return renderList(viewer);
                } else if (isFunction(viewer)) {
                    return viewer(...params);
                } else {
                    return viewer;
                }
            });
        };

        return n(tagName, attrs, renderList(childs));
    };
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(59);
var util = __webpack_require__(61);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(24);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(60)(module), __webpack_require__(22)))

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let stubAsApis = __webpack_require__(65);
let pfcRequestor = __webpack_require__(67);

module.exports = (apiPath, stub) => {
    let pfcRequest = pfcRequestor(apiPath);
    let apis = stubAsApis(stub);

    let apiMap = {};

    for (let name in apis) {
        let api = apis[name];
        if (typeof api === 'function') {
            apiMap[name] = (...params) => {
                let lazy = () => {
                    // resolve params first
                    let paramValues = [];
                    for (let i = 0; i < params.length; i++) {
                        let param = params[i];
                        if (isLazyFun(param)) {
                            paramValues.push(param());
                        } else {
                            paramValues.push(param);
                        }
                    }

                    return api(...paramValues);
                };

                lazy.tag = 'lazy';

                return lazy;
            };
        } else {
            apiMap[name] = api;
        }
    }

    let runApi = (exp) => {
        try {
            if (isLazyFun(exp)) {
                exp = exp();
            }
            return pfcRequest(exp.code);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        apiMap,
        runApi
    };
};

let isLazyFun = (f) => {
    return typeof f === 'function' && f.tag === 'lazy';
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject,
    isFunction
} = __webpack_require__(66);

/**
 * we got stub and use it as apis to ccontruct pfc code
 */

module.exports = (variableStub = {}) => {
    let apiMap = {};

    for (let name in variableStub) {
        let stub = variableStub[name];
        if (stub.type === 'function') {
            apiMap[name] = (...params) => callStubFunction(name, params, variableStub[name] || {});
        } else {
            apiMap[name] = callStubVariable(name);
        }
    }

    return apiMap;
};

let callStubVariable = (variable) => {
    return {
        code: `${variable}`,
        type: 'variable'
    };
};

let callStubFunction = (variable, params, stub) => {
    let code = `${variable}(`;

    let fullAtoms = true,
        paramValues = [];

    for (let i = 0; i < params.length; i++) {
        let param = params[i];
        if (isObject(param) && param.type === 'function') {
            code += param.code;
            fullAtoms = false;
        } else if (isObject(param) && param.type === 'variable') {
            code += param.code;
            fullAtoms = false;
        } else {
            paramValues.push(param);
            // validate atom param
            if (isFunction(stub.validateParamItem)) {
                stub.validateParamItem(param, i);
            }
            code += serializeAtom(param);
        }

        if (i < params.length - 1) {
            code += ',';
        }
    }

    if (fullAtoms && isFunction(stub.validateParams)) {
        stub.validateParams(paramValues);
    }

    code += ')';

    return {
        type: 'function',
        code
    };
};

let serializeAtom = (atom) => {
    if (typeof atom === 'string') {
        return JSON.stringify(atom);
    } else if (atom === null) {
        return 'null';
    } else if (atom === true) {
        return 'true';
    } else if (atom === false) {
        return 'false';
    } else if (typeof atom === 'number') {
        return atom + '';
    } else {
        throw new Error(`unexpected atom type in pfc, atom is ${atom}.`);
    }
};


/***/ }),
/* 66 */
/***/ (function(module, exports) {

// ignore whitespace
let processTokens = (rawTokens) => {
    let tokens = [];
    for (let i = 0; i < rawTokens.length; i++) {
        let {
            text, tokenType
        } = rawTokens[i];

        let name = tokenType.name;

        if (name !== 'whitespace') { // ignore white space
            tokens.push({
                text,
                name
            });
        }
    }

    return tokens;
};

let getProductionId = (production) => {
    return `${production[0]} := ${production[1].join(' ')}`;
};

let isFunction = (v) => typeof v === 'function';

let isObject = (v) => v && typeof v === 'object';

module.exports = {
    processTokens,
    getProductionId,
    isFunction,
    isObject
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let requestor = (apiPath = '/api/pfc') => (pfcCode) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    let {
                        errno,
                        errMsg,
                        data
                    } = JSON.parse(xhr.responseText);
                    if (errno === 0) {
                        resolve(data);
                    } else {
                        reject(new Error((errMsg.split(':')[1] || '').trim()));
                    }
                } else {
                    reject(new Error(`status code is ${xhr.status}`));
                }
            }
        };

        xhr.open('post', apiPath);
        xhr.send(pfcCode);
    });
};

module.exports = requestor;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    signalUpdateStateRunner,
    signalSendRequestRunner,
    responseUpdateStateRunner,
    responseErrorRunner
} = __webpack_require__(69);

/**
 * action flow
 */
const ACTION_SIGNAL_UPDATE_STATE = 'updateState';
const ACTION_SIGNAL_SEND_REQUEST = 'sendRequest';

/**
 * variableMap: global variable map
 *
 * TODO support general action flow
 */
let signalActionFlow = (signalActionMap, pageEnv, variableMap = {}, {
    variableStub
} = {}) => {
    parseSignalActionMap(signalActionMap, variableMap, {
        variableStub
    });

    return (signal, viewState, ctx) => {
        let actions = signalActionMap[signal.type] || [];
        return runSignalActions(signal, actions, viewState, ctx, pageEnv);
    };
};

let runSignalActions = (signal, actions, viewState, ctx, pageEnv) => {
    return Promise.all(actions.map((action) => {
        return action.content(signal, viewState, ctx, pageEnv);
    }));
};

// TODO validate signalActionMap
let parseSignalActionMap = (signalActionMap, variableMap, {
    variableStub
}) => {
    for (let name in signalActionMap) {
        let actions = signalActionMap[name];
        if (!Array.isArray(actions)) {
            throw new Error(`Expect array for actions in signal action map. But got ${actions}.`);
        }
        for (let i = 0; i < actions.length; i++) {
            parseSignalAction(actions[i], variableMap, {
                variableStub
            });
        }
    }
};

let parseSignalAction = (signalAction, variableMap, {
    variableStub
}) => {
    let type = signalAction.type;
    let cnt = signalAction.content;
    if (type === ACTION_SIGNAL_UPDATE_STATE) {
        if (typeof cnt !== 'function') {
            /**
             * {
             *    type,
             *    content,
             *    variableMap,
             *    variableStub
             * }
             */
            // action code to update runner
            let signalUpdate = signalUpdateStateRunner(cnt,
                getVariableMap(variableMap, signalAction),

                {
                    variableStub: getVariableStub(variableStub, signalAction)
                });

            signalAction.content = (...args) => {
                return new Promise((resolve, reject) => {
                    try {
                        resolve(signalUpdate(...args));
                    } catch (err) {
                        reject(err);
                    }
                });
            };
        }
    } else if (type === ACTION_SIGNAL_SEND_REQUEST) {
        /**
         * {
         *   type,
         *   content,
         *   variableMap,
         *   variableStub,
         *   response: action,
         *   error: action
         * }
         */
        if (typeof cnt !== 'function') {
            let nextVariableMap = getVariableMap(variableMap, signalAction);
            let nextVariableStub = getVariableStub(variableStub, signalAction);
            let signalRequest = signalSendRequestRunner(cnt, nextVariableMap, {
                variableStub: nextVariableStub
            });

            let responseUpdate = signalAction.response && responseUpdateStateRunner(signalAction.response, nextVariableMap, {
                variableStub: nextVariableStub
            });

            let errorUpdate = signalAction.error && responseErrorRunner(signalAction.error, nextVariableMap, {
                variableStub: nextVariableStub
            });

            signalAction.content = (signal, data, ctx, pageEnv) => {
                return signalRequest(signal, data, ctx, pageEnv).then((response) => {
                    return responseUpdate && responseUpdate(response, data, ctx);
                }).catch((err) => {
                    errorUpdate && errorUpdate(err, data, ctx);
                    throw err;
                });
            };
        }
    } else {
        throw new Error(`unexpected action type for a signal action, type is ${type}`);
    }
};

let getVariableMap = (variableMap, action) => {
    if (!action.variableMap) return variableMap;
    return Object.assign({}, variableMap, action.variableMap);
};

let getVariableStub = (variableStub, action) => {
    if (!action.variableStub) return variableStub;
    return Object.assign({}, variableStub, action.variableStub);
};

module.exports = {
    signalActionFlow,
    runSignalActions
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    parseStrToAst,
    checkAST,
    executeAST
} = __webpack_require__(14);
let JsonTree = __webpack_require__(33);

/**
 *
 * atom updating
 *
 * 1. signal to update client state, like page UI.
 *
 * 2. signal to send request
 *
 * 3. response (from server or other) update client state, like page UI
 */

const clientState = {
    localStorage: typeof localStorage !== 'undefined' && localStorage
};

let signalUpdateStateRunner = (code, variableMap, {
    variableStub
} = {}) => {
    let ast = getTreeScriptAst(code, variableStub);

    return (signal, viewState, ctx) => {
        let data = Object.assign({
            signal,
            viewState
        }, clientState);
        updateTree(data, ast, variableMap, variableStub);
        // update page
        ctx.updateWithNotify();
    };
};

let signalSendRequestRunner = (code, variableMap, {
    variableStub
} = {}) => {
    let ast = getTreeScriptAst(code, variableStub);

    return (signal, viewState, ctx, {
        runApi,
        apiMap
    }) => {
        let data = Object.assign({
            signal,
            viewState
        }, clientState);
        return runApi(updateTree(data, ast, Object.assign({}, variableMap, apiMap), variableStub));
    };
};

let responseUpdateStateRunner = (code, variableMap, {
    variableStub
} = {}) => {
    let ast = getTreeScriptAst(code, variableStub);

    return (response, viewState, ctx) => {
        updateTree(Object.assign({
            response,
            viewState
        }, clientState), ast, variableMap, variableStub);
        // update page
        ctx.updateWithNotify();
    };
};

let responseErrorRunner = (code, variableMap, {
    variableStub
} = {}) => {
    let ast = getTreeScriptAst(code, variableStub);

    return (error, viewState, ctx) => {
        updateTree(Object.assign({
            errorMsg: error.toString(),
            error,
            viewState,
            ctx
        }, clientState), ast, variableMap, variableStub);
        // update page
        ctx.updateWithNotify();
    };
};

let getTreeScriptAst = (code, variableStub) => {
    let ast = parseStrToAst(code);

    if (variableStub) {
        checkAST(ast, {
            variableStub
        });
    }

    return ast;
};

let updateTree = (source, ast, variableMap, variableStub) => {
    let tree = JsonTree(source);

    return executeAST(ast, {
        queryByPath: tree.queryByPath,
        setByPath: tree.setByPath,
        removeByPath: tree.removeByPath,
        appendByPath: tree.appendByPath,
        variableMap,
        variableStub
    });
};

module.exports = {
    signalUpdateStateRunner,
    signalSendRequestRunner,
    responseUpdateStateRunner,
    responseErrorRunner
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let parser = __webpack_require__(71);
let {
    checkAST,
    runTimeCheck,
    getVariable
} = __webpack_require__(95);

let {
    T_ATOM,
    T_PATH,
    T_ASSIGN,
    T_DELETE,
    T_APPEND,
    T_VARIABLE_NAME,
    T_FUNCTION,
    T_NODE_NAME,
    T_NODE_NAME_VARIABLE
} = __webpack_require__(17);

let executeAST = (ast, {
    queryByPath,
    setByPath,
    removeByPath,
    appendByPath,
    variableMap = {},
    variableStub = {},
    skipCheck = false
}) => {
    // TODO check params
    // check variableStub

    if (!skipCheck) {
        runTimeCheck(variableStub, variableMap);
    }

    let open = [];
    for (let i = 0; i < ast.length; i++) {
        open.unshift({
            node: ast[i],
            visited: false
        });
    }

    let valueStack = [];

    while (open.length) {
        let top = open[open.length - 1];
        let topNode = top.node;
        if (topNode.type === T_ATOM) {
            valueStack.push(topNode.value);
            open.pop();
        } else if (topNode.type === T_VARIABLE_NAME) { // pickup variable
            let variableName = topNode.value;
            let variableValue = getVariable(variableName, variableMap, variableStub);
            valueStack.push(variableValue);
            open.pop();
        } else if (topNode.type === T_PATH) {
            valueStack.push(queryByPath(resolvePath(topNode.value, variableMap)));
            open.pop();
        } else if (topNode.type === T_FUNCTION) {
            let {
                funName,
                params
            } = topNode.value;

            if (top.visited) {
                // get value from value stack
                let paramValues = [];
                for (let i = 0; i < params.length; i++) {
                    paramValues.push(valueStack.pop());
                }
                valueStack.push(variableMap[funName](...paramValues));
                open.pop();
            } else {
                top.visited = true;
                for (let i = 0; i < params.length; i++) {
                    open.push({
                        node: params[i],
                        visited: false
                    });
                }
            }
        } else if (topNode.type === T_ASSIGN) {
            let {
                path,
                value
            } = topNode.value;

            if (top.visited) {
                let assignValue = valueStack.pop();
                valueStack.push(setByPath(resolvePath(path.value, variableMap), assignValue));
                open.pop();
            } else {
                top.visited = true;
                open.push({
                    node: value,
                    visited: false
                });
            }
        } else if (topNode.type === T_DELETE) {
            let {
                path
            } = topNode.value;

            valueStack.push(removeByPath(resolvePath(path.value, variableMap)));
            open.pop();
        } else if (topNode.type === T_APPEND) {
            let {
                path,
                value
            } = topNode.value;

            if (top.visited) {
                let assignValue = valueStack.pop();
                valueStack.push(appendByPath(resolvePath(path.value, variableMap), assignValue));
                open.pop();
            } else {
                top.visited = true;
                open.push({
                    node: value,
                    visited: false
                });
            }
        }
    }

    return valueStack[valueStack.length - 1];
};

let resolvePath = (path, variableMap) => {
    let ret = [];
    for (let i = 0; i < path.length; i++) {
        let {
            type,
            value
        } = path[i];
        if (type === T_NODE_NAME) {
            ret.push(value);
        } else if (type === T_NODE_NAME_VARIABLE) {
            ret.push(variableMap[value]);
        }
    }

    return ret;
};

let parseStrToAst = (str) => {
    let handleChunk = parser();
    if (str) {
        handleChunk(str);
    }
    return handleChunk(null);
};

module.exports = {
    parser,
    parseStrToAst,
    executeAST,
    checkAST
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let streamTokenSpliter = __webpack_require__(25);
let {
    LR
} = __webpack_require__(81);
let {
    getProductionId,
    processTokens,
} = __webpack_require__(32);
let tokenTypes = __webpack_require__(92);
let {
    ACTION,
    GOTO
} = __webpack_require__(94);

let {
    P_PROGRAM,

    P_EXPRESSION_LIST_0,
    P_EXPRESSION_LIST_1,

    P_EXPRESSION_0,
    P_EXPRESSION_1,
    P_EXPRESSION_2,

    P_UPDATE_EXPRESSION_0,
    P_UPDATE_EXPRESSION_1,
    P_UPDATE_EXPRESSION_2,

    P_QUERY_EXPRESSION_0,
    P_QUERY_EXPRESSION_1,
    P_QUERY_EXPRESSION_2,
    P_QUERY_EXPRESSION_3,
    P_QUERY_EXPRESSION_4,

    P_QUERY_EXPRESSION_LIST_0,
    P_QUERY_EXPRESSION_LIST_1,

    P_PATH_0,
    P_PATH_1,
    P_PATH_2,
    P_PATH_3,

    P_ATOM_DATA_0,
    P_ATOM_DATA_1,
    P_ATOM_DATA_2,
    P_ATOM_DATA_3,
    P_ATOM_DATA_4,

    T_ATOM,
    T_PATH,
    T_ASSIGN,
    T_DELETE,
    T_APPEND,
    T_VARIABLE_NAME,
    T_FUNCTION,
    T_NODE_NAME,
    T_NODE_NAME_VARIABLE
} = __webpack_require__(17);

module.exports = () => {
    let tokenSpliter = streamTokenSpliter.parser(tokenTypes);

    // TODO optimization AST
    let lrParse = LR(ACTION, GOTO, {
        // when reduce prodcution, translate at the sametime
        reduceHandler: (production, midNode) => {
            switch (getProductionId(production)) {
                case P_PROGRAM:
                    midNode.value = midNode.children[0].value;
                    break;

                case P_EXPRESSION_LIST_0:
                    midNode.value = midNode.children[0].value === null ? [] : [midNode.children[0].value];
                    break;

                case P_EXPRESSION_LIST_1:
                    midNode.value = (midNode.children[0].value === null ? [] : [midNode.children[0].value]).concat(midNode.children[2].value);
                    break;

                case P_EXPRESSION_0:
                    midNode.value = midNode.children[0].value;
                    break;

                case P_EXPRESSION_1:
                    midNode.value = midNode.children[0].value;
                    break;

                case P_EXPRESSION_2: // empty situation
                    midNode.value = null;
                    break;

                case P_UPDATE_EXPRESSION_0:
                    midNode.value = {
                        type: T_ASSIGN,
                        value: {
                            path: midNode.children[0].value,
                            value: midNode.children[2].value
                        }
                    };
                    break;

                case P_UPDATE_EXPRESSION_1:
                    midNode.value = {
                        type: T_DELETE,
                        value: {
                            path: midNode.children[1].value,
                        }
                    };
                    break;

                case P_UPDATE_EXPRESSION_2:
                    midNode.value = {
                        type: T_APPEND,
                        value: {
                            path: midNode.children[1].value,
                            value: midNode.children[3].value
                        }
                    };
                    break;

                case P_QUERY_EXPRESSION_0:
                    midNode.value = midNode.children[0].value;
                    break;

                case P_QUERY_EXPRESSION_1:
                    midNode.value = {
                        type: T_VARIABLE_NAME,
                        value: midNode.children[0].token.text
                    };
                    break;

                case P_QUERY_EXPRESSION_2:
                    midNode.value = midNode.children[0].value;
                    break;

                case P_QUERY_EXPRESSION_3:
                    midNode.value = {
                        type: T_FUNCTION,
                        value: {
                            funName: midNode.children[0].token.text,
                            params: []
                        }
                    };
                    break;

                case P_QUERY_EXPRESSION_4:
                    midNode.value = {
                        type: 'function',
                        value: {
                            funName: midNode.children[0].token.text,
                            params: midNode.children[2].value
                        }
                    };
                    break;

                case P_QUERY_EXPRESSION_LIST_0:
                    midNode.value = [midNode.children[0].value];
                    break;

                case P_QUERY_EXPRESSION_LIST_1:
                    midNode.value = [midNode.children[0].value].concat(midNode.children[2].value);
                    break;

                case P_PATH_0:
                    midNode.value = {
                        type: T_PATH,
                        value: [{
                            type: T_NODE_NAME,
                            value: midNode.children[0].token.text.substring(1)
                        }]
                    };
                    break;

                case P_PATH_1:
                    midNode.value = {
                        type: T_PATH,
                        value: [{
                            type: T_NODE_NAME,
                            value: midNode.children[0].token.text.substring(1)
                        }].concat(midNode.children[1].value.value)
                    };
                    break;

                case P_PATH_2:
                    var nodeNameVarTxt = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_PATH,
                        value: [{
                            type: T_NODE_NAME_VARIABLE,
                            value: nodeNameVarTxt.substring(2, nodeNameVarTxt.length - 1).trim()
                        }]
                    };
                    break;

                case P_PATH_3:
                    var nodeNameVarTxt2 = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_PATH,
                        value: [{
                            type: T_NODE_NAME_VARIABLE,
                            value: nodeNameVarTxt2.substring(2, nodeNameVarTxt2.length - 1).trim()
                        }].concat(midNode.children[1].value.value)
                    };
                    break;

                case P_ATOM_DATA_0:
                    midNode.value = {
                        type: T_ATOM,
                        value: true
                    };
                    break;

                case P_ATOM_DATA_1:
                    midNode.value = {
                        type: T_ATOM,
                        value: false
                    };
                    break;

                case P_ATOM_DATA_2:
                    midNode.value = {
                        type: T_ATOM,
                        value: null
                    };
                    break;

                case P_ATOM_DATA_3:
                    var text = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_ATOM,
                        value: JSON.parse(text)
                    };
                    break;

                case P_ATOM_DATA_4:
                    var numText = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_ATOM,
                        value: Number(numText)
                    };
                    break;
            }
        }
    });

    // handle chunk data
    return (chunk) => {
        let str = chunk && chunk.toString();
        let tokens = processTokens(tokenSpliter(str));

        for (let i = 0; i < tokens.length; i++) {
            lrParse(tokens[i]);
        }

        // means finished chunks
        if (chunk === null) {
            let ast = lrParse(null);
            return ast.children[0].value;
        }
    };
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString, funType, listType, isFunction, mapType, isFalsy, isNumber, or
} = __webpack_require__(0);

let {
    WAIT, MATCH, QUIT
} = __webpack_require__(15);

let {
    stateGraphDSL
} = __webpack_require__(9);

let buildFSM = __webpack_require__(78);

let {
    map
} = __webpack_require__(1);

let {
    getMatch
} = __webpack_require__(79);

let {
    findToken,
    filterTypes
} = __webpack_require__(80);

let {
    assembleToken
} = __webpack_require__(29);

/**
 *
 * A token spliter used to split stream string.
 *
 * When accept a chunk, parsing it at the same time.
 *
 * ## options
 *
 * tokenTypes = [
 *  {
 *      name,
 *      priority,
 *      match
 *  }
 * ]
 *
 * - priority
 *
 *    When meets ambiguity, priority will be helpful.
 *
 *    Assume we got two types: \w*, \s. When split "today is a good day". If we set \s has a higher priority, we will get ["t", "o", "d", "a", "y", " ", "i", "s", " ", "a", " ", "g", "o", "o", "d", " ", "d", "a", "y"], just one token. If we set \w* has a higher priority, we will get ["today", " ", "is", " ", "a", " ", "good", " ", "day"].
 *
 * - match (letter, prefix) -> WAIT | MATCH | QUIT
 *
 *     Because we are handling chunks, we need to know finished a chunk or not.
 *
 * ## rules
 *
 * - priority rule
 *
 * - longest matching
 *
 * eg: four rules a(def, 1), b(default[s?], 2), c(/\w\w+/, 0), d(_, 2)
 *
 * ```
 * input     isPart     match
 * d         (a, b, c)  ()
 * de        (a, b, c)  (c:0)
 * def       (a, b, c)  (a:1, c:0)
 * defa      (b, c)     (c:0)
 * defau     (b, c)     (c:0)
 * defaul    (b, c)     (c:0)
 * default   (b, c)     (b:2, c:0)
 * defaults  (b, c)     (b:2, c:0)
 * defaults_ ()         ()
 * ```
 *
 * When empty situation happend, analysis the process.
 *
 * ```
 * 1. possible situations
 *    de        (a, b, c)  (c:0)
 *    def       (a, b, c)  (a:1, c:0)
 *    defa      (b, c)     (c:0)
 *    defau     (b, c)     (c:0)
 *    defaul    (b, c)     (c:0)
 *    default   (b, c)     (b:2, c:0)
 *    defaults  (b, c)     (b:2, c:0)
 *
 * 2. for any rule (a, b, c) only consider it's biggest matching situation. (longest matching rule)
 *    def       (a, b, c)  (a:1)            longest for a
 *    defaults  (b, c)     (b:2, c:0)       longest for b and c
 *
 * 3. choose the highest priority rule. (priority rule)
 *    defaults (b:2)
 * ```
 */

let parser = funType((tokenTypes) => {
    tokenTypes = map(tokenTypes, (tokenType) => {
        let {
            priority, name, independent, match
        } = tokenType;

        name = name || (match && match.toString());

        match = getMatch(match);

        if (!isFunction(match)) {
            throw new Error(`Error match in token type ${strTokenType(tokenType)}`);
        }

        return {
            priority: priority || 0,
            name: name,
            match,
            independent
        };
    });

    let stock = '';

    return (chunk) => {
        if (chunk === null) { // means finished
            let tokens = splitTokensToEnd(stock, tokenTypes);

            stock = '';
            return tokens;
        }
        stock += chunk.toString();
        let {
            rest, tokens
        } = splitTokens(stock, tokenTypes);

        stock = rest;

        return tokens;
    };
}, [
    listType(mapType({
        priority: or(isFalsy, isNumber),
        name: or(isFalsy, isString)
    }))
]);

let strTokenType = ({
    priority, match, name, independent
}) => {
    return `{
        priority: ${priority},
        match: ${match},
        name: ${name},
        independent: ${independent}
    }`;
};

parser.parse = (str, tokenTypes) => {
    let parse = parser(tokenTypes);
    return parse(str).concat(parse(null));
};

let splitTokensToEnd = (stock, tokenTypes) => {
    let {
        tokens
    } = splitTokens(stock, tokenTypes, 'end');
    return tokens;
};

let splitTokens = (stock, tokenTypes, type) => {
    let ret;
    let tokens = [];
    while (stock && (ret = getToken(stock, tokenTypes, type))) {
        let {
            token, rest
        } = ret;
        stock = rest;

        tokens.push(token);
    }

    return {
        tokens,
        rest: stock
    };
};

/**
 * type = 'mid' | 'end'
 *
 * get toke from stock based on tokenTypes
 */
let getToken = (stock, tokenTypes, type = 'mid') => {
    let next = stock;

    let prefix = ''; // used to store current prefix
    let retMatrix = [];

    let restTypes = tokenTypes;

    while (next) {
        let nextLetter = next[0];
        prefix += nextLetter;

        // shorten next
        next = next.substring(1);
        let [partTypes, matchTypes, independentType] = filterTypes(nextLetter, prefix, restTypes);

        restTypes = partTypes; // reduce types

        // see if there is a independent token type
        // find independent token

        if (independentType) {
            return splitTokenRet(
                assembleToken(independentType, prefix),
                stock
            );
        }

        // obey longest match rule
        // no matchs futher, means look forward more won't get any matchs
        if (!partTypes.length && !matchTypes.length) {
            return fetchToken(stock, retMatrix, prefix);
        } else {
            retMatrix.push({
                partTypes,
                matchTypes,
                prefix
            });
        }
    }

    // if this is end, fetchToken
    if (prefix === stock && type === 'end') { // match stop point
        return fetchToken(stock, retMatrix, prefix);
    }

    return null;
};

let fetchToken = (stock, retMatrix, prefix) => {
    // empty
    let token = findToken(retMatrix);
    if (!token) {
        throw new Error(`Can not find token from prefix "${prefix}". And prefix is not any part of token. stock is "${stock}".`);
    }
    return splitTokenRet(token, stock);
};

let splitTokenRet = (token, stock) => {
    return {
        token,
        rest: stock.substring(token.text.length)
    };
};

module.exports = {
    parser, WAIT, QUIT, MATCH, stateGraphDSL, buildFSM
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    QUIT, WAIT, MATCH
} = __webpack_require__(74);

let stateGraphDSL = __webpack_require__(75);

const START_STATE = '__start__state__';

let fsm = (stateMap) => {
    // parse stateMap
    let {
        transitions, acceptStateMap
    } = stateGraphDSL.transitionMaper(
        stateGraphDSL.g(START_STATE,
            stateGraphDSL.c(null, stateMap)));

    let dfa = new DFA(transitions, acceptStateMap);

    // matching function
    return (letter) => {
        return dfa.transit(letter);
    };
};

let DFA = function(stateMap, acceptStateMap) {
    this.currentState = START_STATE;
    this.stateMap = stateMap;
    this.acceptStateMap = acceptStateMap;
};

let proto = DFA.prototype;

proto.transit = function(letter) {
    let subMap = this.stateMap[this.currentState];
    if (!subMap) return {
        type: QUIT,
        state: this.currentState
    };

    // transit to target state
    let targetState = subMap(letter);

    if (stateGraphDSL.isEpsilonTransition(targetState)) {
        this.currentState = targetState.state; // epsilon transition
        return this.transit(letter);
    }

    if (targetState === undefined) {
        return {
            type: QUIT,
            state: this.currentState
        };
    }

    this.currentState = targetState;
    if (this.acceptStateMap[targetState]) return {
        type: MATCH,
        state: this.currentState
    };

    return {
        type: WAIT,
        state: this.currentState
    };
};

module.exports = {
    fsm,
    stateGraphDSL,
    DFA,
    QUIT,
    WAIT,
    MATCH
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    WAIT: 2,
    MATCH: 1,
    QUIT: 0
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let actionDSL = __webpack_require__(26);

let {
    isNormalAction, isRangeAction, isUnionAction, isLeftAction, isEpsilonAction
} = actionDSL;

let {
    graph,
    connect,

    repeat,
    sequence,

    circle,

    isEpsilonTransition
} = __webpack_require__(76);

let {
    mergeMap
} = __webpack_require__(27);

let transitionMaper = (graph) => {
    let transitions = {};
    let {
        transitionMap
    } = graph;

    let accepts = getEndStates(graph);

    let leftMap = getLeftActionMap(transitionMap);
    let epsilonMap = getEpsilonActionMap(transitionMap);

    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];

        transitions[stateName] = (letter) => {
            for (let i = transitList.length - 1; i >= 0; i--) {
                let {
                    state, action
                } = transitList[i];

                if (matchAction(action, letter)) return state;
            }

            // check rest
            if (leftMap[stateName]) return leftMap[stateName];

            if (epsilonMap[stateName]) {
                return {
                    type: 'deliver',
                    state: epsilonMap[stateName]
                };
            }
        };
    }

    return {
        transitions,
        acceptStateMap: getAcceptStateMap(epsilonMap, accepts)
    };
};

/**
 * a end state's out-degree = 0
 */
let getEndStates = (graph) => {
    let outDegreeMap = getOutDegreeMap(graph);
    let ends = [];
    for (let name in outDegreeMap) {
        if (outDegreeMap[name] === 0) {
            ends.push(name);
        }
    }

    return ends;
};

let getOutDegreeMap = (graph) => {
    let outDegreeMap = {};
    let {
        transitionMap
    } = graph;
    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];
        outDegreeMap[stateName] = transitList.length;
        for (let i = 0; i < transitList.length; i++) {
            let {
                state
            } = transitList[i];
            outDegreeMap[state] = outDegreeMap[state] || 0;
        }
    }

    return outDegreeMap;
};

/**
 * epsilon chain
 */
let getAcceptStateMap = (epsilonMap, accepts) => {
    let acceptStateMap = {};

    let reverseEpsilonMap = {};
    for (let name in epsilonMap) {
        let tar = epsilonMap[name];
        reverseEpsilonMap[tar] = reverseEpsilonMap[tar] || [];
        reverseEpsilonMap[tar].push(name);
    }

    for (let i = 0; i < accepts.length; i++) {
        let accept = accepts[i];
        acceptStateMap[accept] = true;
    }

    let count = 0;

    while (true) { // eslint-disable-line
        let prevCount = count;

        for (let name in acceptStateMap) {
            let list = reverseEpsilonMap[name];
            if (list) {
                for (let j = 0; j < list.length; j++) {
                    if (!acceptStateMap[list[j]]) {
                        acceptStateMap[list[j]] = true;
                        count++;
                    }
                }
            }
        }

        if (count === prevCount) { // no more
            break;
        }
    }

    return acceptStateMap;
};

let matchAction = (action, letter) => {
    if (isNormalAction(action) && action.content === letter) return true;
    if (isRangeAction(action) && action.start <= letter && letter <= action.end) return true;
    if (isUnionAction(action)) {
        let {
            actions
        } = action;

        for (let i = 0; i < actions.length; i++) {
            if (matchAction(actions[i], letter)) return true;
        }
    }

    return false;
};

let getEpsilonActionMap = (transitionMap) => {
    let map = {};

    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];
        let tarState = findActionState(transitList, isEpsilonAction);
        if (tarState) {
            map[stateName] = tarState;
        }
    }

    return map;
};

let getLeftActionMap = (transitionMap) => {
    let map = {};
    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];
        let tarState = findActionState(transitList, isLeftAction);
        if (tarState) {
            map[stateName] = tarState;
        }
    }
    return map;
};

let findActionState = (transitList, type) => {
    for (let i = transitList.length - 1; i >= 0; i--) {
        let {
            action, state
        } = transitList[i];
        if (containActionType(action, type)) {
            return state;
        }
    }
};

let containActionType = (action, type) => {
    if (isUnionAction(action)) {
        let {
            actions
        } = action;

        for (let i = 0; i < actions.length; i++) {
            if (containActionType(actions[i], type)) return true;
        }
    } else {
        return type(action);
    }

    return false;
};

module.exports = mergeMap(actionDSL, {
    graph,
    connect,

    transitionMaper,
    repeat,
    sequence,

    circle,

    isEpsilonTransition,

    g: graph, c: connect
});


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString, isObject
} = __webpack_require__(0);

let actionDSL = __webpack_require__(26);

let {
    toAction
} = actionDSL;

let {
    mergeMap
} = __webpack_require__(27);

/**
 * graph definition DSL
 *
 * state    action
 *
 * transition: (startState, action, nextState)
 *
 */

/**
 * graph(s1,
 *     connect(a1, graph(s2,
 *         connect(a3, s4),
 *         connect(a4, s5)
 *     )),
 *
 *     connect(a2, s3)
 *  )
 */

let count = 0;
let autoGraphState = () => {
    return `__auto_state_name_${count++}`;
};

/**
 * graph data = {
 *    transitions: [
 *      [action, nextGraph]
 *    ],
 *    state
 * }
 */
let graph = (...args) => {
    let state = null,
        lines = null;

    if (isString(args[0])) {
        state = args[0];
        lines = args.slice(1);
    } else {
        state = autoGraphState();
        lines = args;
    }

    let transitionMap = {};

    transitionMap[state] = [];

    for (let i = 0; i < lines.length; i++) {
        let {
            action, nextGraph
        } = lines[i];

        let nextState = isString(nextGraph) ? nextGraph : nextGraph.state;

        transitionMap[state].push({
            action,
            state: nextState
        });

        // merge transitionMap
        for (let name in nextGraph.transitionMap) {
            if (transitionMap[name]) {
                throw new Error(`repeated state name for different state, name is ${name}`);
            }
            transitionMap[name] = nextGraph.transitionMap[name];
        }
    }

    return {
        state,
        transitionMap
    };
};

let connect = (action, nextGraph) => {
    action = toAction(action);
    if(!nextGraph) nextGraph = autoGraphState();
    return {
        action,
        nextGraph
    };
};

/**
 * circle: repeat at least 0 times
 */
let circle = (action, nextGraph) => {
    let stateName = autoGraphState();

    return graph(stateName,
        connect(action, stateName),
        connect(null, nextGraph)
    );
};

let repeat = (action, times, nextGraph) => {
    let args = [];
    for (let i = 0; i < times; i++) {
        args.push(action);
    }
    args.push(nextGraph);

    return sequence(...args);
};

let sequence = (...args) => {
    let actions = args.slice(0, -1);
    let nextGraph = args[args.length - 1];
    let action = actions[0];
    if (actions.length <= 1) {
        return connect(action, nextGraph);
    }

    let nexts = actions.slice(1).concat([nextGraph]);

    return connect(action, graph(sequence(...nexts)));
};

let isEpsilonTransition = (v) => {
    return isObject(v) && v.type === 'deliver';
};

module.exports = mergeMap(actionDSL, {
    graph,
    connect,

    repeat,
    sequence,

    circle,

    isEpsilonTransition
});


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    iterate
} = __webpack_require__(28);

let {
    isFunction
} = __webpack_require__(0);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = isFunction(item) ? item : (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let reverse = (list) => reduce(list, (prev, cur) => {
    prev.unshift(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

let overArgs = (func, transform) => {
    return (...args) => {
        let newArgs = transform(...args);
        return func(...newArgs);
    };
};

module.exports = {
    overArgs,
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact,
    reverse
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const START_STATE = '__start__state__';

let {
    stateGraphDSL, DFA
} = __webpack_require__(9);

/**
 * build a fda to do the matching work
 *
 * transit: (currentState, letter) -> nextState
 */
module.exports = (stateMap, accepts) => {
    let m = null;

    // parse stateMap
    let {
        transitions, acceptStateMap
    } = stateGraphDSL.transitionMaper(
        stateGraphDSL.g(START_STATE,
            stateGraphDSL.c(null, stateMap)),
        accepts);

    return (prefix, letter) => {
        if (prefix.length === 1) {
            m = new DFA(transitions, acceptStateMap);
            return m.transit(letter).type;
        } else {
            return m.transit(letter).type;
        }
    };
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString, isFunction
} = __webpack_require__(0);

let {
    MATCH, WAIT, QUIT
} = __webpack_require__(15);

let stringMatch = (word) => (prefix) => {
    if (word === prefix) return MATCH;
    if (word.indexOf(prefix) !== -1) return WAIT;
    return QUIT;
};

let getMatch = (match) => {
    if (isFunction(match)) return match;
    if (isString(match)) return stringMatch(match);
    // TODO analysis regular expression
};

module.exports = {
    getMatch
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    WAIT, MATCH
} = __webpack_require__(15);

let {
    assembleToken
} = __webpack_require__(29);

let filterTypes = (nextLetter, prefix, tokenTypes) => {
    let parts = [],
        matchs = [],
        independentType = null;

    let len = tokenTypes.length;

    for (let i = 0; i < len; i++) {
        let tokenType = tokenTypes[i];
        let ret = tokenType.match(prefix, nextLetter);

        if (ret === WAIT) {
            parts.push(tokenType);
        } else if (ret === MATCH) { // matched
            matchs.push(tokenType);
            parts.push(tokenType);
            if (!independentType && tokenType.independent) {
                independentType = tokenType;
            }
        }
    }

    return [parts, matchs, independentType];
};

let findToken = (retMatrix) => {
    let prev = null;

    for (let i = 0; i < retMatrix.length; i++) {
        let {
            prefix, matchTypes
        } = retMatrix[i];

        for (let j = 0; j < matchTypes.length; j++) {
            let tokenType = matchTypes[j];
            if (!prev ||
                tokenType.priority > prev.tokenType.priority ||
                (tokenType.priority === prev.tokenType.priority && prefix.length > prev.text.length)
            ) {
                prev = assembleToken(tokenType, prefix);
            }
        }
    }

    return prev;
};

module.exports = {
    findToken,
    filterTypes
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @readme-quick-run
 *
 * build LR1 table
 *
 * ## test tar=js r_c=syntaxer
 *
 * let {buildLR1Table} = syntaxer;
 * let lr1Table = buildLR1Table({
 *     startSymbol: 'S',
 *     N: ['S'],
 *     T: ['a'],
 *     productions: [
 *         ['S', ['a']] // s -> a
 *     ]
 * });
 * console.log(JSON.stringify(lr1Table, null, 4));
 */

/**
 * @readme-quick-run
 *
 * generate ast from LR table
 *
 * ## test tar=js r_c=syntaxer
 *
 * let {buildLR1Table, LR} = syntaxer;
 * let {ACTION, GOTO} = buildLR1Table({
 *     startSymbol: 'S',
 *     N: ['S'],
 *     T: ['a'],
 *     productions: [
 *         ['S', ['a']] // s -> a
 *     ]
 * });
 * let lrParse = LR(ACTION, GOTO);
 * lrParse({ // accept a token
 *   name: 'a',
 *   text: 'abc'
 * });
 * let ast = lrParse(null); // null as end symbol
 * console.log(JSON.stringify(ast, null, 4));
 */
module.exports = __webpack_require__(82);


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * syntax analysis
 *
 * background knowledge
 *
 * 1. context free grammer
 *    terminal symbol
 *    non-terminal symbol
 *    begin symbol
 *    production
 *          left -> right
 * 2. shift-in reduce
 */

let LR = __webpack_require__(83);
let LR1Table = __webpack_require__(86);
let ctxFreeGrammer = __webpack_require__(91);
let {
    forEach
} = __webpack_require__(5);

/**
 * just used for testing
 */
let parse = (g, handlers) => {
    let {
        ACTION, GOTO
    } = LR1Table(ctxFreeGrammer(g));

    return (tokens) => {
        let parser = LR(ACTION, GOTO, handlers);
        forEach(tokens, parser);
        return parser(null);
    };
};

let buildLR1Table = (g) => {
    let grammer = ctxFreeGrammer(g);
    return LR1Table(grammer);
};

module.exports = {
    LR, LR1Table, parse, ctxFreeGrammer, buildLR1Table
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * LR ananlysis algorithm
 *
 * input: grammer G's analysis table and a string ω
 * output: if ω ϵ L(G), get the bottom-up analysis, otherwise error
 *
 * - init: (S₀, a₁a₂...an$)
 *
 * - assume current configuration is (S₀X₁S₁...Sm, aiai₊₁...an$)
 *
 *    (1) if action[Sm, ai] = shift S, S = GOTO[Sm, ai], then we got new configuration:
 *          (S₀X₁S₁..XmSm ai S, ai₊₁...an$)
 *    (2) if action[Sm, ai] = reduce by A → β, |β| = r,then:
 *          S = GOTO[Sm₋r, A];
 *          (S₀X₁S₁...Xm₋rSm₋rAS, aiai₊₁...an$)
 *    (3) if action[Sm, ai] = accept, success
 *    (4) if action[Sm, ai] = error, error
 */

let {
    END_SYMBOL, EXPAND_START_SYMBOL
} = __webpack_require__(30);

let {
    initAST,
    reduceAST,
    appendToken
} = __webpack_require__(84);

/**
 * configuration = [stack, tokens]
 *
 * stack = [S₀X₁S₁...XmSm], Xi ϵ T U N, Si stands for state
 *
 * @param action function (state, termalSymbol) -> shift | reduce | accept | error
 *      return of action function, is a object: {type, production, errorMsg}
 *      production = [head, body:[]]
 */
module.exports = (ACTION, GOTO, {
    reduceHandler,
    acceptHandler
} = {}) => {
    // initial configuration
    let configuration = initConfiguration();

    // initial ast
    let ast = initAST(EXPAND_START_SYMBOL);

    let action = (state, token) => {
        let act = ACTION[state][token.name];
        if (!act) {
            return {
                type: 'error',
                errorMsg: `unexpected symbol (token.name) ${token.name}, token (token.text) is ${token.text}. Try to find ACTION from state ${state}.`
            };
        } else {
            return act;
        }
    };

    let goTo = (state, token) => {
        let nextState = GOTO[state][token.name];
        if (nextState === undefined) {
            throw new Error(`fail to goto state from ${state} and symbol (token.name) is ${token.name}, token (token.text) is ${token.text}. Try to do GOTO from state ${state}, but next state not exists.`);
        }
        return nextState;
    };

    let analysis = () => {
        let topState = getTopState(configuration);
        let token = getNextInputToken(configuration);
        // look up action
        let ret = action(topState, token);

        switch (ret.type) {
            case 'shift':
                shift(configuration, ret.state, token);
                ast = appendToken(ast, token);
                break;
            case 'reduce':
                // reduce production
                ast = reduce(ast, ret.production, configuration, goTo, reduceHandler);
                break;
            case 'error':
                // error handle
                throw new Error(ret.errorMsg);
            case 'accept':
                // clear configration
                configuration[1] = [];
                acceptHandler && acceptHandler(ast); // accept handle
                break;
            default:
                throw new Error(`unexpected action type ${ret.type}, when try to recoginise from [${topState}, ${token.name}]. Token is ${token.text}`);
        }
    };

    /**
     * @param token Object
     *   accept token as stream
     *   token = {
     *        name,
     *        other...
     *   }
     *
     *   if toke is null, means end of input
     */
    return (token) => {
        if (token === null) {
            // check state of the configuration
            configuration[1].push({
                name: END_SYMBOL
            });
            while (configuration[1].length) {
                analysis();
            }

            return ast;
        } else {
            // add token to configuration
            configuration[1].push(token);
            while (configuration[1].length > 1) {
                analysis();
            }
        }
    };
};

let initConfiguration = () => {
    // initial configuration
    return [
        [0], // stack
        [] // input
    ];
};

// (S₀X₁S₁..XmSm, aiai₊₁...an$) -> (S₀X₁S₁..XmSm ai S, ai₊₁...an$)
// S = GOTO(Sm, ai);
let shift = (configuration, state, token) => {
    let stack = configuration[0];
    let tokens = configuration[1];
    stack.push(token, state);
    tokens.shift();
};

// (S₀X₁S₁..XmSm, aiai₊₁...an$) -> (S₀X₁S₁...Xm₋rSm₋rAS, aiai₊₁...an$)
// A → β, r = |β|
// S = GOTO(Sm₋r, A)
let reduce = (ast, [head, body], configuration, goTo, reduceHandler) => {
    let stack = configuration[0];
    let reducedTokens = [];
    for (let i = 0; i < body.length; i++) {
        stack.pop(); // pop state
        reducedTokens.push(stack.pop()); // pop token
    }
    let top = getTopState(configuration);
    stack.push(head);
    stack.push(goTo(top, {
        name: head,
        text: `[none terminal symbol] ${head}`
    }));

    let {newAst, midNode} = reduceAST(ast,
        ast.children.length - body.length, // start position
        ast.children.length - 1, // end position
        head);

    reduceHandler && reduceHandler([head, body], midNode, reducedTokens, ast);
    return newAst;
};

let getTopState = (configuration) => {
    let stack = configuration[0];
    return stack[stack.length - 1];
};

let getNextInputToken = (configuration) => {
    let tokens = configuration[1];
    return tokens[0];
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * reduce production to generate a AST
 *
 * s *rm=> αAω *rm=> αβω
 *
 * reduce from αβω to αAω by A → β
 *
 * current AST:
 *           S
 *        /  |  \
 *       /  / \  \
 *      α    β    ω
 *     / \  / \  / \
 *     ...  ...  ...
 *
 * reduce by A → β
 *
 * result AST:
 *           S
 *        /  |  \
 *       /   A   \
 *      /   / \   \
 *     α     β     ω
 *    / \   / \   / \
 *    ...   ...   ...
 *
 * AST data structure
 * node = {
 *      type: terminal | none-terminal,
 *      symbol,
 *      token,
 *      children: [node]
 * }
 *
 * reduce start point: a token list
 * reduce end point: S → r
 *
 * 1. init AST from a list of token
 *
 * 2. reduce production to expand AST
 */

let {
    map
} = __webpack_require__(5);

const TERMINAL_TYPE = 'terminal';
const NONE_TERMINAL_TYPE = 'none-terminal';

/**
 * @param startSymbol String
 * @param tokens Array
 *
 * @return ast Object
 *
 * tokens = [{
 *     name,
 *     text
 * }]
 */
let initAST = (startSymbol, tokens = []) => {
    return {
        type: NONE_TERMINAL_TYPE,
        symbol: startSymbol,
        children: map(tokens, tokenToLeaf)
    };
};

let tokenToLeaf = (token) => {
    return {
        type: TERMINAL_TYPE,
        symbol: token.name,
        token
    };
};

/**
 * s *rm=> αAω *rm=> αβω
 *
 * reduce from αβω to αAω by A → β
 *
 * @param ast
 * @param start
 * @param end
 * @param leftSymbol
 *
 * @return ast
 *
 * β = ast.children[start] ~ ast.children[end]
 *
 * 1. remove β from ast, replace with A
 * 2. make every elements of β as A's child
 */
let reduceAST = (ast, start = 0, end = 0, leftSymbol) => {
    // generate a new middle node, which will hang beta nodes
    let midNode = {
        type: NONE_TERMINAL_TYPE,
        symbol: leftSymbol
    };

    let beta = ast.children.splice(start, end - start + 1, midNode);
    midNode.children = beta;

    return {newAst: ast, midNode};
};

/**
 * @param ast
 * @param token
 */
let appendToken = (ast, token) => {
    ast.children.push(tokenToLeaf(token));
    return ast;
};

module.exports = {
    initAST,
    reduceAST,
    appendToken
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    iterate
} = __webpack_require__(31);

let {
    isFunction
} = __webpack_require__(0);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = isFunction(item) ? item : (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let reverse = (list) => reduce(list, (prev, cur) => {
    prev.unshift(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

let overArgs = (func, transform) => {
    return (...args) => {
        let newArgs = transform(...args);
        return func(...newArgs);
    };
};

module.exports = {
    overArgs,
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact,
    reverse
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let LR1CanonicalCollection = __webpack_require__(87);
let {
    forEach, findIndex
} = __webpack_require__(5);
let GO = __webpack_require__(88);
let {
    LR1Itemer
} = __webpack_require__(89);
let {
    sameClosure
} = __webpack_require__(16);

module.exports = (grammer) => {
    let {
        END_SYMBOL, isTerminalSymbol, N
    } = grammer;

    let ACTION = [], // action table
        GOTO = []; // goto table

    let LR1Grammer = LR1Itemer(grammer);
    let go = GO(grammer, LR1Grammer);

    let C = LR1CanonicalCollection(grammer, LR1Grammer, go);

    forEach(C, (I, index) => {
        ACTION[index] = ACTION[index] || {};

        // item = [head, body, dotPosition, forwards]

        forEach(I.items, (item) => {
            // [S`→ S., $] ϵ Ii
            if (LR1Grammer.isAcceptItem(item)) {
                //
                ACTION[index][END_SYMBOL] = {
                    type: 'accept'
                };
            } else if (item.isReduceItem()) { // [A → α., a] ϵ Ii, A≠S`
                forEach(item.getForwards(), (a) => {
                    ACTION[index][a] = {
                        type: 'reduce',
                        production: item.getProduction()
                    };
                });
            } else if (isTerminalSymbol(item.getNextSymbol())) {
                let Ij = go(I, item.getNextSymbol());

                if (Ij && Ij.items.length) {
                    ACTION[index][item.getNextSymbol()] = {
                        type: 'shift',
                        state: getStateIndex(C, Ij)
                    };
                }
            }
        });
    });

    forEach(C, (I, index) => {
        GOTO[index] = GOTO[index] || {};
        forEach(N, (A) => {
            let Ij = go(I, A);
            if (Ij && Ij.items.length) {
                GOTO[index][A] = getStateIndex(C, Ij);
            }
        });
    });

    return {
        GOTO,
        ACTION
    };
};

let getStateIndex = (C, I) => findIndex(C, I, {
    eq: sameClosure
});


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    buildClosure
} = __webpack_require__(16);
let {
    reduce
} = __webpack_require__(5);

/**
 * input: grammer G
 *
 * output: LR(0) canonical collection
 *
 * item = [head, body, dotPosition];
 *
 * item set = [viable prefix, items]
 */
module.exports = (grammer, LR1Grammer, go) => {
    let {
        symbols
    } = grammer;

    let initClosure = buildClosure([
        LR1Grammer.initItem(grammer)
    ], grammer, LR1Grammer);

    let C = [initClosure];
    let canonicalCollectionMap = {};
    canonicalCollectionMap[initClosure.serializedText] = true;

    let appendedC = C;

    while (true) { // eslint-disable-line
        let newAppendedC = [];

        for (let i = 0; i < appendedC.length; i++) {
            let I = appendedC[i];
            let gotoSet = getGoToSymbolsSet(symbols, I, go);

            for (let j = 0; j < gotoSet.length; j++) {
                let state = gotoSet[j];
                let serializedText = state.serializedText;

                if (!canonicalCollectionMap[serializedText]) {
                    // add new state
                    newAppendedC.push(state);
                    canonicalCollectionMap[serializedText] = true;
                }
            }
        }

        if (!newAppendedC.length) break;

        appendedC = newAppendedC;
        C = C.concat(appendedC);
    }

    return C;
};

let getGoToSymbolsSet = (symbols, I, go) => {
    // for every symbol
    let set = reduce(symbols, (pre, X) => {
        let newState = go(I, X);

        if (newState && newState.items.length) {
            pre.push(newState);
        }
        return pre;
    }, []);

    return set;
};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    reduce, filter
} = __webpack_require__(5);

let {
    buildClosure
} = __webpack_require__(16);

/**
 * jump
 *
 * A→αX.β => A→α.Xβ
 *
 * J = go(I, X) = closure({A→αX.β | A→α.Xβ ϵ I})
 *
 * if one viable prefix of A→αX.β  of I is ρ=δα, then A→α.Xβ in J has viable prefix δαX.
 *
 * @param I
 *    [head, body, dotPosition]
 *
 * @param X
 *    symbol
 *
 * @param productions
 */
module.exports = (grammer, LR1Grammer) => {
    let getStartItems = (I, X) => {
        let nextSymbolX = filter(I.items, (item) => {
            return item.getNextSymbol() === X;
        });

        let startItems = reduce(nextSymbolX, (prev, item) => { // eslint-disable-line
            if (item.restIsNotEmpty()) {
                prev.push(item.nextPositionItem());
            }

            return prev;
        }, []);

        return startItems;
    };

    return (I, X) => {
        let targetClosure = null;

        I.cache_GOTO = I.cache_GOTO || {};

        if (I.cache_GOTO[X]) {
            targetClosure = I.cache_GOTO[X];
        } else {
            let startItems = getStartItems(I, X);

            targetClosure = buildClosure(
                startItems,

                grammer,

                LR1Grammer
            );

            I.cache_GOTO[X] = targetClosure;
        }

        return targetClosure;
    };
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let First = __webpack_require__(90);

let {
    union, reduce, filter, flat, map
} = __webpack_require__(5);

let LR1Itemer = (grammer) => {
    let {
        END_SYMBOL,
        isNoneTerminalSymbol,
        getProductionsOf
    } = grammer;

    let first = First(grammer);

    let buildLR1Item = (production, dotPosition, forwards) => {
        let {
            getHead, getBody, isTerminalSymbol, isEndSymbol
        } = grammer;

        // [A → α.Bβ, a]
        let getNextSymbol = () => {
            return getBody(production)[dotPosition];
        };

        let getForwards = () => forwards;

        let afterNextRest = () => getBody(production).slice(dotPosition + 1);

        let list = () => [getHead(production), getBody(production), dotPosition, forwards];

        // change the forwards
        let concatForwards = (newForwards) => {
            return buildLR1Item(production, dotPosition, union(forwards, newForwards));
        };

        let adjoints = null;

        // [A → α.Bβ, a], FIRST(βa)
        let getAdjoints = () => {
            if (adjoints === null) {
                let beta = afterNextRest();
                let forwards = getForwards();

                let ret = reduce(forwards, (prev, letter) => {
                    let firstSet = beta.length ? first(beta.concat([letter])) : [letter];
                    return prev.concat(filter(firstSet, (item) => isTerminalSymbol(item) || isEndSymbol(item)));
                }, []);

                adjoints = ret;

                return ret;
            } else {
                return adjoints;
            }
        };

        // rest = ε && a = $
        let isReducedItem = () => {
            return !afterNextRest().length && getForwards().length === 1 && isEndSymbol(getForwards()[0]);
        };

        let restIsNotEmpty = () => getBody(production).length && dotPosition < getBody(production).length;

        let nextPositionItem = () => {
            return buildLR1Item(production, dotPosition + 1, forwards, grammer);
        };

        let getGrammer = () => grammer;

        // [A → α., a] ϵ Ii, A≠S`
        let isReduceItem = () => {
            return dotPosition === getBody(production).length;
        };

        let getProduction = () => production;

        let serializeId = null;

        let serialize = () => {
            if (serializeId === null) {
                serializeId = JSON.stringify([production, dotPosition, forwards.sort()]);
            }
            return serializeId;
        };

        let serializePrefixId = null;
        let serializePrefix = () => {
            if (serializePrefixId === null) {
                serializePrefixId = JSON.stringify([production, dotPosition]);
            }

            return serializePrefixId;
        };

        return {
            getNextSymbol,
            getProduction,
            getForwards,
            afterNextRest,
            list,
            concatForwards,
            getAdjoints,
            isReducedItem,
            restIsNotEmpty,
            nextPositionItem,
            getGrammer,
            isReduceItem,
            serialize,
            serializePrefix
        };
    };

    // S` -> S.
    var acceptItem = () => {
        return buildLR1Item([grammer.EXPAND_START_SYMBOL, [grammer.startSymbol]], 1, [grammer.END_SYMBOL]);
    };

    let isAcceptItem = (item) => {
        return sameItem(acceptItem(item.getGrammer()), item);
    };

    var sameItem = (item1, item2) => {
        return item1.serialize() === item2.serialize();
    };

    let initItem = () => {
        let item = buildLR1Item(
            [grammer.EXPAND_START_SYMBOL, [grammer.startSymbol]],
            0, [grammer.END_SYMBOL]
        );

        return item;
    };

    let fromList = ([head, body, dotPosition, forwards]) => {
        return buildLR1Item([head, body], dotPosition, forwards);
    };

    /**
     * [B → .γ, b]
     */
    let supItem = (production, symbol) => {
        return buildLR1Item(production, 0, [symbol]);
    };

    let expandCacheMap = {};
    let expandItem = (item) => {
        let serializeId = item.serialize();

        if (expandCacheMap[serializeId]) {
            return expandCacheMap[serializeId].slice(0);
        }

        let {
            getNextSymbol,
            getAdjoints,
            isReducedItem
        } = item;
        let next = getNextSymbol();

        if (!next || !isNoneTerminalSymbol(next)) return [];

        let nextProductions = getProductionsOf(next);

        let newItems = flat(map(nextProductions, (production) => isReducedItem() ? [
            supItem(production, END_SYMBOL)
        ] : map(getAdjoints(), (b) => supItem(production, b))));

        expandCacheMap[serializeId] = newItems;

        return newItems;
    };

    return {
        expandItem,
        buildLR1Item,
        isAcceptItem,
        sameItem,
        initItem,
        fromList,
        supItem
    };
};

module.exports = {
    LR1Itemer
};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    contain, union, reduce, difference, forEach
} = __webpack_require__(5);

let {
    isArray
} = __webpack_require__(0);

module.exports = (grammer) => {
    // cache first set
    let firstMap = {};

    /**
     * first set of sentential form
     *
     * α ϵ (T U N)*
     *
     * FIRST(α) = { a | α *=> a..., a ϵ T }
     *
     * if α *=> ε, then ε ϵ FIRST(α)
     *
     * A → ε => ['A', []]
     *
     * using null stand for ε
     */

    let first = (X) => {
        if (firstMap[X]) return firstMap[X];
        let ret = firstSet(X);
        firstMap[X] = ret;
        return ret;
    };

    let firstSet = (X) => {
        let {
            isTerminalSymbol,
            getProductionsOf,
            isEmptyProduction,
            getBody,
            EPSILON
        } = grammer;

        if (isTerminalSymbol(X)) {
            return [X];
        } else {
            // find all productions start with X
            let ps = getProductionsOf(X);

            return reduce(ps, (prev, production) => {
                let body = getBody(production);

                if (isEmptyProduction(production)) {
                    return union(prev, [EPSILON]); // union ε
                } else {
                    if (isTerminalSymbol(body[0])) {
                        return union(prev, [body[0]]);
                    } else {
                        return union(prev, firstList(body, grammer));
                    }
                }
            }, []);
        }
    };

    let firstListMap = {};
    /**
     * [...ab...]
     */
    let firstList = (body) => {
        let {
            EPSILON, getBodyId
        } = grammer;

        let bodyId = getBodyId(body);
        if (firstListMap[bodyId]) {
            return firstListMap[bodyId];
        }

        let ret = [];
        forEach(body, (y, index) => {
            let set = first(y);

            ret = union(ret, difference(set, [EPSILON]));
            if (!contain(set, EPSILON)) { // stop
                return true;
            }

            if (index === body.length - 1) {
                ret = union(ret, [EPSILON]);
            }
        });

        firstListMap[bodyId] = ret;
        return ret;
    };

    return (alpha) => {
        if (isArray(alpha)) {
            return firstList(alpha);
        } else {
            return first(alpha);
        }
    };
};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * context free grammer
 *    terminal symbol
 *    non-terminal symbol
 *    begin symbol
 *    production
 *    left -> right
 *
 * production = [head, body]
 *
 * TODO validate
 */

const {
    END_SYMBOL, EXPAND_START_SYMBOL, EPSILON
} = __webpack_require__(30);

/**
 * context free grammer is read-only
 */

module.exports = ({
    startSymbol,
    T, N,
    productions
}) => {
    let symbols = T.concat(N);

    // cache
    let noneTerminalProductionMap = getNoneTerminalProductionMap(productions);
    let terminalMap = listToExistMap(T);
    let noneTerminalMap = listToExistMap(N);

    let isTerminalSymbol = (symbol) => !!terminalMap[symbol];
    let isNoneTerminalSymbol = (symbol) => !!noneTerminalMap[symbol];

    /**
     * get all the productions startSymbol with none terminal symbol
     */
    let getProductionsOf = (noneTerminal) => noneTerminalProductionMap[noneTerminal];

    // A -> ε
    let isEmptyProduction = (production) => { // eslint-disable-body
        return !getBody(production).length;
    };

    let getBody = (production) => production[1];

    let getHead = (production) => production[0];

    let isEndSymbol = (v) => v === END_SYMBOL;

    let getBodyId = (body) => JSON.stringify(body);

    return {
        isTerminalSymbol,
        isNoneTerminalSymbol,
        getProductionsOf,
        isEmptyProduction,
        getBody,
        getBodyId,
        getHead,
        EPSILON,
        END_SYMBOL,
        EXPAND_START_SYMBOL,
        startSymbol,
        productions,
        isEndSymbol,
        symbols,
        N
    };
};

let listToExistMap = (arr) => {
    let map = {};
    let tLen = arr.length;
    for (let i = 0; i < tLen; i++) {
        map[arr[i]] = true;
    }
    return map;
};

/**
 * get the production map, key is none terminal symbol, keys is the set of producitons
 */
let getNoneTerminalProductionMap = (producitons) => {
    let productionMap = {};

    let productionLen = producitons.length;
    for (let i = 0; i < productionLen; i++) {
        let production = producitons[i];
        let head = production[0];
        productionMap[head] = productionMap[head] || [];
        productionMap[head].push(production);
    }

    return productionMap;
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    stringGraph,
    numberGraph
} = __webpack_require__(93);

let {
    buildFSM
} = __webpack_require__(25);

let FSM = __webpack_require__(9);
let {
    stateGraphDSL
} = FSM;

let {
    g,
    c,
    union,
    sequence,
    range,
    circle
} = stateGraphDSL;

let whitespace = union(' ', '\f', '\n', '\r', '\t', '\v', '\u00a0', '\u1680', '\u180e', '\u2000-', '\u200a', '\u2028', '\u2029', '\u202f', '\u205f', '\u3000', '\ufeff');

// .abcbf
// .0
// ._
let nodeName = g(sequence(
    '.',
    union('_', '%', range('a', 'z'), range('A', 'Z'), range('0', '9')),
    circle(union('_', '%', range('a', 'z'), range('A', 'Z'), range('0', '9')))
));

let variableName = g(sequence(
    union('_', range('a', 'z'), range('A', 'Z')),
    circle(union('_', range('a', 'z'), range('A', 'Z'), range('0', '9')))
));

let nodeNameVariable = g(sequence(
    '.',
    '[',

    circle(whitespace, g(sequence(
        union('_', range('a', 'z'), range('A', 'Z')),

        circle(union('_', range('a', 'z'), range('A', 'Z'), range('0', '9')),
            circle(whitespace,
                g(c(']'))
            ),
        ))))
));

module.exports = [

    {
        priority: 1,
        match: 'true',
        name: 'true'
    }, {
        priority: 1,
        match: 'false',
        name: 'false'
    }, {
        priority: 1,
        match: 'null',
        name: 'null'
    }, {
        priority: 1,
        match: buildFSM(stringGraph),
        name: 'string'
    }, {
        priority: 1,
        match: buildFSM(numberGraph),
        name: 'number'
    },

    {
        priority: 1,
        match: buildFSM(nodeName),
        name: 'nodeName'
    },
    {
        priority: 1,
        match: buildFSM(nodeNameVariable),
        name: 'nodeNameVariable'
    },
    {
        priority: 1,
        match: buildFSM(variableName),
        name: 'variableName'
    },
    {
        priority: 1,
        match: '=',
        name: 'assign'
    },
    {
        priority: 1,
        match: '-',
        name: 'delete'
    },
    {
        priority: 1,
        match: '+',
        name: 'append'
    },
    {
        priority: 1,
        match: ';',
        name: 'semicolon'
    },
    {
        priority: 1,
        match: '(',
        name: 'leftBracket'
    },
    {
        priority: 1,
        match: ')',
        name: 'rightBracket'
    },
    {
        priority: 1,
        match: ',',
        name: 'comma'
    },
    {
        priority: 1,
        match: buildFSM(g(
            c(whitespace)
        )),
        name: 'whitespace'
    }
];


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    stateGraphDSL
} = __webpack_require__(9);

let {
    g, c, union, range, sequence, circle, left, repeat
} = stateGraphDSL;

let numberGraph = g(c(union(null, '-'),
    g(
        c('0', g('decimal',
            c('.', circle(range('0', '9'), 'science')),
            c(null, g('science',
                c(null, 'accept'),
                sequence(
                    union('e', 'E'),
                    union('+', '-', null),
                    range('0', '9'),
                    circle(range('0', '9'), 'accept')
                )
            ))
        )),

        sequence(
            range('1', '9'),
            circle(range('0', '9'), 'decimal')
        )
    )
));

let hexDigit = union(range('0', '9'), range('A', 'F'), range('a', 'f'));

let escapeSymbols = union('"', '\\', '\/', 'b', 'f', 'n', 'r', 't');

let stringGraph = g(
    c('"', g('enter',
        c('\\', g(
            c(escapeSymbols, 'enter'),
            c('u',
                g(repeat(hexDigit, 4, 'enter'))
            ))),
        c('"', 'accept'),
        c(left(), 'enter')
    )));

module.exports = {
    numberGraph,
    stringGraph
};


/***/ }),
/* 94 */
/***/ (function(module, exports) {

module.exports={"GOTO":[{"PROGRAM":11,"EXPRESSION_LIST":12,"EXPRESSION":13,"UPDATE_EXPRESSION":14,"QUERY_EXPRESSION":15,"PATH":16,"ATOM_DATA":17},{"PATH":20},{"PATH":23},{},{"PATH":25},{"PATH":26},{},{},{},{},{},{},{},{},{},{},{},{},{"PATH":29},{"PATH":30},{},{"PATH":31},{"PATH":32},{},{"QUERY_EXPRESSION":43,"QUERY_EXPRESSION_LIST":44,"PATH":45,"ATOM_DATA":46},{},{},{"EXPRESSION_LIST":47,"EXPRESSION":13,"UPDATE_EXPRESSION":14,"QUERY_EXPRESSION":15,"PATH":16,"ATOM_DATA":17},{"QUERY_EXPRESSION":48,"PATH":49,"ATOM_DATA":17},{},{},{},{},{"QUERY_EXPRESSION":50,"PATH":49,"ATOM_DATA":17},{},{},{"PATH":52},{"PATH":53},{},{},{},{},{},{},{},{},{},{},{},{},{},{"QUERY_EXPRESSION":43,"QUERY_EXPRESSION_LIST":57,"PATH":45,"ATOM_DATA":46},{},{},{"QUERY_EXPRESSION":43,"QUERY_EXPRESSION_LIST":58,"PATH":45,"ATOM_DATA":46},{},{},{},{},{}],"ACTION":[{"$":{"type":"reduce","production":["EXPRESSION",[]]},"semicolon":{"type":"reduce","production":["EXPRESSION",[]]},"variableName":{"type":"shift","state":3},"delete":{"type":"shift","state":1},"append":{"type":"shift","state":2},"true":{"type":"shift","state":6},"false":{"type":"shift","state":7},"null":{"type":"shift","state":8},"string":{"type":"shift","state":9},"number":{"type":"shift","state":10},"nodeName":{"type":"shift","state":4},"nodeNameVariable":{"type":"shift","state":5}},{"nodeName":{"type":"shift","state":18},"nodeNameVariable":{"type":"shift","state":19}},{"nodeName":{"type":"shift","state":21},"nodeNameVariable":{"type":"shift","state":22}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName"]]},"leftBracket":{"type":"shift","state":24}},{"$":{"type":"reduce","production":["PATH",["nodeName"]]},"assign":{"type":"reduce","production":["PATH",["nodeName"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeName"]]},"nodeName":{"type":"shift","state":4},"nodeNameVariable":{"type":"shift","state":5}},{"$":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"assign":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"nodeName":{"type":"shift","state":4},"nodeNameVariable":{"type":"shift","state":5}},{"$":{"type":"reduce","production":["ATOM_DATA",["true"]]},"semicolon":{"type":"reduce","production":["ATOM_DATA",["true"]]}},{"$":{"type":"reduce","production":["ATOM_DATA",["false"]]},"semicolon":{"type":"reduce","production":["ATOM_DATA",["false"]]}},{"$":{"type":"reduce","production":["ATOM_DATA",["null"]]},"semicolon":{"type":"reduce","production":["ATOM_DATA",["null"]]}},{"$":{"type":"reduce","production":["ATOM_DATA",["string"]]},"semicolon":{"type":"reduce","production":["ATOM_DATA",["string"]]}},{"$":{"type":"reduce","production":["ATOM_DATA",["number"]]},"semicolon":{"type":"reduce","production":["ATOM_DATA",["number"]]}},{"$":{"type":"accept"}},{"$":{"type":"reduce","production":["PROGRAM",["EXPRESSION_LIST"]]}},{"$":{"type":"reduce","production":["EXPRESSION_LIST",["EXPRESSION"]]},"semicolon":{"type":"shift","state":27}},{"$":{"type":"reduce","production":["EXPRESSION",["UPDATE_EXPRESSION"]]},"semicolon":{"type":"reduce","production":["EXPRESSION",["UPDATE_EXPRESSION"]]}},{"$":{"type":"reduce","production":["EXPRESSION",["QUERY_EXPRESSION"]]},"semicolon":{"type":"reduce","production":["EXPRESSION",["QUERY_EXPRESSION"]]}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]},"assign":{"type":"shift","state":28}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["ATOM_DATA"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["ATOM_DATA"]]}},{"$":{"type":"reduce","production":["PATH",["nodeName"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeName"]]},"nodeName":{"type":"shift","state":18},"nodeNameVariable":{"type":"shift","state":19}},{"$":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"nodeName":{"type":"shift","state":18},"nodeNameVariable":{"type":"shift","state":19}},{"$":{"type":"reduce","production":["UPDATE_EXPRESSION",["delete","PATH"]]},"semicolon":{"type":"reduce","production":["UPDATE_EXPRESSION",["delete","PATH"]]}},{"assign":{"type":"reduce","production":["PATH",["nodeName"]]},"nodeName":{"type":"shift","state":21},"nodeNameVariable":{"type":"shift","state":22}},{"assign":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"nodeName":{"type":"shift","state":21},"nodeNameVariable":{"type":"shift","state":22}},{"assign":{"type":"shift","state":33}},{"rightBracket":{"type":"shift","state":35},"variableName":{"type":"shift","state":34},"true":{"type":"shift","state":38},"false":{"type":"shift","state":39},"null":{"type":"shift","state":40},"string":{"type":"shift","state":41},"number":{"type":"shift","state":42},"nodeName":{"type":"shift","state":36},"nodeNameVariable":{"type":"shift","state":37}},{"$":{"type":"reduce","production":["PATH",["nodeName","PATH"]]},"assign":{"type":"reduce","production":["PATH",["nodeName","PATH"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeName","PATH"]]}},{"$":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]},"assign":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]}},{"$":{"type":"reduce","production":["EXPRESSION",[]]},"semicolon":{"type":"reduce","production":["EXPRESSION",[]]},"variableName":{"type":"shift","state":3},"delete":{"type":"shift","state":1},"append":{"type":"shift","state":2},"true":{"type":"shift","state":6},"false":{"type":"shift","state":7},"null":{"type":"shift","state":8},"string":{"type":"shift","state":9},"number":{"type":"shift","state":10},"nodeName":{"type":"shift","state":4},"nodeNameVariable":{"type":"shift","state":5}},{"variableName":{"type":"shift","state":3},"true":{"type":"shift","state":6},"false":{"type":"shift","state":7},"null":{"type":"shift","state":8},"string":{"type":"shift","state":9},"number":{"type":"shift","state":10},"nodeName":{"type":"shift","state":18},"nodeNameVariable":{"type":"shift","state":19}},{"$":{"type":"reduce","production":["PATH",["nodeName","PATH"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeName","PATH"]]}},{"$":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]}},{"assign":{"type":"reduce","production":["PATH",["nodeName","PATH"]]}},{"assign":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]}},{"variableName":{"type":"shift","state":3},"true":{"type":"shift","state":6},"false":{"type":"shift","state":7},"null":{"type":"shift","state":8},"string":{"type":"shift","state":9},"number":{"type":"shift","state":10},"nodeName":{"type":"shift","state":18},"nodeNameVariable":{"type":"shift","state":19}},{"comma":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName"]]},"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName"]]},"leftBracket":{"type":"shift","state":51}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","rightBracket"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","rightBracket"]]}},{"comma":{"type":"reduce","production":["PATH",["nodeName"]]},"rightBracket":{"type":"reduce","production":["PATH",["nodeName"]]},"nodeName":{"type":"shift","state":36},"nodeNameVariable":{"type":"shift","state":37}},{"comma":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"rightBracket":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"nodeName":{"type":"shift","state":36},"nodeNameVariable":{"type":"shift","state":37}},{"comma":{"type":"reduce","production":["ATOM_DATA",["true"]]},"rightBracket":{"type":"reduce","production":["ATOM_DATA",["true"]]}},{"comma":{"type":"reduce","production":["ATOM_DATA",["false"]]},"rightBracket":{"type":"reduce","production":["ATOM_DATA",["false"]]}},{"comma":{"type":"reduce","production":["ATOM_DATA",["null"]]},"rightBracket":{"type":"reduce","production":["ATOM_DATA",["null"]]}},{"comma":{"type":"reduce","production":["ATOM_DATA",["string"]]},"rightBracket":{"type":"reduce","production":["ATOM_DATA",["string"]]}},{"comma":{"type":"reduce","production":["ATOM_DATA",["number"]]},"rightBracket":{"type":"reduce","production":["ATOM_DATA",["number"]]}},{"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION_LIST",["QUERY_EXPRESSION"]]},"comma":{"type":"shift","state":54}},{"rightBracket":{"type":"shift","state":55}},{"comma":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]},"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]}},{"comma":{"type":"reduce","production":["QUERY_EXPRESSION",["ATOM_DATA"]]},"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION",["ATOM_DATA"]]}},{"$":{"type":"reduce","production":["EXPRESSION_LIST",["EXPRESSION","semicolon","EXPRESSION_LIST"]]}},{"$":{"type":"reduce","production":["UPDATE_EXPRESSION",["PATH","assign","QUERY_EXPRESSION"]]},"semicolon":{"type":"reduce","production":["UPDATE_EXPRESSION",["PATH","assign","QUERY_EXPRESSION"]]}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]}},{"$":{"type":"reduce","production":["UPDATE_EXPRESSION",["append","PATH","assign","QUERY_EXPRESSION"]]},"semicolon":{"type":"reduce","production":["UPDATE_EXPRESSION",["append","PATH","assign","QUERY_EXPRESSION"]]}},{"rightBracket":{"type":"shift","state":56},"variableName":{"type":"shift","state":34},"true":{"type":"shift","state":38},"false":{"type":"shift","state":39},"null":{"type":"shift","state":40},"string":{"type":"shift","state":41},"number":{"type":"shift","state":42},"nodeName":{"type":"shift","state":36},"nodeNameVariable":{"type":"shift","state":37}},{"comma":{"type":"reduce","production":["PATH",["nodeName","PATH"]]},"rightBracket":{"type":"reduce","production":["PATH",["nodeName","PATH"]]}},{"comma":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]},"rightBracket":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]}},{"variableName":{"type":"shift","state":34},"true":{"type":"shift","state":38},"false":{"type":"shift","state":39},"null":{"type":"shift","state":40},"string":{"type":"shift","state":41},"number":{"type":"shift","state":42},"nodeName":{"type":"shift","state":36},"nodeNameVariable":{"type":"shift","state":37}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","QUERY_EXPRESSION_LIST","rightBracket"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","QUERY_EXPRESSION_LIST","rightBracket"]]}},{"comma":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","rightBracket"]]},"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","rightBracket"]]}},{"rightBracket":{"type":"shift","state":59}},{"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION_LIST",["QUERY_EXPRESSION","comma","QUERY_EXPRESSION_LIST"]]}},{"comma":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","QUERY_EXPRESSION_LIST","rightBracket"]]},"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","QUERY_EXPRESSION_LIST","rightBracket"]]}}]}

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



// TODO reuse pfc-compiler

let {
    isObject,
    isFunction,
    isString
} = __webpack_require__(32);

let {
    T_ASSIGN,
    T_DELETE,
    T_VARIABLE_NAME,
    T_FUNCTION,
    T_PATH,
    T_NODE_NAME_VARIABLE,

    A_DEFAULT
} = __webpack_require__(17);

/**
 *
 * variableStub = {
 *    [variableName]: {
 *       type,
 *       default,  // default value of variable
 *       validate // function used to check dynamic
 *    }
 * }
 *
 *
 * TODO restraints checking
 */

// static check
let checkAST = (ast, {
    variableStub = {}
} = {}) => {
    let open = ast.slice(0);

    while (open.length) {
        let top = open.pop();
        let midType = top.type;

        if (midType === T_VARIABLE_NAME) {
            let varName = top.value;
            // must exist
            if (!variableStub.hasOwnProperty(varName)) {
                throw new Error(`missing variable ${varName} in [${Object.keys(variableStub).join(', ')}]`);
            }
        } else if (midType === T_FUNCTION) { // function
            let {
                funName,
                params
            } = top.value;
            let stub = variableStub[funName];
            if (!isObject(stub) || stub.type !== T_FUNCTION) {
                throw new Error(`missing function ${funName}, please check your variable map. Current variable map has keys [${Object.keys(variableStub).join(', ')}].`);
            }
            // push params
            let paramLen = params.length;
            for (let i = 0; i < paramLen; i++) {
                open.push(params[i]);
            }
        } else if (midType === T_ASSIGN) {
            open.push(top.value.path);
            open.push(top.value.value);
        } else if (midType === T_DELETE) {
            open.push(top.value.path);
        } else if (midType === T_PATH) {
            let path = top.value;
            for (let i = 0; i < path.length; i++) {
                let {
                    type,
                    value
                } = path[i];
                if (type === T_NODE_NAME_VARIABLE) {
                    let stub = variableStub[value];

                    if (!isObject(stub) || stub.type !== T_NODE_NAME_VARIABLE) {
                        throw new Error(`missing type attribute ${T_NODE_NAME_VARIABLE} for ${value}, please check your variable map. Current variable map has keys [${Object.keys(variableStub).join(', ')}].`);
                    }
                }
            }
        }
    }
};

let runTimeCheck = (variableStub, variableMap) => {
    for (let name in variableStub) {
        let stub = variableStub[name];
        // missing check
        if (!variableMap.hasOwnProperty(name) && !stub.hasOwnProperty(A_DEFAULT)) {
            throw new Error(`missing variable ${name} in variableMap whick keys are [${Object.keys(variableMap).join(', ')}].`);
        }

        // type match
        if (stub.type === T_FUNCTION && !isFunction(variableMap[name])) {
            throw new Error(`variable ${name} is not function as expected, please check your variable map. Current variable map has keys [${Object.keys(variableMap).join(', ')}].`);
        }

        if (stub.type === T_NODE_NAME_VARIABLE && !isString(variableMap[name])) {
            throw new Error(`variable ${name} is not string as expected, please check your variable map. Current variable map has keys [${Object.keys(variableMap).join(', ')}].`);
        }
    }
};

let getVariable = (name, variableMap, variableStub) => {
    let stub = variableStub[name] || {};
    let value = null;
    if (variableMap.hasOwnProperty(name)) {
        value = variableMap[name];
    } else {
        // try to using default
        if (!stub.hasOwnProperty(A_DEFAULT)) {
            throw new Error(`missing variable ${name}.`);
        } else {
            value = stub[A_DEFAULT];
        }
    }

    if (isObject(stub) && isFunction(stub.validate)) { // dynamic validation
        stub.validate(value);
    }

    return value;
};

module.exports = {
    checkAST,
    runTimeCheck,
    getVariable
};


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let uuidv4 = __webpack_require__(21);

let autoId = () => {
    let time = new Date().getTime(); // used to sort by time
    // generate id
    return `_gid_${time}_${uuidv4().replace(/-/g, '_')}`;
};

let isObject = v => v && typeof v === 'object';

const O_T_MODIFY = 'update';
const O_T_REMOVE = 'delete';
const T_SUCCESS = 'success';

const ERR_T_REMOVE_NONE_EXIST = 'remove_none_exist';

let modifySuccess = (path, value) => {
    return {
        operationType: O_T_MODIFY,
        resultType: T_SUCCESS,

        path,
        value: value && value.toString()
    };
};

let removeNoneExist = (path) => {
    return {
        operationType: O_T_REMOVE,
        resultType: ERR_T_REMOVE_NONE_EXIST,

        path
    };
};

let removeSuccess = (path) => {
    return {
        operationType: O_T_REMOVE,
        resultType: T_SUCCESS,

        path
    };
};

module.exports = {
    autoId,
    isObject,

    modifySuccess,
    removeNoneExist,
    removeSuccess
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let querystring = __webpack_require__(24);

let helper = __webpack_require__(2);

// TODO opt performance
// TODO avoid save theme
// TODO expire time

let pagePropsStore = (options = {}) => {
  let {version = 1.0} = options;

  let key = options.key || getDefaultKey(options);

  let set = (props) => {
    let attributes = options.whiteList || [];

    localStorage[key] = JSON.stringify({
      version,
      props : attributes.reduce(
          (prev, attribute) => {
            helper.set(prev, attribute, helper.get(props, attribute));
            return prev;
          },
          {})
    });
  };

  let get = (originProps = {}) => {
    let dataStr = localStorage[key];
    if (!dataStr)
      return responseOriginProps(originProps);

    try {
      let data = JSON.parse(dataStr);
      if (data.version < version) {
        return responseOriginProps(originProps);
      } else if (data.version < version) {
        console.error(
            `unexpected situation happened, storaged data version is bigger than current version. Storaged data version is ${
                                                                                                                             data.version
                                                                                                                           }. Current version is ${
                                                                                                                                                   version
                                                                                                                                                 }.`); // eslint-disable-line
        return responseOriginProps(originProps);
      } else {
        // merge dataProps and stored props
        return helper.deepMergeMap(originProps, data.props);
      }
    } catch (err) {
      return responseOriginProps(originProps);
    }
  };

  let responseOriginProps = (originProps) => {
    set(originProps);
    return originProps;
  };

  return {get, set};
};

let getDefaultKey =
    ({pageQueryKey = 'page'} = {}) => { // key should reflect a page
      let key = `${document.title}-${window.location.pathname}`;

      let obj = querystring.parse(window.location.search.substring(1));

      if (obj && obj[pageQueryKey] !== undefined) {
        key = `${key}?page=${obj[pageQueryKey]}`;
      }

      return key;
    };

let wrapPagePropsWithStore = (props, options = {}) => {
  let {get, set} = pagePropsStore(options);

  let originOnsignal = props.onsignal;

  props.onsignal = (signal, data, ctx) => {
    if (options.signalTypes) {
      if (options.signalTypes.findIndex((type) => signal.type === type) !==
          -1) {
        set(data.props);
      }
    } else {
      set(data.props);
    }
    return originOnsignal && originOnsignal(signal, data, ctx);
  };

  return get(props);
};

module.exports = {
  pagePropsStore,
  wrapPagePropsWithStore
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {
   // signal constants
} = __webpack_require__(34);

let {wrapBaseSignalActions} = __webpack_require__(99);

/**
 * 
 * {
 *      [pageName]: {
 *          [signalName]: [{
 *              type,       // updateState | sendRequest
 *              content,    // tree-script
 *              
 *              response,    // response of sendRequest, tree-script
 *              error,       // error of sendRequest, tree-script
 *              variableMap: {}
 *          }]
 *      }
 * }
 * 
 * source tree data in tree-script
 *     updateState: {signal, viewState, localStorage}
 *     response: {response, viewState, localStorage}
 *     error: {errorMsg, error, viewState, localStorage}
 * 
 * Special signals:
 *      kabanery_page_render // when this page rendered
 * 
 * tree-script: https://github.com/LoveKino/tree-script
 */
module.exports = wrapBaseSignalActions({
    indexPage: {
        'kabanery_page_render': []
    }
});

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const KABANERY_DO_RENDER = 'kabanery_do_render';

const baseSignalActionMap = {
  [KABANERY_DO_RENDER] : [ {type : 'updateState', content : ''} ]
};

let wrapBaseSignalActions = (signalActionMap) => {
  for (let name in signalActionMap) {
    let pageSignalActionMap = signalActionMap[name];

    for (let cname in baseSignalActionMap) {
      if (!pageSignalActionMap[cname]) {
        pageSignalActionMap[cname] = baseSignalActionMap[cname];
      }
    }
  }

  return signalActionMap;
};

module.exports = {
  KABANERY_DO_RENDER,
  wrapBaseSignalActions
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let indexPage = __webpack_require__(101);

module.exports = {
    indexPage
};


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let SimplePager = __webpack_require__(102);
let lumineView = __webpack_require__(3);
let n = __webpack_require__(4);
let TerminalView = __webpack_require__(118);

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
                output: '/home/root'
            }]
        })
    ]);
}, {
    defaultProps: {}
}));


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let lumineView = __webpack_require__(3);
let n = __webpack_require__(4);
let PageLoading = __webpack_require__(110);
let Notice = __webpack_require__(115);
let {syncBindWithKeyMap} = __webpack_require__(36);
let Full = __webpack_require__(117);

/**
 *
 * define a simple page view class, which contains page loading and notice.
 */

module.exports = (PageView) => {
  let fun = ({props, children}, ctx) => {
    return n(Full, {style : props.style.container}, [
      n(PageLoading,
        syncBindWithKeyMap(ctx, {'loading.show' : 'show'},
                           {bindedProps : {style : props.style.loading}})),

      n(Notice, syncBindWithKeyMap(
                    ctx, {'notice.show' : 'show', 'notice.text' : 'text'},
                    {bindedProps : {style : props.style.notice}})),

      n(PageView, props, children)
    ]);
  };

  return lumineView(fun, {
    defaultProps : {
      // loading in page level
      loading : {show : false},
      // notice window
      notice : {show : false, text : ''},

      style : {container : {}, loading : {}, notice : {}}
    }
  });
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    view
} = __webpack_require__(6);
let steadyTheme = __webpack_require__(104);
let {
    deepMergeMap,
    resolveFnValue
} = __webpack_require__(2);
let ClassTable = __webpack_require__(109);
let {
    Signal
} = __webpack_require__(7);
let JsonTree = __webpack_require__(33);
let {
    executeAST
} = __webpack_require__(14);

/**
 * define the general interface for lumine view
 *
 * 1. unify view data structure
 *
 *    view data = {
 *       // public data
 *       props,
 *       children // child views
 *    }
 *
 *    props.onsigal
 *    props.theme
 *
 * 2. onsignal interface
 *
 *    onsignal: (signal, data, ctx) -> Any
 */

module.exports = (viewFun) => ({
    defaultProps = {},
    defaultChildren = [],
    theme = steadyTheme,
    classTable
} = {}) => {
    let defaultStyle = defaultProps.style || {};

    let defaultStyleValue = resolveFnValue(defaultStyle, theme);
    let classTableValue = resolveFnValue(classTable, theme);

    let {
        appendStyle,
        getClassName,
        updateClassTable
    } = ClassTable(classTableValue);

    return view((viewData, ctx) => {
        viewData.props = viewData.props || {};
        viewData.children = (viewData.children && viewData.children.length) ? viewData.children : defaultChildren;
        viewData.props.theme = viewData.props.theme || theme;

        appendStyle();
        // TODO check view Data

        // update defaultStyleValue
        if (viewData.props.theme && typeof defaultStyle === 'function') {
            defaultStyleValue = resolveFnValue(defaultStyle, viewData.props.theme);
        }

        // update class table
        if (viewData.theme && typeof classTable === 'function') {
            classTableValue = resolveFnValue(classTable, viewData.props.theme);
            updateClassTable(classTableValue);
        }

        // merge props (deep merge)
        viewData.props.style = deepMergeMap(viewData.props.style, defaultStyleValue);
        viewData.props = deepMergeMap(viewData.props, defaultProps);

        // signal system
        let notify = (signal) => {
            viewData.props.onsignal && viewData.props.onsignal(signal, ctx.getData(), ctx);
        };

        let viewDataTree = JsonTree(viewData);

        // update with tree script
        let updateTree = ({
            ast,
            variableStub
        }, variableMap, signal) => {
            signal = signal || Signal('update-view-data');
            // update view data by running update script
            executeAST(ast, {
                queryByPath: viewDataTree.queryByPath,
                setByPath: viewDataTree.setByPath,
                removeByPath: viewDataTree.removeByPath,
                appendByPath: viewDataTree.appendByPath,
                variableMap,
                variableStub
            });
            updateWithNotify(signal);
        };

        let updateWithNotify = (signal, ...updateScript) => {
            signal = signal || Signal('update-view-data');
            ctx.update(...updateScript);
            // notify
            notify(signal);
        };

        ctx.notify = notify;
        ctx.updateWithNotify = updateWithNotify;
        ctx.updateTree = updateTree;
        ctx.getClassName = getClassName;

        return viewFun(viewData, ctx);
    });
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let base = __webpack_require__(105);

module.exports = base({
    pageColor: 'white',
    hoverColor: '#90CAF9',
    blockColor: '#2196F3', // rgb(33,150,243)
    borderColor: '#1565C0',
    veilColor: 'rgba(125,125,125,0.6)',
    fontColor: 'white',
    noticeColor: 'rgb(2, 40, 51)',
    shadowColor: 'rgba(100,100,100,0.2)',

    // half
    halfBlockColor: 'rgba(33,150,243,0.5)',

    titleSize: 20,
    normalSize: 16,

    narrowPadding: '4 8 4 8',
    narrowPaddingTop: 4,
    narrowPaddingRight: 8,
    narrowPaddingBottom: 4,
    narrowPaddingLeft: 8,

    narrowMargin: '4 8 4 8',

    contrastBlockColor: 'white',
    contrastFontColor: 'black'
});


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    styles
} = __webpack_require__(2);

let layout = __webpack_require__(35);
let Bulk = __webpack_require__(106);
let Actions = __webpack_require__(107);
let Widget = __webpack_require__(108);

module.exports = (basics, custom = {}) => {
    let bulks = Bulk(basics);
    let actions = Actions(basics);
    let widgets = Widget(basics, layout, bulks);

    if (typeof custom === 'function') {
        custom = custom(basics, layout, bulks);
    }

    bulks = Object.assign(bulks, custom.bulks || {});
    actions = Object.assign(actions, custom.actions || {});
    widgets = Object.assign(widgets, custom.widgets || {});

    return Object.assign({
        basics,
        actions
    }, layout, bulks, actions, widgets);
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    styles
} = __webpack_require__(2);

let layout = __webpack_require__(35);

let {
    container
} = layout;

module.exports = (basics) => {
    let bulk = styles(container, {
        minWidth: 40,
        backgroundColor: basics.blockColor,
        color: basics.fontColor
    });

    let contrastBulk = styles(bulk, {
        backgroundColor: basics.contrastBlockColor,
        color: basics.contrastFontColor
    });

    let oneLineBulk = styles(bulk, {
        padding: basics.narrowPadding,
        fontSize: basics.normalSize,
        textAlign: 'center',
        lineHeight: 20,
        textDecoration: 'none',
        border: 'none',
        color: basics.fontColor
    });

    let flatOneLineBulk = styles(oneLineBulk, {
        display: 'inline-block',
        backgroundColor: basics.contrastBlockColor,
        color: basics.blockColor
    });

    let modalBulk = styles(oneLineBulk, contrastBulk, {
        display: 'inline-block',
        boxShadow: `3px 3px 5px ${basics.shadowColor}`
    });

    return {
        bulk,
        contrastBulk,
        oneLineBulk,
        modalBulk,
        flatOneLineBulk
    };
}


/***/ }),
/* 107 */
/***/ (function(module, exports) {

module.exports = (basics) => {
    return {
        hover: {
            backgroundColor: basics.hoverColor
        },

        active: {
            backgroundColor: basics.hoverColor
        },

        focus: {
            outline: 'none'
        },

        flatHover: {
            color: basics.hoverColor
        },

        flatActive: {
            color: basics.hoverColor
        }
    }
};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

let {
    styles
} = __webpack_require__(2);

module.exports = (basics, layout, bulks) => {
    let {
        contrastBulk
    } = bulks;
    let {
        flat
    } = layout;

    let cardBox = styles(contrastBulk, flat, {
        border: `1px solid ${basics.shadowColor}`,
        boxShadow: `3px 3px 5px ${basics.shadowColor}`,
        borderRadius: 2
    });

    let inputBox = styles(contrastBulk, flat, {
        width: 260,
        padding: basics.narrowPadding,
        backgroundColor: basics.fontColor
    });

    let textAreaBox = styles(inputBox, {
        width: 360,
        height: 200,
        outline: 'none',
        resize: 'none',
        overflow: 'auto',
        border: `1px solid ${basics.borderColor}`,
        borderRadius: 5,
        fontSize: 16
    });

    let underLineBorder = {
        border: 0,
        borderRadius: 0,
        'border-bottom': `1px solid ${basics.borderColor}`
    };

    let underLineFocus = {
        paddingBottom: basics.narrowPaddingBottom - 1,
        'border-bottom': `2px solid ${basics.blockColor}`
    };

    let flatRippleMask = {
        content: '',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 5,
        height: 5,
        backgroundColor: basics.halfBlockColor,
        opacity: '0',
        borderRadius: '100%',
        transform: 'scale(1, 1) translate(-50%)',
        transformOrigin: '50% 50%'
    };

    return {
        inputBox,
        textAreaBox,
        underLineBorder,
        underLineFocus,
        flatRippleMask,
        cardBox
    };
};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isMapObject
} = __webpack_require__(2);

let {
    mount,
    n,
    parseStyle
} = __webpack_require__(6);

const VIEW_CLASS_PREFIX = 'kabanery-lumine';

let count = -1;

module.exports = (classTable) => {
    count++;

    let viewClassId = `${VIEW_CLASS_PREFIX}-${count}`;

    let getStyleRuleName = (name) => {
        if (name[0] === '@') {
            let prev = name.split(' ')[0];
            let next = name.substring(prev.length).trim();
            return `${prev} ${viewClassId}-${next}`;
        } else {
            return `.${viewClassId}-${name}`;
        }
    };

    let appendStyle = () => {
        if (styleCssRules) {
            mount(n('style', {
                id: viewClassId
            }, styleCssRules), document.head);
            styleCssRules = null;
        }
    };

    let getClassName = (name) => {
        if (name[0] === '@') {
            let prev = name.split(' ')[0];
            let next = name.substring(prev.length).trim();
            name = next;
        }

        return `${viewClassId}-${name.split(':')[0]}`;
    };

    let updateClassTable = (newClassTable) => {
        let node = document.getElementById(viewClassId);
        if (node) {
            node.parentNode.removeChild(node);
        }

        setStyleCssRules(newClassTable);
        appendStyle();
    };

    let styleCssRules = null;

    let setStyleCssRules = (classTable) => {
        if (isMapObject(classTable)) {
            styleCssRules = '';
            for (let name in classTable) {
                name = name.trim();
                let styleRuleName = getStyleRuleName(name);
                let classCnt = classTable[name];
                if (typeof classCnt === 'function') {
                    classCnt = classCnt({
                        getClassName
                    });
                }
                let styleRuleContent = parseStyle(classCnt, {
                    valueWrapper: (value) => `${value !== ''? value: '\'\''} !important`
                });
                styleCssRules += `\n${styleRuleName} {${styleRuleContent}}`;
            }
        }
    };

    setStyleCssRules(classTable);

    return {
        appendStyle,
        getClassName,
        updateClassTable
    };
};


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let n = __webpack_require__(4);
let lumineView = __webpack_require__(3);

let TextLoading = __webpack_require__(111);
let PageMask = __webpack_require__(112);
let Empty = __webpack_require__(114);

module.exports = lumineView(({
    props,
    children
}) => {
    return props.show ? n(PageMask, {
        style: props.style
    }, children) : Empty();
}, {
    defaultProps: {
        show: true,
        style: {
            textAlign: 'center'
        }
    },
    defaultChildren: [n(TextLoading, {
        style: {
            position: 'relative',
            top: '50%',
            marginTop: -10
        }
    })]
});


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let n = __webpack_require__(4);

let lumineView = __webpack_require__(3);

// TODO easy disappear for loading view
module.exports = lumineView(({
    props
}, {
    getClassName
}) => {
    return props.show ? n('div', {
        'class': getClassName('load-suffix'),
        style: props.style
    }, props.textPrefix) : n('div');
}, {
    defaultProps: {
        textPrefix: 'loading',
        show: true,
        style: {
            display: 'inline-block'
        }
    },

    classTable: {
        '@keyframes loading': `
    0% {
        content: ""
    }
    33% {
        content: "."
    }
    67% {
        content: ".."
    }
    100% {
        content: "..."
    }`,
        'load-suffix::after': ({
            getClassName
        }) => {
            return {
                content: JSON.stringify('.'),
                animation: `${getClassName('loading')} 3s infinite ease-in-out`
            };
        }
    }
});


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let FullWindow = __webpack_require__(113);
let lumineView = __webpack_require__(3);
let n = __webpack_require__(4);

module.exports = lumineView(({
    props,
    children
}) => {
    return n(FullWindow, props, children);
}, {
    defaultProps: {
        style: (theme) => {
            return {
                backgroundColor: theme.basics.veilColor,
                color: theme.basics.fontColor,
                zIndex: 1000
            };
        }
    }
});


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(6);
let lumineView = __webpack_require__(3);
let {
    styles
} = __webpack_require__(2);
let {
    Signal
} = __webpack_require__(7);

module.exports = lumineView(({
    props,
    children
}, {
    notify
}) => {
    return n('div', {
        style: props.style,
        onclick: () => {
            notify(Signal('fullwindow-click'));
        }
    }, children);
}, {
    defaultProps: {
        style: (theme) => {
            return styles(theme.fullWindow);
        }
    },

    defaultChildren: []
});


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let n = __webpack_require__(4);
let lumineView = __webpack_require__(3);

module.exports = lumineView(() => {
    return n('div', {
        style: {
            width: 0,
            height: 0
        }
    });
});


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let n = __webpack_require__(4);
let lumineView = __webpack_require__(3);
let {
    Signal
} = __webpack_require__(7);

let {
    styles
} = __webpack_require__(2);

let {
    compileTreeScript
} = __webpack_require__(116);

let S_HideNotice = compileTreeScript('.props.show=false');

module.exports = lumineView(({
    props
}, {
    updateTree
}) => {
    if (props.show && props.duration !== 'forever') {
        setTimeout(() => {
            updateTree(S_HideNotice, null, Signal('notice-hide'));
        }, props.duration);
    }

    return n('div', {
        style: {
            zIndex: 10000,
            position: 'fixed',
            width: '100%',
            height: 0,
            left: 0,
            top: '50%',
            textAlign: 'center'
        }
    }, [
        props.show && n('div', {
            style: props.style
        }, props.text)
    ]);
}, {
    defaultProps: {
        text: '',
        show: true,
        duration: 3000,
        style: (theme) => styles(theme.oneLineBulk, {
            display: 'inline-block',
            backgroundColor: theme.basics.noticeColor,
            maxWidth: 400,
            maxHeight: 200,
            top: -100,
            position: 'relative',
        })
    }
});


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    parseStrToAst,
    checkAST
} = __webpack_require__(14);

let compileTreeScript = (treeScriptCode, {
    variableStub
} = {}) => {
    let ast = parseStrToAst(treeScriptCode);

    if (variableStub) {
        checkAST(ast, {
            variableStub
        });
    }

    return {
        ast,
        variableStub
    };
};

module.exports = {
    compileTreeScript
};


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(6);
let lumineView = __webpack_require__(3);
let {
    styles
} = __webpack_require__(2);

module.exports = lumineView(({
    props,
    children
}) => {
    return n('div', {
        style: props.style
    }, children);
}, {
    defaultProps: {
        style: (theme) => styles(theme.fullParent)
    },

    defaultChildren: ['']
});


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const lumineView = __webpack_require__(146);
const n = __webpack_require__(202);
const Angle = __webpack_require__(203);

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


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * basic types
 */

let truth = () => true;

let isUndefined = v => v === undefined;

let isNull = v => v === null;

let isFalsy = v => !v;

let likeArray = v => !!(v && typeof v === 'object' && typeof v.length === 'number' && v.length >= 0);

let isArray = v => Array.isArray(v);

let isString = v => typeof v === 'string';

let isObject = v => !!(v && typeof v === 'object');

let isFunction = v => typeof v === 'function';

let isNumber = v => typeof v === 'number' && !isNaN(v);

let isBool = v => typeof v === 'boolean';

let isNode = (o) => {
    return (
        typeof Node === 'object' ? o instanceof Node :
        o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
    );
};

let isPromise = v => v && typeof v === 'object' && typeof v.then === 'function' && typeof v.catch === 'function';

let isRegExp = v => v instanceof RegExp;

let isReadableStream = (v) => isObject(v) && isFunction(v.on) && isFunction(v.pipe);

let isWritableStream = v => isObject(v) && isFunction(v.on) && isFunction(v.write);

/**
 * check type
 *
 * types = [typeFun]
 */
let funType = (fun, types = []) => {
    if (!isFunction(fun)) {
        throw new TypeError(typeErrorText(fun, 'function'));
    }

    if (!likeArray(types)) {
        throw new TypeError(typeErrorText(types, 'array'));
    }

    for (let i = 0; i < types.length; i++) {
        let typeFun = types[i];
        if (typeFun) {
            if (!isFunction(typeFun)) {
                throw new TypeError(typeErrorText(typeFun, 'function'));
            }
        }
    }

    return function() {
        // check type
        for (let i = 0; i < types.length; i++) {
            let typeFun = types[i];
            let arg = arguments[i];
            if (typeFun && !typeFun(arg)) {
                throw new TypeError(`Argument type error. Arguments order ${i}. Argument is ${arg}. function is ${fun}, args are ${arguments}.`);
            }
        }
        // result
        return fun.apply(this, arguments);
    };
};

let and = (...args) => {
    if (!any(args, isFunction)) {
        throw new TypeError('The argument of and must be function.');
    }
    return (v) => {
        for (let i = 0; i < args.length; i++) {
            let typeFun = args[i];
            if (!typeFun(v)) {
                return false;
            }
        }
        return true;
    };
};

let or = (...args) => {
    if (!any(args, isFunction)) {
        throw new TypeError('The argument of and must be function.');
    }

    return (v) => {
        for (let i = 0; i < args.length; i++) {
            let typeFun = args[i];
            if (typeFun(v)) {
                return true;
            }
        }
        return false;
    };
};

let not = (type) => {
    if (!isFunction(type)) {
        throw new TypeError('The argument of and must be function.');
    }
    return (v) => !type(v);
};

let any = (list, type) => {
    if (!likeArray(list)) {
        throw new TypeError(typeErrorText(list, 'list'));
    }
    if (!isFunction(type)) {
        throw new TypeError(typeErrorText(type, 'function'));
    }

    for (let i = 0; i < list.length; i++) {
        if (!type(list[i])) {
            return false;
        }
    }
    return true;
};

let exist = (list, type) => {
    if (!likeArray(list)) {
        throw new TypeError(typeErrorText(list, 'array'));
    }
    if (!isFunction(type)) {
        throw new TypeError(typeErrorText(type, 'function'));
    }

    for (let i = 0; i < list.length; i++) {
        if (type(list[i])) {
            return true;
        }
    }
    return false;
};

let mapType = (map) => {
    if (!isObject(map)) {
        throw new TypeError(typeErrorText(map, 'obj'));
    }

    for (let name in map) {
        let type = map[name];
        if (!isFunction(type)) {
            throw new TypeError(typeErrorText(type, 'function'));
        }
    }

    return (v) => {
        if (!isObject(v)) {
            return false;
        }

        for (let name in map) {
            let type = map[name];
            let attr = v[name];
            if (!type(attr)) {
                return false;
            }
        }

        return true;
    };
};

let listType = (type) => {
    if (!isFunction(type)) {
        throw new TypeError(typeErrorText(type, 'function'));
    }

    return (list) => any(list, type);
};

let typeErrorText = (v, expect) => {
    return `Expect ${expect} type, but got type ${typeof v}, and value is ${v}`;
};

module.exports = {
    isArray,
    likeArray,
    isString,
    isObject,
    isFunction,
    isNumber,
    isBool,
    isNode,
    isPromise,
    isNull,
    isUndefined,
    isFalsy,
    isRegExp,
    isReadableStream,
    isWritableStream,

    funType,
    any,
    exist,

    and,
    or,
    not,
    mapType,
    listType,
    truth
};


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(119);

let iterate = __webpack_require__(133);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact
} = __webpack_require__(149);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact
};


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(119);

let iterate = __webpack_require__(144);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact, reverse, overArgs
} = __webpack_require__(191);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact,
    reverse,
    overArgs
};


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let styles = (...styleObjects) => {
    return Object.assign({}, ...styleObjects);
};

let isMapObject = (v) => {
    return v && typeof v === 'object' && !Array.isArray(v);
};

let deepMergeMap = (tar, def, path = '', options = {}) => {
    let blackList = options.blackList || [];
    if (blackList.findIndex((item) => item === path) !== -1) {
        return tar;
    }
    if (isMapObject(def)) {
        tar = tar || {};
        if (isMapObject(tar)) {
            for (let name in def) {
                tar[name] = deepMergeMap(tar[name], def[name], path === '' ? name : path + '.' + name, options);
            }
        }
        return tar;
    } else {
        if (tar === undefined) return def;
        return tar;
    }
};

let resolveFnValue = (fn, ...args) => {
    if (typeof fn === 'function') {
        return resolveFnValue(fn(...args));
    }

    return fn;
};

let get = (obj, key = '') => {
    key = key.trim();
    let parts = !key ? [] : key.split('.');

    let partLen = parts.length;
    for (let i = 0; i < partLen; i++) {
        let part = parts[i].trim();
        if (part) {
            obj = obj[part];
        }
    }

    return obj;
};

let set = (obj, key = '', value) => {
    key = key.trim();
    let parts = !key ? [] : key.split('.');
    if (!parts.length) return;
    let parent = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        let part = parts[i];
        part = part.trim();
        if (part) {
            let next = parent[part];
            if (!isObject(next)) {
                next = {};
                parent[part] = next;
            }
            parent = next;
        }
    }

    parent[parts[parts.length - 1]] = value;
    return obj;
};

let isObject = (v) => v && typeof v === 'object';

let likeArray = (v) => v && typeof v === 'object' && typeof v.length === 'number';

module.exports = {
    styles,
    isMapObject,
    deepMergeMap,
    resolveFnValue,
    get,
    set,
    isObject,
    likeArray
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    reduce
} = __webpack_require__(120);
let {
    funType, isObject, or, isString, isFalsy
} = __webpack_require__(119);

let defineProperty = (obj, key, opts) => {
    if (Object.defineProperty) {
        Object.defineProperty(obj, key, opts);
    } else {
        obj[key] = opts.value;
    }
    return obj;
};

let hasOwnProperty = (obj, key) => {
    if (obj.hasOwnProperty) {
        return obj.hasOwnProperty(key);
    }
    for (var name in obj) {
        if (name === key) return true;
    }
    return false;
};

let toArray = (v = []) => Array.prototype.slice.call(v);

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let set = (sandbox, name = '', value) => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    let parent = sandbox;
    if (!isObject(parent)) return;
    if (!parts.length) return;
    for (let i = 0; i < parts.length - 1; i++) {
        let part = parts[i];
        parent = parent[part];
        // avoid exception
        if (!isObject(parent)) return null;
    }

    parent[parts[parts.length - 1]] = value;
    return true;
};

/**
 * provide property:
 *
 * 1. read props freely
 *
 * 2. change props by provide token
 */

let authProp = (token) => {
    let set = (obj, key, value) => {
        let temp = null;

        if (!hasOwnProperty(obj, key)) {
            defineProperty(obj, key, {
                enumerable: false,
                configurable: false,
                set: (value) => {
                    if (isObject(value)) {
                        if (value.token === token) {
                            // save
                            temp = value.value;
                        }
                    }
                },
                get: () => {
                    return temp;
                }
            });
        }

        setProp(obj, key, value);
    };

    let setProp = (obj, key, value) => {
        obj[key] = {
            token,
            value
        };
    };

    return {
        set
    };
};

let evalCode = (code) => {
    if (typeof code !== 'string') return code;
    return eval(`(function(){
    try {
        ${code}
    } catch(err) {
        console.log('Error happened, when eval code.');
        throw err;
    }
})()`);
};

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let runSequence = (list, params = [], context, stopV) => {
    if (!list.length) {
        return Promise.resolve();
    }
    let fun = list[0];
    let v = fun && fun.apply(context, params);
    if (stopV && v === stopV) {
        return Promise.resolve(stopV);
    }
    return Promise.resolve(v).then(() => {
        return runSequence(list.slice(1), params, context, stopV);
    });
};

module.exports = {
    defineProperty,
    hasOwnProperty,
    toArray,
    get,
    set,
    authProp,
    evalCode,
    delay,
    runSequence
};


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * @readme-quick-run
 *
 * ## test tar=js r_c=FSM
 *
 *
 * let {
 *     stateGraphDSL, fsm, WAIT, MATCH
 * } = FSM;
 *
 * let {
 *     g, c, union, range, sequence, circle, left, repeat
 * } = stateGraphDSL;
 *
 * let hexDigit = union(range('0', '9'), range('A', 'F'), range('a', 'f'));
 *
 * let escapeSymbols = union('"', '\\', '\/', 'b', 'f', 'n', 'r', 't');
 *
 * let stringDFA = g(
 *     c('"', g('enter',
 *         c('\\', g(
 *             c(escapeSymbols, 'enter'),
 *             c('u',
 *                 g(repeat(hexDigit, 4, 'enter'))
 *             ))),
 *         c('"', 'accept'),
 *         c(left(), 'enter')
 *     )));
 *
 * let m = fsm(stringDFA);
 * console.log(m('"').type === WAIT);
 * console.log(m('a').type === WAIT);
 * console.log(m('b').type === WAIT);
 * console.log(m('"').type === MATCH);
 *
 **/
module.exports = __webpack_require__(179);


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(148);

/**
 * @readme-doc
 *
 * ## features
 *
 * - simple DOM DSL, construct dom tree quickly
 *
 * - data-driven view, include updating view by data
 *
 * - Just functions, easy to compose
 *
 * [readme-lang:zh]## 特征
 *
 * - 简单的DOM DSL，快速构建DOM结构
 *
 * - 数据驱动视图，包括通过数据更新视图
 *
 * - 以函数为核心，易于复合
 *
 */

/**
 * @readme-quick-run
 *
 * Using method n to construct dom node quickly.
 *
 * [readme-lang:zh]用方法n快速构造dom节点
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {n, mount} = kabanery;
 *
 * mount(n('div', {
 *   id: 'qu',
 *   style: {
 *      backgroundColor: 'red'
 *   }
 * }, [
 *      n('span class=go style="font-size:16px"', 'hello!')
 * ]), document.body);
 *
 * console.log(document.getElementById('qu').outerHTML); // print result
 */

/**
 * @readme-quick-run
 *
 * Basic way to construct a view.
 *
 * [readme-lang:zh]构造一个组件的简单方法
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data) => {
 *      let {type} = data;
 *
 *      return n('div', {
 *         id: 'test1',
 *         style: {
 *            fontSize: 10
 *         }
 *      },[
 *          type === 2 && n('span', 'second'),
 *          type === 3 && n('div', 'third')
 *      ]);
 * });
 *
 * mount(MyView({type: 3}), document.body);
 *
 * console.log(document.getElementById('test1').outerHTML); // print result
 */

/**
 * @readme-quick-run
 *
 * Using update api to update a view.
 *
 * [readme-lang:zh]运用update api去更新一个view
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data, {update}) => {
 *      return n('div', {
 *         id: 'a',
 *         style: {
 *            fontSize: 10
 *         },
 *         onclick: () => {
 *            update('show', !data.show);
 *         }
 *      }, [
 *          data.show && n('div', 'show text')
 *      ]);
 * });
 *
 * mount(MyView({show: false}), document.body);
 *
 * document.getElementById('a').click(); // simulate user action
 * console.log(document.getElementById('a').outerHTML); // print result
 */


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    map
} = __webpack_require__(120);
let {
    isObject, isNode
} = __webpack_require__(119);

let parseArgs = __webpack_require__(150);

let parseStyle = __webpack_require__(134);

const KABANERY_NODE = 'kabanery_node';

// TODO general proxy n way

let cn = (elementType) => {
    return (...args) => {
        let {
            tagName, attributes, childs
        } = parseArgs(args);

        if (isKabaneryNode(attributes)) {
            childs = [attributes];
            attributes = {};
        }

        // plugin
        runPlugins(attributes['plugin'], tagName, attributes, childs);

        let {
            attrMap, eventMap
        } = splitAttribues(attributes);

        return {
            tagName,
            attrMap,
            eventMap,
            elementType,
            type: KABANERY_NODE, childNodes: childs,
        };
    };
};

let isKabaneryNode = (v) => isObject(v) && v.type === KABANERY_NODE;

let bindPlugs = (typen, plugs = []) => (...args) => {
    let {
        tagName, attributes, childs
    } = parseArgs(args);

    let oriPlugs = attributes.plugin = attributes.plugin || [];
    attributes.plugin = oriPlugs.concat(plugs);

    let node = typen(tagName, attributes, childs);

    return node;
};

let runPlugins = (plugs = [], tagName, attributes, childExp) => {
    for (let i = 0; i < plugs.length; i++) {
        let plug = plugs[i];
        plug && plug(tagName, attributes, childExp);
    }
};

let splitAttribues = (attributes) => {
    let attrMap = {},
        eventMap = {};
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            eventMap[name.substring(2)] = item;
        } else if (name !== 'plugin') {
            attrMap[name] = item;
        }
    }
    return {
        attrMap,
        eventMap
    };
};

// TODO svg
let toHTML = (node) => {
    if (isNode(node)) {
        return node.outerHTML;
    } else if (isKabaneryNode(node)) {
        let {
            tagName, attrMap, childNodes
        } = node;
        let attrStr = map(attrMap, (value, key) => `${key}="${value}"`).join(' ');
        attrStr = attrStr ? ' ' + attrStr : '';
        return `<${tagName}${attrStr}>${map(childNodes, toHTML).join('')}</${tagName}>`;
    } else {
        return node + '';
    }
};

module.exports = {
    n: cn('html'),
    svgn: cn('svg'),
    cn,
    bindPlugs,
    isKabaneryNode,
    toHTML,
    parseArgs,
    parseStyle
};


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let uuidv4 = __webpack_require__(135);

let seed = uuidv4();

module.exports = {
    eventMapHook: `__eventMap_${seed}`,
    globalEventTypePrefix: `__event_type_id_${seed}_`,
    stopPropagationFlag: '__stopPropagation'
};


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    createElement, createSvgElement
} = __webpack_require__(163);

let {
    bindEvents
} = __webpack_require__(129);

let {
    map
} = __webpack_require__(120);

let {
    isKabaneryNode
} = __webpack_require__(126);

let reduceNode = (node) => {
    if (isKabaneryNode(node)) {
        let tarNode = null;
        if (node.elementType === 'html') {
            tarNode = createElement(node.tagName, node.attrMap, map(node.childNodes, reduceNode));
        } else {
            tarNode = createSvgElement(node.tagName, node.attrMap, map(node.childNodes, reduceNode));
        }

        bindEvents(tarNode, node.eventMap);
        return tarNode;
    } else {
        return node;
    }
};

module.exports = reduceNode;


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let EventMatrix = __webpack_require__(164);

let {
    eventMapHook
} = __webpack_require__(127);

let {
    listenEventType,
    clearEvents,
    attachDocument,
    dispatchEvent
} = EventMatrix();

let bindEvents = (node, eventMap) => {
    // hook event at node
    node[eventMapHook] = eventMap;

    for (let type in eventMap) {
        listenEventType(type);
    }
};

module.exports = {
    bindEvents,
    attachDocument,
    dispatchEvent,
    clearEvents
};


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    WAIT: 2,
    MATCH: 1,
    QUIT: 0
};


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    reduce
} = __webpack_require__(121);

/**
 *
 * valide LR(1) item: LR(1) item [A→α.β, a] is valide for prefix ρ=δα, if exists:
 *      S *⇒ δAω ⇒ δαβω
 *
 * inference: if [A→α.Bβ,a] is valide for ρ=δα, and B→θ is a production, then for any b ϵ FIRST(βa), [B→.θ,b] is valide for predix ρ=δα
 *
 * LR(1) item: [head, body, dotPosition, [...forward]]
 *
 * important: when closure is builded, it's immutable
 */

let buildClosure = (items, grammer, LR1Grammer) => {
    let appendedItems = items;
    let itemsMap = {};
    let prefixMap = {};

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        itemsMap[item.serialize()] = true;
        prefixMap[item.serializePrefix()] = item;
    }

    while (true) { // eslint-disable-line
        let newAppendedItems = reduce(appendedItems, (prev, item) => {
            let newItems = LR1Grammer.expandItem(item);
            return prev.concat(newItems);
        }, []);

        let noRepeatedNewItems = [];

        for (let i = 0; i < newAppendedItems.length; i++) {
            let item = newAppendedItems[i];
            let itemId = item.serialize();

            if (!itemsMap[itemId]) {
                // add new item
                noRepeatedNewItems.push(item);
                itemsMap[item.serialize()] = true;
                let prefixCacheItem = prefixMap[item.serializePrefix()];
                if (prefixCacheItem) {
                    prefixMap[item.serializePrefix()] = prefixCacheItem.concatForwards(item.getForwards());
                } else {
                    prefixMap[item.serializePrefix()] = item;
                }
            }
        }

        if (!noRepeatedNewItems.length) break;

        items = items.concat(noRepeatedNewItems);
        appendedItems = noRepeatedNewItems;
    }

    let serializedText = JSON.stringify(Object.keys(itemsMap).sort());

    let result = [];

    for (let name in prefixMap) {
        result.push(prefixMap[name]);
    }

    return {
        items: result,
        serializedText
    };
};

let sameClosure = (closure1, closure2) => closure1.serializedText === closure2.serializedText;

module.exports = {
    buildClosure,
    sameClosure
};


/***/ }),
/* 132 */
/***/ (function(module, exports) {

module.exports = {
    P_PROGRAM: 'PROGRAM := EXPRESSION_LIST',

    P_EXPRESSION_LIST_0: 'EXPRESSION_LIST := EXPRESSION',
    P_EXPRESSION_LIST_1: 'EXPRESSION_LIST := EXPRESSION semicolon EXPRESSION_LIST',

    P_EXPRESSION_0: 'EXPRESSION := QUERY_EXPRESSION',
    P_EXPRESSION_1: 'EXPRESSION := UPDATE_EXPRESSION',
    P_EXPRESSION_2: 'EXPRESSION := ',

    P_UPDATE_EXPRESSION_0: 'UPDATE_EXPRESSION := PATH assign QUERY_EXPRESSION',
    P_UPDATE_EXPRESSION_1: 'UPDATE_EXPRESSION := delete PATH',
    P_UPDATE_EXPRESSION_2: 'UPDATE_EXPRESSION := append PATH assign QUERY_EXPRESSION',

    P_QUERY_EXPRESSION_0: 'QUERY_EXPRESSION := ATOM_DATA',
    P_QUERY_EXPRESSION_1: 'QUERY_EXPRESSION := variableName',
    P_QUERY_EXPRESSION_2: 'QUERY_EXPRESSION := PATH',
    P_QUERY_EXPRESSION_3: 'QUERY_EXPRESSION := variableName leftBracket rightBracket',
    P_QUERY_EXPRESSION_4: 'QUERY_EXPRESSION := variableName leftBracket QUERY_EXPRESSION_LIST rightBracket',

    P_QUERY_EXPRESSION_LIST_0: 'QUERY_EXPRESSION_LIST := QUERY_EXPRESSION',
    P_QUERY_EXPRESSION_LIST_1: 'QUERY_EXPRESSION_LIST := QUERY_EXPRESSION comma QUERY_EXPRESSION_LIST',

    P_PATH_0: 'PATH := nodeName',
    P_PATH_1: 'PATH := nodeName PATH',
    P_PATH_2: 'PATH := nodeNameVariable',
    P_PATH_3: 'PATH := nodeNameVariable PATH',

    P_ATOM_DATA_0: 'ATOM_DATA := true',
    P_ATOM_DATA_1: 'ATOM_DATA := false',
    P_ATOM_DATA_2: 'ATOM_DATA := null',
    P_ATOM_DATA_3: 'ATOM_DATA := string',
    P_ATOM_DATA_4: 'ATOM_DATA := number',

    T_ATOM: 'atom',
    T_PATH: 'path',
    T_FUNCTION: 'function',
    T_VARIABLE_NAME: 'variableName',
    T_ASSIGN: 'assign',
    T_DELETE: 'delete',
    T_APPEND: 'append',
    T_NODE_NAME: 'nodeName',
    T_NODE_NAME_VARIABLE: 'nodeNameVariable',

    A_DEFAULT: 'default'
};


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
} = __webpack_require__(119);

/**
 *
 * preidcate: chose items to iterate
 * limit: when to stop iteration
 * transfer: transfer item
 * output
 */
let iterate = funType((domain = [], opts = {}) => {
    let {
        predicate, transfer, output, limit, def
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);

    let rets = def;
    let count = 0;

    if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let itemRet = iterateItem(domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let itemRet = iterateItem(domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
}, [
    or(isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateItem = (domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    let item = domain[name];
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = iterate;


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString,
    isObject
} = __webpack_require__(119);

module.exports = (attr = '', {
    keyWrapper,
    valueWrapper
} = {}) => {
    if (isString(attr)) {
        return attr;
    }

    if (!isObject(attr)) {
        throw new TypeError(`Expect object for style object, but got ${attr}`);
    }
    let styles = [];
    for (let key in attr) {
        let value = attr[key];
        key = convertStyleKey(key);
        value = convertStyleValue(value, key);
        if (keyWrapper) {
            key = keyWrapper(key, value);
        }

        if (valueWrapper) {
            value = valueWrapper(value, key);
        }

        styles.push(`${key}: ${value};`);
    }
    return styles.join('');
};

let convertStyleKey = (key) => {
    return key.replace(/[A-Z]/, (letter) => {
        return `-${letter.toLowerCase()}`;
    });
};

let convertStyleValue = (value, key) => {
    if (typeof value === 'number' && key !== 'z-index') {
        return value + 'px';
    }
    if (key === 'padding' || key === 'margin') {
        let parts = value.split(' ');
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            if (!isNaN(Number(part))) {
                parts[i] = part + 'px';
            }
        }

        value = parts.join(' ');
    }
    return value;
};


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(157);
var bytesToUuid = __webpack_require__(158);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    attachDocument
} = __webpack_require__(129);

let {
    isNode
} = __webpack_require__(119);

let {
    flat, forEach
} = __webpack_require__(120);

let reduceNode = __webpack_require__(128);

/**
 * @param parentNode
 *      the dom node used hook node we rendered
 */
module.exports = (kabaneryRoots, parentNode) => {
    kabaneryRoots = flat(kabaneryRoots);

    forEach(kabaneryRoots, (item) => {
        item = reduceNode(item);
        if (isNode(item)) {
            parentNode.appendChild(item);
        }
    });

    // attach to document
    attachDocument(getDoc(parentNode));
};

let getDoc = (node) => {
    while (node.parentNode) {
        node = node.parentNode;
    }
    return node;
};


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    styles
} = __webpack_require__(122);

let container = {
    position: 'relative',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    border: 0,
    borderRadius: 0,
    overflow: 'auto'
};

let fullParentHeight = {
    height: '100%'
};

let fullParentWidth = {
    width: '100%'
};

let fullWindow = styles(container, {
        position: 'fixed',
        left: 0,
        top: 0,
    },
    fullParentWidth, fullParentHeight);

let fullParent = styles(container, fullParentWidth, fullParentHeight);

let flat = {
    appearance: 'none',
    '-webkit-appearance': 'none',
    '-moz-appearance': 'none',
    boxShadow: 'none',
    borderRadius: 'none',
    border: 0
};

module.exports = {
    fullWindow,
    fullParent,
    fullParentWidth,
    fullParentHeight,
    container,
    flat
};


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * @readme-quick-run
 *
 * ## test tar=js r_c=streamTokenSpliter
 *
 * let {
 *     parser, WAIT, QUIT, MATCH
 * } = streamTokenSpliter;

 * let spliter = parser([{
 *     priority: 1,
 *     match: (prefix) => {
 *         if (/^\w*$/.test(prefix)) return MATCH;
 *         return QUIT;
 *     },
 *     name: 'word'
 * }, {
 *     priority: 0,
 *     match: (prefix) => {
 *         if (/^.$/.test(prefix)) return MATCH;
 *         return QUIT;
 *     },
 *     name: 'trash'
 * }]);
 *
 * let tokens1 = spliter('today=is __'); // chunk1
 * let tokens2 = spliter('a good day'); // chunk2
 * let tokens3 = spliter(null); // null means end of stream
 *
 * console.log(tokens1);
 * console.log('\n');
 * console.log(tokens2);
 * console.log('\n');
 * console.log(tokens3);
 */
module.exports = __webpack_require__(178);


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject
} = __webpack_require__(119);

/**
 * basic action types and compose actions
 *
 * action = {
 *   actionType
 * }
 */

const __basic_action_type__ = '7e942534-ea8b-4c75-90fd-705aec328d00';

const LEFT_TYPE = 'left',
    RANGE_TYPE = 'range',
    UNION_TYPE = 'union',
    NORMAL_TYPE = 'normal',
    EPSILON_TYPE = 'epsilon';

let toAction = (v) => {
    if (isAction(v)) return v;
    if (v === null) return {
        content: v,
        actionType: EPSILON_TYPE,
        __basic_action_type__

    };
    return {
        content: v,
        actionType: NORMAL_TYPE,
        __basic_action_type__
    };
};

let left = () => {
    return {
        actionType: LEFT_TYPE,
        __basic_action_type__
    };
};

let range = (start, end) => {
    return {
        actionType: RANGE_TYPE,
        start,
        end,
        __basic_action_type__
    };
};

// union two actions to get a new action
let union = (...actions) => {
    for (let i = 0; i < actions.length; i++) {
        let action = actions[i];
        if (!isAction(action)) {
            actions[i] = toAction(action);
        }
    }

    return {
        actionType: UNION_TYPE,
        actions,
        __basic_action_type__
    };
};

let isAction = (v) => {
    return isObject(v) && v.__basic_action_type__ === __basic_action_type__;
};

let isLeftAction = (v) => isAction(v) && v.actionType === LEFT_TYPE;

let isRangeAction = (v) => isAction(v) && v.actionType === RANGE_TYPE;

let isUnionAction = (v) => isAction(v) && v.actionType === UNION_TYPE;

let isNormalAction = (v) => isAction(v) && v.actionType === NORMAL_TYPE;

let isEpsilonAction = (v) => isAction(v) && v.actionType === EPSILON_TYPE;

module.exports = {
    isAction,
    isLeftAction,
    isRangeAction,
    isUnionAction,
    isNormalAction,
    isEpsilonAction,

    left,
    range,
    toAction,
    union
};


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(119);

let iterate = __webpack_require__(141);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact, reverse, overArgs
} = __webpack_require__(183);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact,
    reverse,
    overArgs
};


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isPromise, likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, isReadableStream, mapType
} = __webpack_require__(119);

/**
 * @param opts
 *      preidcate: chose items to iterate
 *      limit: when to stop iteration
 *      transfer: transfer item
 *      output
 *      def: default result
 */
let iterate = funType((domain, opts = {}) => {
    domain = domain || [];
    if (isPromise(domain)) {
        return domain.then(list => {
            return iterate(list, opts);
        });
    }
    return iterateList(domain, opts);
}, [
    or(isPromise, isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateList = (domain, opts) => {
    opts = initOpts(opts, domain);

    let rets = opts.def;
    let count = 0; // iteration times

    if (isReadableStream(domain)) {
        let index = -1;

        return new Promise((resolve, reject) => {
            domain.on('data', (chunk) => {
                // TODO try cache error
                let itemRet = iterateItem(chunk, domain, ++index, count, rets, opts);
                rets = itemRet.rets;
                count = itemRet.count;
                if (itemRet.stop) {
                    resolve(rets);
                }
            });
            domain.on('end', () => {
                resolve(rets);
            });
            domain.on('error', (err) => {
                reject(err);
            });
        });
    } else if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let item = domain[i];
            let itemRet = iterateItem(item, domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let item = domain[name];
            let itemRet = iterateItem(item, domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
};

let initOpts = (opts, domain) => {
    let {
        predicate, transfer, output, limit
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);
    return opts;
};

let iterateItem = (item, domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = {
    iterate
};


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let assembleToken = (tokenType, prefix) => {
    return {
        tokenType,
        name: tokenType.name,
        text: prefix
    };
};

module.exports = {
    assembleToken
};


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    END_SYMBOL: '$',
    EXPAND_START_SYMBOL: 'S`',
    EPSILON: null
};


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isPromise, likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, isReadableStream, mapType
} = __webpack_require__(119);

/**
 * @param opts
 *      preidcate: chose items to iterate
 *      limit: when to stop iteration
 *      transfer: transfer item
 *      output
 *      def: default result
 */
let iterate = funType((domain, opts = {}) => {
    domain = domain || [];
    if (isPromise(domain)) {
        return domain.then(list => {
            return iterate(list, opts);
        });
    }
    return iterateList(domain, opts);
}, [
    or(isPromise, isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateList = (domain, opts) => {
    opts = initOpts(opts, domain);

    let rets = opts.def;
    let count = 0; // iteration times

    if (isReadableStream(domain)) {
        let index = -1;

        return new Promise((resolve, reject) => {
            domain.on('data', (chunk) => {
                // TODO try cache error
                let itemRet = iterateItem(chunk, domain, ++index, count, rets, opts);
                rets = itemRet.rets;
                count = itemRet.count;
                if (itemRet.stop) {
                    resolve(rets);
                }
            });
            domain.on('end', () => {
                resolve(rets);
            });
            domain.on('error', (err) => {
                reject(err);
            });
        });
    } else if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let item = domain[i];
            let itemRet = iterateItem(item, domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let item = domain[name];
            let itemRet = iterateItem(item, domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
};

let initOpts = (opts, domain) => {
    let {
        predicate, transfer, output, limit
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);
    return opts;
};

let iterateItem = (item, domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = {
    iterate
};


/***/ }),
/* 145 */
/***/ (function(module, exports) {

let getProductionId = (production) => {
    return `${production[0]} := ${production[1].join(' ')}`;
};

// ignore whitespace
let processTokens = (rawTokens) => {
    let tokens = [];
    for (let i = 0; i < rawTokens.length; i++) {
        let {
            text,
            tokenType
        } = rawTokens[i];

        let name = tokenType.name;

        if (name !== 'whitespace') { // ignore white space
            tokens.push({
                text,
                name
            });
        }
    }

    return tokens;
};

let isObject = v => v && typeof v === 'object';

let isFunction = v => typeof v === 'function';

let isString = v => typeof v === 'string';

module.exports = {
    getProductionId,
    processTokens,
    isObject,
    isFunction,
    isString
};


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let lumineViewer = __webpack_require__(147);

module.exports = (viewFun, options) => lumineViewer(viewFun)(options);


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    view
} = __webpack_require__(125);
let steadyTheme = __webpack_require__(166);
let {
    deepMergeMap,
    resolveFnValue
} = __webpack_require__(122);
let ClassTable = __webpack_require__(171);
let {
    Signal
} = __webpack_require__(172);
let JsonTree = __webpack_require__(173);
let {
    executeAST
} = __webpack_require__(175);

/**
 * define the general interface for lumine view
 *
 * 1. unify view data structure
 *
 *    view data = {
 *       // public data
 *       props,
 *       children // child views
 *    }
 *
 *    props.onsigal
 *    props.theme
 *
 * 2. onsignal interface
 *
 *    onsignal: (signal, data, ctx) -> Any
 */

module.exports = (viewFun) => ({
    defaultProps = {},
    defaultChildren = [],
    theme = steadyTheme,
    classTable
} = {}) => {
    let defaultStyle = defaultProps.style || {};

    let defaultStyleValue = resolveFnValue(defaultStyle, theme);
    let classTableValue = resolveFnValue(classTable, theme);

    let {
        appendStyle,
        getClassName,
        updateClassTable
    } = ClassTable(classTableValue);

    return view((viewData, ctx) => {
        viewData.props = viewData.props || {};
        viewData.children = (viewData.children && viewData.children.length) ? viewData.children : defaultChildren;
        viewData.props.theme = viewData.props.theme || theme;

        appendStyle();
        // TODO check view Data

        // update defaultStyleValue
        if (viewData.props.theme && typeof defaultStyle === 'function') {
            defaultStyleValue = resolveFnValue(defaultStyle, viewData.props.theme);
        }

        // update class table
        if (viewData.theme && typeof classTable === 'function') {
            classTableValue = resolveFnValue(classTable, viewData.props.theme);
            updateClassTable(classTableValue);
        }

        // merge props (deep merge)
        viewData.props.style = deepMergeMap(viewData.props.style, defaultStyleValue);
        viewData.props = deepMergeMap(viewData.props, defaultProps);

        // signal system
        let notify = (signal) => {
            viewData.props.onsignal && viewData.props.onsignal(signal, ctx.getData(), ctx);
        };

        let viewDataTree = JsonTree(viewData);

        // update with tree script
        let updateTree = ({
            ast,
            variableStub
        }, variableMap, signal) => {
            signal = signal || Signal('update-view-data');
            // update view data by running update script
            executeAST(ast, {
                queryByPath: viewDataTree.queryByPath,
                setByPath: viewDataTree.setByPath,
                removeByPath: viewDataTree.removeByPath,
                appendByPath: viewDataTree.appendByPath,
                variableMap,
                variableStub
            });
            updateWithNotify(signal);
        };

        let updateWithNotify = (signal, ...updateScript) => {
            signal = signal || Signal('update-view-data');
            ctx.update(...updateScript);
            // notify
            notify(signal);
        };

        ctx.notify = notify;
        ctx.updateWithNotify = updateWithNotify;
        ctx.updateTree = updateTree;
        ctx.getClassName = getClassName;

        return viewFun(viewData, ctx);
    });
};


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n,
    svgn,
    bindPlugs,
    toHTML,
    parseArgs,
    isKabaneryNode,
    cn,
    parseStyle
} = __webpack_require__(126);

let plugs = __webpack_require__(152);

let view = __webpack_require__(155);

let mount = __webpack_require__(136);

let N = __webpack_require__(165);

let reduceNode = __webpack_require__(128);

let {
    dispatchEvent,
    clearEvents
} = __webpack_require__(129);

module.exports = {
    n,
    isKabaneryNode,
    cn,
    N,
    svgn,
    view,
    plugs,
    bindPlugs,
    mount,
    toHTML,
    reduceNode,

    parseArgs,
    parseStyle,
    dispatchEvent,
    clearEvents
};


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let iterate = __webpack_require__(133);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

module.exports = {
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact
};


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let parseAttribute = __webpack_require__(151);

let {
    isString,
    isObject,
    isNode,
    likeArray,
    isNumber,
    isBool
} = __webpack_require__(119);

let parseArgs = (args, {
    doParseStyle = true
} = {}) => {
    let tagName,
        attributes = {},
        childExp = [];

    let first = args.shift();

    let parts = splitTagNameAttribute(first);

    if (parts.length > 1) { // not only tagName
        tagName = parts[0];
        attributes = parts[1];
    } else {
        tagName = first;
    }

    let next = args.shift();

    let nextAttr = {};

    if (likeArray(next) ||
        isString(next) ||
        isNode(next) ||
        isNumber(next) ||
        isBool(next)) {
        childExp = next;
    } else if (isObject(next)) {
        nextAttr = next;
        childExp = args.shift() || [];
    }

    attributes = parseAttribute(attributes, nextAttr, {
        doParseStyle
    });

    let childs = parseChildExp(childExp);

    return {
        tagName,
        attributes,
        childs
    };
};

let splitTagNameAttribute = (str = '') => {
    if (typeof str !== 'string') return [str];

    let tagName = str.split(' ')[0];
    let attr = str.substring(tagName.length);
    attr = attr && attr.trim();

    tagName = tagName.toLowerCase().trim();
    if (attr) {
        return [tagName, attr];
    } else {
        return [tagName];
    }
};

let parseChildExp = (childExp) => {
    let ret = [];
    if (isNode(childExp)) {
        ret.push(childExp);
    } else if (likeArray(childExp)) {
        for (let i = 0; i < childExp.length; i++) {
            let child = childExp[i];
            ret = ret.concat(parseChildExp(child));
        }
    } else if (childExp) {
        ret.push(childExp);
    }
    return ret;
};

module.exports = parseArgs;


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString
} = __webpack_require__(119);

let parseStyle = __webpack_require__(134);

let {
    mergeMap
} = __webpack_require__(120);

const ITEM_REG = /([\w-]+)\s*=\s*(([\w-]+)|('.*?')|(".*?"))/;

// TODO better key=value grammer
// TODO refactor with grammerL: class grammer, id grammer, refer some popular grammer
let parseAttribute = (attributes, nextAttr, {
    doParseStyle
}) => {
    // key=value key=value
    // value='abc' value=true value=123 value="def"
    if (isString(attributes)) {
        let str = attributes.trim(),
            kvs = [];

        let stop = false;
        while (!stop) {
            let newstr = str.replace(ITEM_REG, (matchStr, $1, $2) => {
                kvs.push([$1, $2]);
                return '';
            }).trim();
            if (newstr === str) {
                stop = true;
            }
            str = newstr;
        }

        attributes = {};
        for (let i = 0; i < kvs.length; i++) {
            let [key, value] = kvs[i];
            if (value[0] === '\'' && value[value.length - 1] === '\'' ||
                value[0] === '"' && value[value.length - 1] === '"') {
                value = value.substring(1, value.length - 1);
            }
            attributes[key] = value;
        }
    }
    // merge
    attributes = mergeMap(attributes, nextAttr);

    if (attributes.style && doParseStyle) {
        attributes.style = parseStyle(attributes.style);
    }

    // TODO presudo
    /*
    if (attributes.presudo) {
        for (let name in attributes.presudo) {
            attributes.presudo[name] = parseStyle(attributes.presudo[name]);
        }
    }
   */

    return attributes;
};

module.exports = parseAttribute;


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let twowaybinding = __webpack_require__(153);
let eventError = __webpack_require__(154);

module.exports = {
    twowaybinding,
    eventError
};


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    get, set
} = __webpack_require__(123);

module.exports = (obj, path) => (tagName, attributes, childExp) => {
    let value = get(obj, path, '');
    if (tagName === 'input') {
        attributes.value = value;
    } else {
        childExp.unshift(value);
    }

    if (!attributes.oninput) {
        attributes.oninput = (e) => {
            set(obj, path, e.target.value);
        };
    }
};


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (catcher) => (tagName, attributes) => {
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            if (typeof item === 'function') {
                attributes[name] = wrapEventHandler(item, catcher);
            }
        }
    }
};

let wrapEventHandler = (fun, catcher) => {
    return function () {
        try {
            let ret = fun.apply(this, arguments);
            ret = Promise.resolve(ret);
            ret.catch(catcher);
            return ret;
        } catch (err) {
            return catcher(err);
        }
    };
};


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    set
} = __webpack_require__(123);

let {
    isObject,
    isFunction,
    likeArray
} = __webpack_require__(119);

let {
    forEach
} = __webpack_require__(120);

let replace = __webpack_require__(156);

let reduceNode = __webpack_require__(128);

let mount = __webpack_require__(136);

/**
 * render function: (data) => node
 */

// TODO observable for update, append

// class level
let View = (view, construct, {
    afterRender
} = {}) => {
    // TODO class level API
    // instance level
    let viewer = (obj, initor) => {
        // create context
        let ctx = createCtx({
            view,
            afterRender
        });

        return createView(ctx, obj, initor, construct);
    };

    let viewerOps = (viewer) => {
        viewer.create = (handler) => {
            let ctx = createCtx({
                view,
                afterRender
            });

            handler && handler(ctx);

            let inst = (obj, initor) => {
                return createView(ctx, obj, initor, construct);
            };

            inst.ctx = ctx;

            return inst;
        };

        // extend some context
        viewer.expand = (ctxMap = {}) => {
            let newViewer = (...args) => {
                let obj = args[0];
                args[0] = View.ext(obj, ctxMap);

                return viewer(...args);
            };

            viewerOps(newViewer);
            return newViewer;
        };
    };

    viewerOps(viewer);

    return viewer;
};

View.ext = (data, ctxMap = {}) => (ctx) => {
    for (let name in ctxMap) {
        ctx[name] = ctxMap[name];
    }
    if (isFunction(data)) {
        return data(ctx);
    }
    return data;
};

let createView = (ctx, obj, initor, construct) => {
    let data = ctx.initData(obj, ctx);
    // only run initor when construct view
    initor && initor(data, ctx);
    construct && construct(data, ctx);

    // render node
    return ctx.replaceView();
};

let createCtx = ({
    view,
    afterRender
}) => {
    let node = null,
        data = null,
        render = null;

    let update = (...args) => {
        updateData(...args);
        return replaceView();
    };

    let updateData = (...args) => {
        if (args.length === 1 && likeArray(args[0])) {
            let arg = args[0];
            forEach(arg, (item) => {
                set(data, item[0], item[1]);
            });
        } else {
            let [path, value] = args;

            // function is a special data
            if (isFunction(value)) {
                value = value(data);
            }

            set(data, path, value);
        }
    };

    let appendView = (itemView) => {
        if (node) {
            mount(itemView, node);
        }
    };

    let replaceView = () => {
        let newNode = getNewNode();
        newNode = reduceNode(newNode);

        // type check for newNode

        node = replace(node, newNode);

        afterRender && afterRender(ctx);

        if (node) node.ctx = ctx;
        return node;
    };

    let getNewNode = () => {
        if (!render) render = view;
        let ret = render(data, ctx);
        if (isFunction(ret)) {
            render = ret;
            return render(data, ctx);
        } else {
            return ret;
        }
    };

    let initData = (obj = {}) => {
        data = generateData(obj, ctx);
        return data;
    };

    let getNode = () => node;

    let getData = () => data;

    let getCtx = () => ctx;

    // TODO refator
    let transferCtx = (newNode) => {
        node = newNode;
        newNode.ctx = ctx;
    };

    let ctx = {
        update,
        updateData,
        getNode,
        getData,
        transferCtx,
        initData,
        replaceView,
        appendView,
        getCtx
    };

    return ctx;
};

let generateData = (obj, ctx) => {
    let data = null;
    // data generator
    if (isFunction(obj)) {
        data = obj(ctx);
    } else {
        data = obj;
    }

    // TODO need mount event
    if (!isObject(data)) {
        throw new TypeError(`Expect object, but got ${data}. Type is ${typeof data}`);
    }
    return data;
};

module.exports = View;


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    toArray
} = __webpack_require__(123);

let {
    isNode
} = __webpack_require__(119);

let {
    forEach
} = __webpack_require__(120);

let {
    eventMapHook
} = __webpack_require__(127);

let applyAttibutes = __webpack_require__(159);

let replaceDirectly = (node, newNode) => {
    let parent = node.parentNode;
    if (parent) {
        // replace
        parent.replaceChild(newNode, node);
        return newNode;
    } else {
        return node;
    }
};

let removeOldNode = (oldNode) => {
    let parent = oldNode.parentNode;
    if (parent) {
        parent.removeChild(oldNode);
    }
};

// TODO using key
let diffNode = (node, newNode) => {
    if (!newNode) {
        return removeOldNode(node);
    }

    if (node.nodeType === 3 && newNode.nodeType === 3) {
        node.textContent = newNode.textContent;
    }

    if (isNode(node) && isNode(newNode)) {
        if (node.nodeType === 3 && newNode.nodeType === 3) {
            node.textContent = newNode.textContent;
            return node;
        }

        if (node.tagName !== newNode.tagName ||
            node.tagName === 'INPUT'
        ) {
            // TODO problems performance
            // TODO nodetype problem
            return replaceDirectly(node, newNode);
        } else {
            editNode(node, newNode);
        }
    }
    return node;
};

let editNode = (node, newNode) => {
    // attributes
    applyAttibutes(node, newNode);

    // hacks for dom
    if (node.tagName === 'TEXTAREA') {
        node.value = newNode.textContent;
    }
    if (node.tagName === 'INPUT') {
        node.value = newNode.getAttribute('value');
    }

    // transfer context
    if (newNode.ctx) {
        newNode.ctx.transferCtx(node);
    }

    // transfer event map
    if (newNode[eventMapHook]) {
        node[eventMapHook] = newNode[eventMapHook];
    }

    let orinChildNodes = toArray(node.childNodes);
    let newChildNodes = toArray(newNode.childNodes);

    // TODO using key
    convertLists(orinChildNodes, newChildNodes, node);
};

let convertLists = (orinChildNodes, newChildNodes, parent) => {
    removeExtra(orinChildNodes, newChildNodes);

    // diff
    forEach(orinChildNodes, (orinChild, i) => {
        diffNode(orinChild, newChildNodes[i]);
    });

    appendMissing(orinChildNodes, newChildNodes, parent);
    return orinChildNodes;
};

let removeExtra = (orinChildNodes, newChildNodes) => {
    // remove
    for (let i = newChildNodes.length; i < orinChildNodes.length; i++) {
        removeOldNode(orinChildNodes[i]);
    }
};

let appendMissing = (orinChildNodes, newChildNodes, parent) => {
    // append
    for (let i = orinChildNodes.length; i < newChildNodes.length; i++) {
        let newChild = newChildNodes[i];
        parent.appendChild(newChild);
    }
};

module.exports = (node, newNode) => {
    let ret = null;

    if (!node) {
        ret = newNode;
    } else if (!newNode) {
        removeOldNode(node);
        ret = null;
    } else {
        ret = diffNode(node, newNode);
    }

    return ret;
};


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),
/* 158 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    getAttributeMap
} = __webpack_require__(160);

let {
    hasOwnProperty
} = __webpack_require__(123);

let {
    forEach
} = __webpack_require__(120);

let applyAttibutes = (node, newNode) => {
    // attributes
    let orinAttrMap = getAttributeMap(node.attributes);
    let newAttrMap = getAttributeMap(newNode.attributes);

    // update and remove
    forEach(orinAttrMap, (orinValue, name) => {
        if (hasOwnProperty(newAttrMap, name)) {
            let newValue = newAttrMap[name];
            if (newValue !== orinValue) {
                node.setAttribute(name, newValue);
            }
        } else {
            node.removeAttribute(name);
        }
    });

    // append
    forEach(newAttrMap, (newAttr, name) => {
        if (!hasOwnProperty(orinAttrMap, name)) {
            node.setAttribute(name, newAttr);
        }
    });
};

module.exports = applyAttibutes;


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let shadowFrame = __webpack_require__(161);

let startMomenter = __webpack_require__(162);

let getX = (elem) => {
    var x = 0;
    while (elem) {
        x = x + elem.offsetLeft;
        elem = elem.offsetParent;
    }
    return x;
};

let getY = (elem) => {
    var y = 0;
    while (elem) {
        y = y + elem.offsetTop;
        elem = elem.offsetParent;
    }
    return y;
};

let getClientX = (elem) => {
    return getX(elem) - window.scrollX;
};

let getClientY = (elem) => {
    return getY(elem) - window.scrollY;
};

let removeChilds = (node) => {
    while (node && node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

let once = (node, type, handler, useCapture) => {
    let fun = function(e) {
        let ret = handler.apply(this, [e]);
        node.removeEventListener(type, fun, useCapture);
        return ret;
    };

    node.addEventListener(type, fun, useCapture);
};

let getAttributeMap = (attributes = []) => {
    let map = {};
    for (let i = 0; i < attributes.length; i++) {
        let {
            name, value
        } = attributes[i];
        map[name] = value;
    }
    return map;
};

let getClasses = (clz = '') => {
    let ret = [];
    let items = clz.split(' ');
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        item = item.trim();
        if (item) {
            ret.push(item);
        }
    }
    return ret;
};

module.exports = {
    getX,
    getY,
    getClientX,
    getClientY,
    removeChilds,
    once,
    shadowFrame,
    getAttributeMap,
    startMomenter,
    getClasses
};


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let shadowFrame = () => {
    let div = document.createElement('div');
    let sr = div.createShadowRoot();
    sr.innerHTML = '<div id="shadow-page"></div>';

    let frame = null;

    let create = () => {
        let html = document.getElementsByTagName('html')[0];
        html.appendChild(div);

        return sr.getElementById('shadow-page');
    };

    let start = () => {
        if (frame) {
            return frame;
        }
        frame = new Promise(resolve => {
            if (document.body) {
                resolve(create());
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    resolve(create());
                });
            }
        });
        return frame;
    };

    let close = () => {
        frame.then(() => {
            let parent = div.parentNode;
            parent && parent.removeChild(div);
        });
    };

    return {
        start,
        close,
        sr,
        rootDiv: div
    };
};

module.exports = shadowFrame;


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let isDomReady = (doc) => doc.readyState === 'complete' ||
    (!doc.attachEvent && doc.readyState === 'interactive');

let startMomenter = (doc = document) => {
    let loadedFlag = false;

    let resolves = [];

    let docReady = () => {
        let ready = () => {
            if (loadedFlag) return;
            loadedFlag = true;
            for (let i = 0; i < resolves.length; i++) {
                resolves[i]();
            }
            resolves = [];
        };
        if (doc.addEventListener) {
            doc.addEventListener('DOMContentLoaded', ready);
            doc.addEventListener('DOMContentLoaded', ready);
        } else {
            doc.attachEvent('onreadystatechange', () => {
                if (document.readyState === 'complete') {
                    ready();
                }
            });
        }
    };

    docReady();

    // generalWaitTime is used for async rendering
    return ({
        generalWaitTime = 0, startTimeout = 10000
    } = {}) => new Promise((resolve, reject) => {
        if (loadedFlag || isDomReady(doc)) { // already ready
            setTimeout(resolve, generalWaitTime);
        } else { // wait for ready
            resolves.push(resolve);
            setTimeout(() => {
                reject(new Error('timeout'));
            }, startTimeout);
        }
    });
};

module.exports = startMomenter;


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isNode
} = __webpack_require__(119);

const svgNS = 'http://www.w3.org/2000/svg';

let applyNode = (node, attributes, childs) => {
    for (let name in attributes) {
        let attr = attributes[name];
        node.setAttribute(name, attr);
    }

    for (let i = 0; i < childs.length; i++) {
        let child = childs[i];
        if (isNode(child)) {
            node.appendChild(child);
        } else {
            node.textContent = child + '';
        }
    }
};

let createElement = (tagName, attributes, childs) => {
    let node = document.createElement(tagName);
    applyNode(node, attributes, childs);
    return node;
};

let createSvgElement = (tagName, attributes, childs) => {
    let node = document.createElementNS(svgNS, tagName);
    applyNode(node, attributes, childs);
    return node;
};

module.exports = {
    createElement,
    createSvgElement
};


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    contain
} = __webpack_require__(120);

let {
    eventMapHook,
    globalEventTypePrefix,
    stopPropagationFlag
} = __webpack_require__(127);

module.exports = () => {
    let docs = [];
    let eventTypeMap = {};
    let handlerMap = {};

    let listenEventType = (type) => {
        if (!eventTypeMap[type]) {
            updateDocs(type);
        }
        eventTypeMap[type] = true;
    };

    /**
     * attach document used to accept events
     */
    let attachDocument = (doc = document) => {
        if (!contain(docs, doc)) {
            for (let type in eventTypeMap) {
                // prevent multiple version of kabanery to binding multiple times for the same type
                let id = getGlobalEventTypeId(type);
                if (!doc[id]) {
                    addEventListenerToDoc(doc, type);
                    doc[id] = true;
                }
            }
            docs.push(doc);
        }
    };

    let updateDocs = (type) => {
        if (!docs.length) {
            docs.push(document);
        }
        for (let i = 0; i < docs.length; i++) {
            let doc = docs[i];
            addEventListenerToDoc(doc, type);
        }
    };

    let addEventListenerToDoc = (doc, type) => {
        let handler = null;
        if (handlerMap[type]) {
            handler = handlerMap[type];
        } else {
            handler = listener(type);
            handlerMap[type] = handler;
        }
        doc.addEventListener(type, handler);
    };

    let clearEvents = () => {
        for (let type in eventTypeMap) {
            removeListenerType(type);
        }
    };

    let removeListenerType = (type) => {
        let handler = handlerMap[type];
        if (handler) {
            for (let i = 0; i < docs.length; i++) {
                let doc = docs[i];
                doc.removeEventListener(type, handler);
            }
            delete handlerMap[type];
            delete eventTypeMap[type];
        }
    };

    let getDocs = () => docs.slice(0);

    /**
     * e = {
     *  target,
     *  stopPropagation [optional]
     * }
     */
    let listener = (type) => function(e) {
        let ctx = this;
        let target = e.target;

        // hack the stopPropagration function
        let oldProp = e.stopPropagation;
        e.stopPropagation = function(...args) {
            e[stopPropagationFlag] = true;
            return oldProp && oldProp.apply(this, args);
        };

        let nodePath = getNodePath(target);

        for (let i = 0; i < nodePath.length; i++) {
            let node = nodePath[i];
            applyNodeHandlers(e, type, node, ctx);
        }
    };

    let applyNodeHandlers = (e, type, node, ctx) => {
        if (e.__stopPropagation) { // event already been stoped by child node
            return true;
        }

        let handler = getHandler(type, node);
        return handler && handler.apply(ctx, [e]);
    };

    let getHandler = (type, target) => {
        let eventMap = target && target[eventMapHook];
        return eventMap && eventMap[type];
    };

    let dispatchEvent = (type, e) => {
        let handler = handlerMap[type];
        handler && handler(e);
    };

    return {
        listenEventType,
        clearEvents,
        removeListenerType,
        getDocs,
        attachDocument,
        dispatchEvent
    };
};

/**
 * get the path of node
 */
let getNodePath = (target) => {
    let paths = [];
    while (target) {
        paths.push(target);
        target = target.parentNode;
    }
    return paths;
};

let getGlobalEventTypeId = (type) => `${globalEventTypePrefix}${type}`;


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(126);

let {
    isArray, isFunction, isObject
} = __webpack_require__(119);

let {
    map
} = __webpack_require__(120);

module.exports = (...args) => {
    let tagName = args[0],
        attrs = {},
        childs = [];
    if (isArray(args[1])) {
        childs = args[1];
    } else if (isFunction(args[1])) {
        childs = [args[1]];
    } else {
        if (isObject(args[1])) {
            attrs = args[1];
            if (isArray(args[2])) {
                childs = args[2];
            } else if (isFunction(args[2])) {
                childs = [args[2]];
            }
        }
    }

    return (...params) => {
        let renderList = (list) => {
            return map(list, (viewer) => {
                if (isArray(viewer)) {
                    return renderList(viewer);
                } else if (isFunction(viewer)) {
                    return viewer(...params);
                } else {
                    return viewer;
                }
            });
        };

        return n(tagName, attrs, renderList(childs));
    };
};


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let base = __webpack_require__(167);

module.exports = base({
    pageColor: 'white',
    hoverColor: '#90CAF9',
    blockColor: '#2196F3', // rgb(33,150,243)
    borderColor: '#1565C0',
    veilColor: 'rgba(125,125,125,0.6)',
    fontColor: 'white',
    noticeColor: 'rgb(2, 40, 51)',
    shadowColor: 'rgba(100,100,100,0.2)',

    // half
    halfBlockColor: 'rgba(33,150,243,0.5)',

    titleSize: 20,
    normalSize: 16,

    narrowPadding: '4 8 4 8',
    narrowPaddingTop: 4,
    narrowPaddingRight: 8,
    narrowPaddingBottom: 4,
    narrowPaddingLeft: 8,

    narrowMargin: '4 8 4 8',

    contrastBlockColor: 'white',
    contrastFontColor: 'black'
});


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    styles
} = __webpack_require__(122);

let layout = __webpack_require__(137);
let Bulk = __webpack_require__(168);
let Actions = __webpack_require__(169);
let Widget = __webpack_require__(170);

module.exports = (basics, custom = {}) => {
    let bulks = Bulk(basics);
    let actions = Actions(basics);
    let widgets = Widget(basics, layout, bulks);

    if (typeof custom === 'function') {
        custom = custom(basics, layout, bulks);
    }

    bulks = Object.assign(bulks, custom.bulks || {});
    actions = Object.assign(actions, custom.actions || {});
    widgets = Object.assign(widgets, custom.widgets || {});

    return Object.assign({
        basics,
        actions
    }, layout, bulks, actions, widgets);
};


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    styles
} = __webpack_require__(122);

let layout = __webpack_require__(137);

let {
    container
} = layout;

module.exports = (basics) => {
    let bulk = styles(container, {
        minWidth: 40,
        backgroundColor: basics.blockColor,
        color: basics.fontColor
    });

    let contrastBulk = styles(bulk, {
        backgroundColor: basics.contrastBlockColor,
        color: basics.contrastFontColor
    });

    let oneLineBulk = styles(bulk, {
        padding: basics.narrowPadding,
        fontSize: basics.normalSize,
        textAlign: 'center',
        lineHeight: 20,
        textDecoration: 'none',
        border: 'none',
        color: basics.fontColor
    });

    let flatOneLineBulk = styles(oneLineBulk, {
        display: 'inline-block',
        backgroundColor: basics.contrastBlockColor,
        color: basics.blockColor
    });

    let modalBulk = styles(oneLineBulk, contrastBulk, {
        display: 'inline-block',
        boxShadow: `3px 3px 5px ${basics.shadowColor}`
    });

    return {
        bulk,
        contrastBulk,
        oneLineBulk,
        modalBulk,
        flatOneLineBulk
    };
}


/***/ }),
/* 169 */
/***/ (function(module, exports) {

module.exports = (basics) => {
    return {
        hover: {
            backgroundColor: basics.hoverColor
        },

        active: {
            backgroundColor: basics.hoverColor
        },

        focus: {
            outline: 'none'
        },

        flatHover: {
            color: basics.hoverColor
        },

        flatActive: {
            color: basics.hoverColor
        }
    }
};


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

let {
    styles
} = __webpack_require__(122);

module.exports = (basics, layout, bulks) => {
    let {
        contrastBulk
    } = bulks;
    let {
        flat
    } = layout;

    let cardBox = styles(contrastBulk, flat, {
        border: `1px solid ${basics.shadowColor}`,
        boxShadow: `3px 3px 5px ${basics.shadowColor}`,
        borderRadius: 2
    });

    let inputBox = styles(contrastBulk, flat, {
        width: 260,
        padding: basics.narrowPadding,
        backgroundColor: basics.fontColor
    });

    let textAreaBox = styles(inputBox, {
        width: 360,
        height: 200,
        outline: 'none',
        resize: 'none',
        overflow: 'auto',
        border: `1px solid ${basics.borderColor}`,
        borderRadius: 5,
        fontSize: 16
    });

    let underLineBorder = {
        border: 0,
        borderRadius: 0,
        'border-bottom': `1px solid ${basics.borderColor}`
    };

    let underLineFocus = {
        paddingBottom: basics.narrowPaddingBottom - 1,
        'border-bottom': `2px solid ${basics.blockColor}`
    };

    let flatRippleMask = {
        content: '',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 5,
        height: 5,
        backgroundColor: basics.halfBlockColor,
        opacity: '0',
        borderRadius: '100%',
        transform: 'scale(1, 1) translate(-50%)',
        transformOrigin: '50% 50%'
    };

    return {
        inputBox,
        textAreaBox,
        underLineBorder,
        underLineFocus,
        flatRippleMask,
        cardBox
    };
};


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isMapObject
} = __webpack_require__(122);

let {
    mount,
    n,
    parseStyle
} = __webpack_require__(125);

const VIEW_CLASS_PREFIX = 'kabanery-lumine';

let count = -1;

module.exports = (classTable) => {
    count++;

    let viewClassId = `${VIEW_CLASS_PREFIX}-${count}`;

    let getStyleRuleName = (name) => {
        if (name[0] === '@') {
            let prev = name.split(' ')[0];
            let next = name.substring(prev.length).trim();
            return `${prev} ${viewClassId}-${next}`;
        } else {
            return `.${viewClassId}-${name}`;
        }
    };

    let appendStyle = () => {
        if (styleCssRules) {
            mount(n('style', {
                id: viewClassId
            }, styleCssRules), document.head);
            styleCssRules = null;
        }
    };

    let getClassName = (name) => {
        if (name[0] === '@') {
            let prev = name.split(' ')[0];
            let next = name.substring(prev.length).trim();
            name = next;
        }

        return `${viewClassId}-${name.split(':')[0]}`;
    };

    let updateClassTable = (newClassTable) => {
        let node = document.getElementById(viewClassId);
        if (node) {
            node.parentNode.removeChild(node);
        }

        setStyleCssRules(newClassTable);
        appendStyle();
    };

    let styleCssRules = null;

    let setStyleCssRules = (classTable) => {
        if (isMapObject(classTable)) {
            styleCssRules = '';
            for (let name in classTable) {
                name = name.trim();
                let styleRuleName = getStyleRuleName(name);
                let classCnt = classTable[name];
                if (typeof classCnt === 'function') {
                    classCnt = classCnt({
                        getClassName
                    });
                }
                let styleRuleContent = parseStyle(classCnt, {
                    valueWrapper: (value) => `${value !== ''? value: '\'\''} !important`
                });
                styleCssRules += `\n${styleRuleName} {${styleRuleContent}}`;
            }
        }
    };

    setStyleCssRules(classTable);

    return {
        appendStyle,
        getClassName,
        updateClassTable
    };
};


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let Signal = (type, data) => {
    return {
        type,
        data
    };
};

let isSignalType = (s, type) => {
    return s.type === type;
};

let onSignalType = (expectType, fn) => (signal, ...rest) => {
    if (isSignalType(signal, expectType)) {
        return fn(signal, ...rest);
    }
};

let deliver = (ctx, type, extra) => (sourceSignal, sourceData, sourceCtx) => {
    ctx.notify(Signal(type, {
        sourceType: 'delivered',
        sourceSignal,
        sourceData,
        sourceCtx,
        extra
    }));
};

module.exports = {
    Signal,
    onSignalType,
    isSignalType,
    deliver
};


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    autoId,
    isObject,

    modifySuccess,
    removeNoneExist,
    removeSuccess
} = __webpack_require__(174);

module.exports = (jsonData, {
    missingValue = undefined
} = {}) => {
    let queryByPath = (path) => {
        let cur = jsonData;
        for (let i = 0; i < path.length; i++) {
            if (!isObject(cur)) {
                return missingValue;
            } else {
                if (cur.hasOwnProperty(path[i])) {
                    cur = cur[path[i]];
                } else {
                    return missingValue;
                }
            }
        }

        return cur;
    };

    let setByPath = (path, value) => {
        let parent = jsonData;

        for (let i = 0; i < path.length - 1; i++) {
            let part = path[i];
            let next = parent[part];
            if (!isObject(next)) { // if is not object, just override to a empty object
                next = {}; // create a new middle node
                parent[part] = next;
            }
            parent = next;
        }

        parent[path[path.length - 1]] = value; // set value
        return modifySuccess(path, value);
    };

    return {
        queryByPath,

        setByPath,

        removeByPath: (path) => {
            let parentPath = path.slice(0, path.length - 1);
            let lastKey = path[path.length - 1];
            let parent = queryByPath(parentPath);
            if (parent === missingValue || !isObject(parent) || !parent.hasOwnProperty(lastKey)) {
                return removeNoneExist(path);
            } else {
                delete parent[lastKey];
                return removeSuccess(path);
            }
        },

        appendByPath: (path, value) => {
            return setByPath(path.concat([autoId()]), value);
        }
    };
};


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let uuidv4 = __webpack_require__(135);

let autoId = () => {
    let time = new Date().getTime(); // used to sort by time
    // generate id
    return `_gid_${time}_${uuidv4().replace(/-/g, '_')}`;
};

let isObject = v => v && typeof v === 'object';

const O_T_MODIFY = 'update';
const O_T_REMOVE = 'delete';
const T_SUCCESS = 'success';

const ERR_T_REMOVE_NONE_EXIST = 'remove_none_exist';

let modifySuccess = (path, value) => {
    return {
        operationType: O_T_MODIFY,
        resultType: T_SUCCESS,

        path,
        value: value && value.toString()
    };
};

let removeNoneExist = (path) => {
    return {
        operationType: O_T_REMOVE,
        resultType: ERR_T_REMOVE_NONE_EXIST,

        path
    };
};

let removeSuccess = (path) => {
    return {
        operationType: O_T_REMOVE,
        resultType: T_SUCCESS,

        path
    };
};

module.exports = {
    autoId,
    isObject,

    modifySuccess,
    removeNoneExist,
    removeSuccess
};


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(176);


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let parser = __webpack_require__(177);
let {
    checkAST,
    runTimeCheck,
    getVariable
} = __webpack_require__(201);

let {
    T_ATOM,
    T_PATH,
    T_ASSIGN,
    T_DELETE,
    T_APPEND,
    T_VARIABLE_NAME,
    T_FUNCTION,
    T_NODE_NAME,
    T_NODE_NAME_VARIABLE
} = __webpack_require__(132);

let executeAST = (ast, {
    queryByPath,
    setByPath,
    removeByPath,
    appendByPath,
    variableMap = {},
    variableStub = {},
    skipCheck = false
}) => {
    // TODO check params
    // check variableStub

    if (!skipCheck) {
        runTimeCheck(variableStub, variableMap);
    }

    let open = [];
    for (let i = 0; i < ast.length; i++) {
        open.unshift({
            node: ast[i],
            visited: false
        });
    }

    let valueStack = [];

    while (open.length) {
        let top = open[open.length - 1];
        let topNode = top.node;
        if (topNode.type === T_ATOM) {
            valueStack.push(topNode.value);
            open.pop();
        } else if (topNode.type === T_VARIABLE_NAME) { // pickup variable
            let variableName = topNode.value;
            let variableValue = getVariable(variableName, variableMap, variableStub);
            valueStack.push(variableValue);
            open.pop();
        } else if (topNode.type === T_PATH) {
            valueStack.push(queryByPath(resolvePath(topNode.value, variableMap)));
            open.pop();
        } else if (topNode.type === T_FUNCTION) {
            let {
                funName,
                params
            } = topNode.value;

            if (top.visited) {
                // get value from value stack
                let paramValues = [];
                for (let i = 0; i < params.length; i++) {
                    paramValues.push(valueStack.pop());
                }
                valueStack.push(variableMap[funName](...paramValues));
                open.pop();
            } else {
                top.visited = true;
                for (let i = 0; i < params.length; i++) {
                    open.push({
                        node: params[i],
                        visited: false
                    });
                }
            }
        } else if (topNode.type === T_ASSIGN) {
            let {
                path,
                value
            } = topNode.value;

            if (top.visited) {
                let assignValue = valueStack.pop();
                valueStack.push(setByPath(resolvePath(path.value, variableMap), assignValue));
                open.pop();
            } else {
                top.visited = true;
                open.push({
                    node: value,
                    visited: false
                });
            }
        } else if (topNode.type === T_DELETE) {
            let {
                path
            } = topNode.value;

            valueStack.push(removeByPath(resolvePath(path.value, variableMap)));
            open.pop();
        } else if (topNode.type === T_APPEND) {
            let {
                path,
                value
            } = topNode.value;

            if (top.visited) {
                let assignValue = valueStack.pop();
                valueStack.push(appendByPath(resolvePath(path.value, variableMap), assignValue));
                open.pop();
            } else {
                top.visited = true;
                open.push({
                    node: value,
                    visited: false
                });
            }
        }
    }

    return valueStack[valueStack.length - 1];
};

let resolvePath = (path, variableMap) => {
    let ret = [];
    for (let i = 0; i < path.length; i++) {
        let {
            type,
            value
        } = path[i];
        if (type === T_NODE_NAME) {
            ret.push(value);
        } else if (type === T_NODE_NAME_VARIABLE) {
            ret.push(variableMap[value]);
        }
    }

    return ret;
};

let parseStrToAst = (str) => {
    let handleChunk = parser();
    if (str) {
        handleChunk(str);
    }
    return handleChunk(null);
};

module.exports = {
    parser,
    parseStrToAst,
    executeAST,
    checkAST
};


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let streamTokenSpliter = __webpack_require__(138);
let {
    LR
} = __webpack_require__(187);
let {
    getProductionId,
    processTokens,
} = __webpack_require__(145);
let tokenTypes = __webpack_require__(198);
let {
    ACTION,
    GOTO
} = __webpack_require__(200);

let {
    P_PROGRAM,

    P_EXPRESSION_LIST_0,
    P_EXPRESSION_LIST_1,

    P_EXPRESSION_0,
    P_EXPRESSION_1,
    P_EXPRESSION_2,

    P_UPDATE_EXPRESSION_0,
    P_UPDATE_EXPRESSION_1,
    P_UPDATE_EXPRESSION_2,

    P_QUERY_EXPRESSION_0,
    P_QUERY_EXPRESSION_1,
    P_QUERY_EXPRESSION_2,
    P_QUERY_EXPRESSION_3,
    P_QUERY_EXPRESSION_4,

    P_QUERY_EXPRESSION_LIST_0,
    P_QUERY_EXPRESSION_LIST_1,

    P_PATH_0,
    P_PATH_1,
    P_PATH_2,
    P_PATH_3,

    P_ATOM_DATA_0,
    P_ATOM_DATA_1,
    P_ATOM_DATA_2,
    P_ATOM_DATA_3,
    P_ATOM_DATA_4,

    T_ATOM,
    T_PATH,
    T_ASSIGN,
    T_DELETE,
    T_APPEND,
    T_VARIABLE_NAME,
    T_FUNCTION,
    T_NODE_NAME,
    T_NODE_NAME_VARIABLE
} = __webpack_require__(132);

module.exports = () => {
    let tokenSpliter = streamTokenSpliter.parser(tokenTypes);

    // TODO optimization AST
    let lrParse = LR(ACTION, GOTO, {
        // when reduce prodcution, translate at the sametime
        reduceHandler: (production, midNode) => {
            switch (getProductionId(production)) {
                case P_PROGRAM:
                    midNode.value = midNode.children[0].value;
                    break;

                case P_EXPRESSION_LIST_0:
                    midNode.value = midNode.children[0].value === null ? [] : [midNode.children[0].value];
                    break;

                case P_EXPRESSION_LIST_1:
                    midNode.value = (midNode.children[0].value === null ? [] : [midNode.children[0].value]).concat(midNode.children[2].value);
                    break;

                case P_EXPRESSION_0:
                    midNode.value = midNode.children[0].value;
                    break;

                case P_EXPRESSION_1:
                    midNode.value = midNode.children[0].value;
                    break;

                case P_EXPRESSION_2: // empty situation
                    midNode.value = null;
                    break;

                case P_UPDATE_EXPRESSION_0:
                    midNode.value = {
                        type: T_ASSIGN,
                        value: {
                            path: midNode.children[0].value,
                            value: midNode.children[2].value
                        }
                    };
                    break;

                case P_UPDATE_EXPRESSION_1:
                    midNode.value = {
                        type: T_DELETE,
                        value: {
                            path: midNode.children[1].value,
                        }
                    };
                    break;

                case P_UPDATE_EXPRESSION_2:
                    midNode.value = {
                        type: T_APPEND,
                        value: {
                            path: midNode.children[1].value,
                            value: midNode.children[3].value
                        }
                    };
                    break;

                case P_QUERY_EXPRESSION_0:
                    midNode.value = midNode.children[0].value;
                    break;

                case P_QUERY_EXPRESSION_1:
                    midNode.value = {
                        type: T_VARIABLE_NAME,
                        value: midNode.children[0].token.text
                    };
                    break;

                case P_QUERY_EXPRESSION_2:
                    midNode.value = midNode.children[0].value;
                    break;

                case P_QUERY_EXPRESSION_3:
                    midNode.value = {
                        type: T_FUNCTION,
                        value: {
                            funName: midNode.children[0].token.text,
                            params: []
                        }
                    };
                    break;

                case P_QUERY_EXPRESSION_4:
                    midNode.value = {
                        type: 'function',
                        value: {
                            funName: midNode.children[0].token.text,
                            params: midNode.children[2].value
                        }
                    };
                    break;

                case P_QUERY_EXPRESSION_LIST_0:
                    midNode.value = [midNode.children[0].value];
                    break;

                case P_QUERY_EXPRESSION_LIST_1:
                    midNode.value = [midNode.children[0].value].concat(midNode.children[2].value);
                    break;

                case P_PATH_0:
                    midNode.value = {
                        type: T_PATH,
                        value: [{
                            type: T_NODE_NAME,
                            value: midNode.children[0].token.text.substring(1)
                        }]
                    };
                    break;

                case P_PATH_1:
                    midNode.value = {
                        type: T_PATH,
                        value: [{
                            type: T_NODE_NAME,
                            value: midNode.children[0].token.text.substring(1)
                        }].concat(midNode.children[1].value.value)
                    };
                    break;

                case P_PATH_2:
                    var nodeNameVarTxt = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_PATH,
                        value: [{
                            type: T_NODE_NAME_VARIABLE,
                            value: nodeNameVarTxt.substring(2, nodeNameVarTxt.length - 1).trim()
                        }]
                    };
                    break;

                case P_PATH_3:
                    var nodeNameVarTxt2 = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_PATH,
                        value: [{
                            type: T_NODE_NAME_VARIABLE,
                            value: nodeNameVarTxt2.substring(2, nodeNameVarTxt2.length - 1).trim()
                        }].concat(midNode.children[1].value.value)
                    };
                    break;

                case P_ATOM_DATA_0:
                    midNode.value = {
                        type: T_ATOM,
                        value: true
                    };
                    break;

                case P_ATOM_DATA_1:
                    midNode.value = {
                        type: T_ATOM,
                        value: false
                    };
                    break;

                case P_ATOM_DATA_2:
                    midNode.value = {
                        type: T_ATOM,
                        value: null
                    };
                    break;

                case P_ATOM_DATA_3:
                    var text = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_ATOM,
                        value: JSON.parse(text)
                    };
                    break;

                case P_ATOM_DATA_4:
                    var numText = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_ATOM,
                        value: Number(numText)
                    };
                    break;
            }
        }
    });

    // handle chunk data
    return (chunk) => {
        let str = chunk && chunk.toString();
        let tokens = processTokens(tokenSpliter(str));

        for (let i = 0; i < tokens.length; i++) {
            lrParse(tokens[i]);
        }

        // means finished chunks
        if (chunk === null) {
            let ast = lrParse(null);
            return ast.children[0].value;
        }
    };
};


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString, funType, listType, isFunction, mapType, isFalsy, isNumber, or
} = __webpack_require__(119);

let {
    WAIT, MATCH, QUIT
} = __webpack_require__(130);

let {
    stateGraphDSL
} = __webpack_require__(124);

let buildFSM = __webpack_require__(184);

let {
    map
} = __webpack_require__(120);

let {
    getMatch
} = __webpack_require__(185);

let {
    findToken,
    filterTypes
} = __webpack_require__(186);

let {
    assembleToken
} = __webpack_require__(142);

/**
 *
 * A token spliter used to split stream string.
 *
 * When accept a chunk, parsing it at the same time.
 *
 * ## options
 *
 * tokenTypes = [
 *  {
 *      name,
 *      priority,
 *      match
 *  }
 * ]
 *
 * - priority
 *
 *    When meets ambiguity, priority will be helpful.
 *
 *    Assume we got two types: \w*, \s. When split "today is a good day". If we set \s has a higher priority, we will get ["t", "o", "d", "a", "y", " ", "i", "s", " ", "a", " ", "g", "o", "o", "d", " ", "d", "a", "y"], just one token. If we set \w* has a higher priority, we will get ["today", " ", "is", " ", "a", " ", "good", " ", "day"].
 *
 * - match (letter, prefix) -> WAIT | MATCH | QUIT
 *
 *     Because we are handling chunks, we need to know finished a chunk or not.
 *
 * ## rules
 *
 * - priority rule
 *
 * - longest matching
 *
 * eg: four rules a(def, 1), b(default[s?], 2), c(/\w\w+/, 0), d(_, 2)
 *
 * ```
 * input     isPart     match
 * d         (a, b, c)  ()
 * de        (a, b, c)  (c:0)
 * def       (a, b, c)  (a:1, c:0)
 * defa      (b, c)     (c:0)
 * defau     (b, c)     (c:0)
 * defaul    (b, c)     (c:0)
 * default   (b, c)     (b:2, c:0)
 * defaults  (b, c)     (b:2, c:0)
 * defaults_ ()         ()
 * ```
 *
 * When empty situation happend, analysis the process.
 *
 * ```
 * 1. possible situations
 *    de        (a, b, c)  (c:0)
 *    def       (a, b, c)  (a:1, c:0)
 *    defa      (b, c)     (c:0)
 *    defau     (b, c)     (c:0)
 *    defaul    (b, c)     (c:0)
 *    default   (b, c)     (b:2, c:0)
 *    defaults  (b, c)     (b:2, c:0)
 *
 * 2. for any rule (a, b, c) only consider it's biggest matching situation. (longest matching rule)
 *    def       (a, b, c)  (a:1)            longest for a
 *    defaults  (b, c)     (b:2, c:0)       longest for b and c
 *
 * 3. choose the highest priority rule. (priority rule)
 *    defaults (b:2)
 * ```
 */

let parser = funType((tokenTypes) => {
    tokenTypes = map(tokenTypes, (tokenType) => {
        let {
            priority, name, independent, match
        } = tokenType;

        name = name || (match && match.toString());

        match = getMatch(match);

        if (!isFunction(match)) {
            throw new Error(`Error match in token type ${strTokenType(tokenType)}`);
        }

        return {
            priority: priority || 0,
            name: name,
            match,
            independent
        };
    });

    let stock = '';

    return (chunk) => {
        if (chunk === null) { // means finished
            let tokens = splitTokensToEnd(stock, tokenTypes);

            stock = '';
            return tokens;
        }
        stock += chunk.toString();
        let {
            rest, tokens
        } = splitTokens(stock, tokenTypes);

        stock = rest;

        return tokens;
    };
}, [
    listType(mapType({
        priority: or(isFalsy, isNumber),
        name: or(isFalsy, isString)
    }))
]);

let strTokenType = ({
    priority, match, name, independent
}) => {
    return `{
        priority: ${priority},
        match: ${match},
        name: ${name},
        independent: ${independent}
    }`;
};

parser.parse = (str, tokenTypes) => {
    let parse = parser(tokenTypes);
    return parse(str).concat(parse(null));
};

let splitTokensToEnd = (stock, tokenTypes) => {
    let {
        tokens
    } = splitTokens(stock, tokenTypes, 'end');
    return tokens;
};

let splitTokens = (stock, tokenTypes, type) => {
    let ret;
    let tokens = [];
    while (stock && (ret = getToken(stock, tokenTypes, type))) {
        let {
            token, rest
        } = ret;
        stock = rest;

        tokens.push(token);
    }

    return {
        tokens,
        rest: stock
    };
};

/**
 * type = 'mid' | 'end'
 *
 * get toke from stock based on tokenTypes
 */
let getToken = (stock, tokenTypes, type = 'mid') => {
    let next = stock;

    let prefix = ''; // used to store current prefix
    let retMatrix = [];

    let restTypes = tokenTypes;

    while (next) {
        let nextLetter = next[0];
        prefix += nextLetter;

        // shorten next
        next = next.substring(1);
        let [partTypes, matchTypes, independentType] = filterTypes(nextLetter, prefix, restTypes);

        restTypes = partTypes; // reduce types

        // see if there is a independent token type
        // find independent token

        if (independentType) {
            return splitTokenRet(
                assembleToken(independentType, prefix),
                stock
            );
        }

        // obey longest match rule
        // no matchs futher, means look forward more won't get any matchs
        if (!partTypes.length && !matchTypes.length) {
            return fetchToken(stock, retMatrix, prefix);
        } else {
            retMatrix.push({
                partTypes,
                matchTypes,
                prefix
            });
        }
    }

    // if this is end, fetchToken
    if (prefix === stock && type === 'end') { // match stop point
        return fetchToken(stock, retMatrix, prefix);
    }

    return null;
};

let fetchToken = (stock, retMatrix, prefix) => {
    // empty
    let token = findToken(retMatrix);
    if (!token) {
        throw new Error(`Can not find token from prefix "${prefix}". And prefix is not any part of token. stock is "${stock}".`);
    }
    return splitTokenRet(token, stock);
};

let splitTokenRet = (token, stock) => {
    return {
        token,
        rest: stock.substring(token.text.length)
    };
};

module.exports = {
    parser, WAIT, QUIT, MATCH, stateGraphDSL, buildFSM
};


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    QUIT, WAIT, MATCH
} = __webpack_require__(180);

let stateGraphDSL = __webpack_require__(181);

const START_STATE = '__start__state__';

let fsm = (stateMap) => {
    // parse stateMap
    let {
        transitions, acceptStateMap
    } = stateGraphDSL.transitionMaper(
        stateGraphDSL.g(START_STATE,
            stateGraphDSL.c(null, stateMap)));

    let dfa = new DFA(transitions, acceptStateMap);

    // matching function
    return (letter) => {
        return dfa.transit(letter);
    };
};

let DFA = function(stateMap, acceptStateMap) {
    this.currentState = START_STATE;
    this.stateMap = stateMap;
    this.acceptStateMap = acceptStateMap;
};

let proto = DFA.prototype;

proto.transit = function(letter) {
    let subMap = this.stateMap[this.currentState];
    if (!subMap) return {
        type: QUIT,
        state: this.currentState
    };

    // transit to target state
    let targetState = subMap(letter);

    if (stateGraphDSL.isEpsilonTransition(targetState)) {
        this.currentState = targetState.state; // epsilon transition
        return this.transit(letter);
    }

    if (targetState === undefined) {
        return {
            type: QUIT,
            state: this.currentState
        };
    }

    this.currentState = targetState;
    if (this.acceptStateMap[targetState]) return {
        type: MATCH,
        state: this.currentState
    };

    return {
        type: WAIT,
        state: this.currentState
    };
};

module.exports = {
    fsm,
    stateGraphDSL,
    DFA,
    QUIT,
    WAIT,
    MATCH
};


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    WAIT: 2,
    MATCH: 1,
    QUIT: 0
};


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let actionDSL = __webpack_require__(139);

let {
    isNormalAction, isRangeAction, isUnionAction, isLeftAction, isEpsilonAction
} = actionDSL;

let {
    graph,
    connect,

    repeat,
    sequence,

    circle,

    isEpsilonTransition
} = __webpack_require__(182);

let {
    mergeMap
} = __webpack_require__(140);

let transitionMaper = (graph) => {
    let transitions = {};
    let {
        transitionMap
    } = graph;

    let accepts = getEndStates(graph);

    let leftMap = getLeftActionMap(transitionMap);
    let epsilonMap = getEpsilonActionMap(transitionMap);

    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];

        transitions[stateName] = (letter) => {
            for (let i = transitList.length - 1; i >= 0; i--) {
                let {
                    state, action
                } = transitList[i];

                if (matchAction(action, letter)) return state;
            }

            // check rest
            if (leftMap[stateName]) return leftMap[stateName];

            if (epsilonMap[stateName]) {
                return {
                    type: 'deliver',
                    state: epsilonMap[stateName]
                };
            }
        };
    }

    return {
        transitions,
        acceptStateMap: getAcceptStateMap(epsilonMap, accepts)
    };
};

/**
 * a end state's out-degree = 0
 */
let getEndStates = (graph) => {
    let outDegreeMap = getOutDegreeMap(graph);
    let ends = [];
    for (let name in outDegreeMap) {
        if (outDegreeMap[name] === 0) {
            ends.push(name);
        }
    }

    return ends;
};

let getOutDegreeMap = (graph) => {
    let outDegreeMap = {};
    let {
        transitionMap
    } = graph;
    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];
        outDegreeMap[stateName] = transitList.length;
        for (let i = 0; i < transitList.length; i++) {
            let {
                state
            } = transitList[i];
            outDegreeMap[state] = outDegreeMap[state] || 0;
        }
    }

    return outDegreeMap;
};

/**
 * epsilon chain
 */
let getAcceptStateMap = (epsilonMap, accepts) => {
    let acceptStateMap = {};

    let reverseEpsilonMap = {};
    for (let name in epsilonMap) {
        let tar = epsilonMap[name];
        reverseEpsilonMap[tar] = reverseEpsilonMap[tar] || [];
        reverseEpsilonMap[tar].push(name);
    }

    for (let i = 0; i < accepts.length; i++) {
        let accept = accepts[i];
        acceptStateMap[accept] = true;
    }

    let count = 0;

    while (true) { // eslint-disable-line
        let prevCount = count;

        for (let name in acceptStateMap) {
            let list = reverseEpsilonMap[name];
            if (list) {
                for (let j = 0; j < list.length; j++) {
                    if (!acceptStateMap[list[j]]) {
                        acceptStateMap[list[j]] = true;
                        count++;
                    }
                }
            }
        }

        if (count === prevCount) { // no more
            break;
        }
    }

    return acceptStateMap;
};

let matchAction = (action, letter) => {
    if (isNormalAction(action) && action.content === letter) return true;
    if (isRangeAction(action) && action.start <= letter && letter <= action.end) return true;
    if (isUnionAction(action)) {
        let {
            actions
        } = action;

        for (let i = 0; i < actions.length; i++) {
            if (matchAction(actions[i], letter)) return true;
        }
    }

    return false;
};

let getEpsilonActionMap = (transitionMap) => {
    let map = {};

    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];
        let tarState = findActionState(transitList, isEpsilonAction);
        if (tarState) {
            map[stateName] = tarState;
        }
    }

    return map;
};

let getLeftActionMap = (transitionMap) => {
    let map = {};
    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];
        let tarState = findActionState(transitList, isLeftAction);
        if (tarState) {
            map[stateName] = tarState;
        }
    }
    return map;
};

let findActionState = (transitList, type) => {
    for (let i = transitList.length - 1; i >= 0; i--) {
        let {
            action, state
        } = transitList[i];
        if (containActionType(action, type)) {
            return state;
        }
    }
};

let containActionType = (action, type) => {
    if (isUnionAction(action)) {
        let {
            actions
        } = action;

        for (let i = 0; i < actions.length; i++) {
            if (containActionType(actions[i], type)) return true;
        }
    } else {
        return type(action);
    }

    return false;
};

module.exports = mergeMap(actionDSL, {
    graph,
    connect,

    transitionMaper,
    repeat,
    sequence,

    circle,

    isEpsilonTransition,

    g: graph, c: connect
});


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString, isObject
} = __webpack_require__(119);

let actionDSL = __webpack_require__(139);

let {
    toAction
} = actionDSL;

let {
    mergeMap
} = __webpack_require__(140);

/**
 * graph definition DSL
 *
 * state    action
 *
 * transition: (startState, action, nextState)
 *
 */

/**
 * graph(s1,
 *     connect(a1, graph(s2,
 *         connect(a3, s4),
 *         connect(a4, s5)
 *     )),
 *
 *     connect(a2, s3)
 *  )
 */

let count = 0;
let autoGraphState = () => {
    return `__auto_state_name_${count++}`;
};

/**
 * graph data = {
 *    transitions: [
 *      [action, nextGraph]
 *    ],
 *    state
 * }
 */
let graph = (...args) => {
    let state = null,
        lines = null;

    if (isString(args[0])) {
        state = args[0];
        lines = args.slice(1);
    } else {
        state = autoGraphState();
        lines = args;
    }

    let transitionMap = {};

    transitionMap[state] = [];

    for (let i = 0; i < lines.length; i++) {
        let {
            action, nextGraph
        } = lines[i];

        let nextState = isString(nextGraph) ? nextGraph : nextGraph.state;

        transitionMap[state].push({
            action,
            state: nextState
        });

        // merge transitionMap
        for (let name in nextGraph.transitionMap) {
            if (transitionMap[name]) {
                throw new Error(`repeated state name for different state, name is ${name}`);
            }
            transitionMap[name] = nextGraph.transitionMap[name];
        }
    }

    return {
        state,
        transitionMap
    };
};

let connect = (action, nextGraph) => {
    action = toAction(action);
    if(!nextGraph) nextGraph = autoGraphState();
    return {
        action,
        nextGraph
    };
};

/**
 * circle: repeat at least 0 times
 */
let circle = (action, nextGraph) => {
    let stateName = autoGraphState();

    return graph(stateName,
        connect(action, stateName),
        connect(null, nextGraph)
    );
};

let repeat = (action, times, nextGraph) => {
    let args = [];
    for (let i = 0; i < times; i++) {
        args.push(action);
    }
    args.push(nextGraph);

    return sequence(...args);
};

let sequence = (...args) => {
    let actions = args.slice(0, -1);
    let nextGraph = args[args.length - 1];
    let action = actions[0];
    if (actions.length <= 1) {
        return connect(action, nextGraph);
    }

    let nexts = actions.slice(1).concat([nextGraph]);

    return connect(action, graph(sequence(...nexts)));
};

let isEpsilonTransition = (v) => {
    return isObject(v) && v.type === 'deliver';
};

module.exports = mergeMap(actionDSL, {
    graph,
    connect,

    repeat,
    sequence,

    circle,

    isEpsilonTransition
});


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    iterate
} = __webpack_require__(141);

let {
    isFunction
} = __webpack_require__(119);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = isFunction(item) ? item : (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let reverse = (list) => reduce(list, (prev, cur) => {
    prev.unshift(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

let overArgs = (func, transform) => {
    return (...args) => {
        let newArgs = transform(...args);
        return func(...newArgs);
    };
};

module.exports = {
    overArgs,
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact,
    reverse
};


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const START_STATE = '__start__state__';

let {
    stateGraphDSL, DFA
} = __webpack_require__(124);

/**
 * build a fda to do the matching work
 *
 * transit: (currentState, letter) -> nextState
 */
module.exports = (stateMap, accepts) => {
    let m = null;

    // parse stateMap
    let {
        transitions, acceptStateMap
    } = stateGraphDSL.transitionMaper(
        stateGraphDSL.g(START_STATE,
            stateGraphDSL.c(null, stateMap)),
        accepts);

    return (prefix, letter) => {
        if (prefix.length === 1) {
            m = new DFA(transitions, acceptStateMap);
            return m.transit(letter).type;
        } else {
            return m.transit(letter).type;
        }
    };
};


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString, isFunction
} = __webpack_require__(119);

let {
    MATCH, WAIT, QUIT
} = __webpack_require__(130);

let stringMatch = (word) => (prefix) => {
    if (word === prefix) return MATCH;
    if (word.indexOf(prefix) !== -1) return WAIT;
    return QUIT;
};

let getMatch = (match) => {
    if (isFunction(match)) return match;
    if (isString(match)) return stringMatch(match);
    // TODO analysis regular expression
};

module.exports = {
    getMatch
};


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    WAIT, MATCH
} = __webpack_require__(130);

let {
    assembleToken
} = __webpack_require__(142);

let filterTypes = (nextLetter, prefix, tokenTypes) => {
    let parts = [],
        matchs = [],
        independentType = null;

    let len = tokenTypes.length;

    for (let i = 0; i < len; i++) {
        let tokenType = tokenTypes[i];
        let ret = tokenType.match(prefix, nextLetter);

        if (ret === WAIT) {
            parts.push(tokenType);
        } else if (ret === MATCH) { // matched
            matchs.push(tokenType);
            parts.push(tokenType);
            if (!independentType && tokenType.independent) {
                independentType = tokenType;
            }
        }
    }

    return [parts, matchs, independentType];
};

let findToken = (retMatrix) => {
    let prev = null;

    for (let i = 0; i < retMatrix.length; i++) {
        let {
            prefix, matchTypes
        } = retMatrix[i];

        for (let j = 0; j < matchTypes.length; j++) {
            let tokenType = matchTypes[j];
            if (!prev ||
                tokenType.priority > prev.tokenType.priority ||
                (tokenType.priority === prev.tokenType.priority && prefix.length > prev.text.length)
            ) {
                prev = assembleToken(tokenType, prefix);
            }
        }
    }

    return prev;
};

module.exports = {
    findToken,
    filterTypes
};


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @readme-quick-run
 *
 * build LR1 table
 *
 * ## test tar=js r_c=syntaxer
 *
 * let {buildLR1Table} = syntaxer;
 * let lr1Table = buildLR1Table({
 *     startSymbol: 'S',
 *     N: ['S'],
 *     T: ['a'],
 *     productions: [
 *         ['S', ['a']] // s -> a
 *     ]
 * });
 * console.log(JSON.stringify(lr1Table, null, 4));
 */

/**
 * @readme-quick-run
 *
 * generate ast from LR table
 *
 * ## test tar=js r_c=syntaxer
 *
 * let {buildLR1Table, LR} = syntaxer;
 * let {ACTION, GOTO} = buildLR1Table({
 *     startSymbol: 'S',
 *     N: ['S'],
 *     T: ['a'],
 *     productions: [
 *         ['S', ['a']] // s -> a
 *     ]
 * });
 * let lrParse = LR(ACTION, GOTO);
 * lrParse({ // accept a token
 *   name: 'a',
 *   text: 'abc'
 * });
 * let ast = lrParse(null); // null as end symbol
 * console.log(JSON.stringify(ast, null, 4));
 */
module.exports = __webpack_require__(188);


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * syntax analysis
 *
 * background knowledge
 *
 * 1. context free grammer
 *    terminal symbol
 *    non-terminal symbol
 *    begin symbol
 *    production
 *          left -> right
 * 2. shift-in reduce
 */

let LR = __webpack_require__(189);
let LR1Table = __webpack_require__(192);
let ctxFreeGrammer = __webpack_require__(197);
let {
    forEach
} = __webpack_require__(121);

/**
 * just used for testing
 */
let parse = (g, handlers) => {
    let {
        ACTION, GOTO
    } = LR1Table(ctxFreeGrammer(g));

    return (tokens) => {
        let parser = LR(ACTION, GOTO, handlers);
        forEach(tokens, parser);
        return parser(null);
    };
};

let buildLR1Table = (g) => {
    let grammer = ctxFreeGrammer(g);
    return LR1Table(grammer);
};

module.exports = {
    LR, LR1Table, parse, ctxFreeGrammer, buildLR1Table
};


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * LR ananlysis algorithm
 *
 * input: grammer G's analysis table and a string ω
 * output: if ω ϵ L(G), get the bottom-up analysis, otherwise error
 *
 * - init: (S₀, a₁a₂...an$)
 *
 * - assume current configuration is (S₀X₁S₁...Sm, aiai₊₁...an$)
 *
 *    (1) if action[Sm, ai] = shift S, S = GOTO[Sm, ai], then we got new configuration:
 *          (S₀X₁S₁..XmSm ai S, ai₊₁...an$)
 *    (2) if action[Sm, ai] = reduce by A → β, |β| = r,then:
 *          S = GOTO[Sm₋r, A];
 *          (S₀X₁S₁...Xm₋rSm₋rAS, aiai₊₁...an$)
 *    (3) if action[Sm, ai] = accept, success
 *    (4) if action[Sm, ai] = error, error
 */

let {
    END_SYMBOL, EXPAND_START_SYMBOL
} = __webpack_require__(143);

let {
    initAST,
    reduceAST,
    appendToken
} = __webpack_require__(190);

/**
 * configuration = [stack, tokens]
 *
 * stack = [S₀X₁S₁...XmSm], Xi ϵ T U N, Si stands for state
 *
 * @param action function (state, termalSymbol) -> shift | reduce | accept | error
 *      return of action function, is a object: {type, production, errorMsg}
 *      production = [head, body:[]]
 */
module.exports = (ACTION, GOTO, {
    reduceHandler,
    acceptHandler
} = {}) => {
    // initial configuration
    let configuration = initConfiguration();

    // initial ast
    let ast = initAST(EXPAND_START_SYMBOL);

    let action = (state, token) => {
        let act = ACTION[state][token.name];
        if (!act) {
            return {
                type: 'error',
                errorMsg: `unexpected symbol (token.name) ${token.name}, token (token.text) is ${token.text}. Try to find ACTION from state ${state}.`
            };
        } else {
            return act;
        }
    };

    let goTo = (state, token) => {
        let nextState = GOTO[state][token.name];
        if (nextState === undefined) {
            throw new Error(`fail to goto state from ${state} and symbol (token.name) is ${token.name}, token (token.text) is ${token.text}. Try to do GOTO from state ${state}, but next state not exists.`);
        }
        return nextState;
    };

    let analysis = () => {
        let topState = getTopState(configuration);
        let token = getNextInputToken(configuration);
        // look up action
        let ret = action(topState, token);

        switch (ret.type) {
            case 'shift':
                shift(configuration, ret.state, token);
                ast = appendToken(ast, token);
                break;
            case 'reduce':
                // reduce production
                ast = reduce(ast, ret.production, configuration, goTo, reduceHandler);
                break;
            case 'error':
                // error handle
                throw new Error(ret.errorMsg);
            case 'accept':
                // clear configration
                configuration[1] = [];
                acceptHandler && acceptHandler(ast); // accept handle
                break;
            default:
                throw new Error(`unexpected action type ${ret.type}, when try to recoginise from [${topState}, ${token.name}]. Token is ${token.text}`);
        }
    };

    /**
     * @param token Object
     *   accept token as stream
     *   token = {
     *        name,
     *        other...
     *   }
     *
     *   if toke is null, means end of input
     */
    return (token) => {
        if (token === null) {
            // check state of the configuration
            configuration[1].push({
                name: END_SYMBOL
            });
            while (configuration[1].length) {
                analysis();
            }

            return ast;
        } else {
            // add token to configuration
            configuration[1].push(token);
            while (configuration[1].length > 1) {
                analysis();
            }
        }
    };
};

let initConfiguration = () => {
    // initial configuration
    return [
        [0], // stack
        [] // input
    ];
};

// (S₀X₁S₁..XmSm, aiai₊₁...an$) -> (S₀X₁S₁..XmSm ai S, ai₊₁...an$)
// S = GOTO(Sm, ai);
let shift = (configuration, state, token) => {
    let stack = configuration[0];
    let tokens = configuration[1];
    stack.push(token, state);
    tokens.shift();
};

// (S₀X₁S₁..XmSm, aiai₊₁...an$) -> (S₀X₁S₁...Xm₋rSm₋rAS, aiai₊₁...an$)
// A → β, r = |β|
// S = GOTO(Sm₋r, A)
let reduce = (ast, [head, body], configuration, goTo, reduceHandler) => {
    let stack = configuration[0];
    let reducedTokens = [];
    for (let i = 0; i < body.length; i++) {
        stack.pop(); // pop state
        reducedTokens.push(stack.pop()); // pop token
    }
    let top = getTopState(configuration);
    stack.push(head);
    stack.push(goTo(top, {
        name: head,
        text: `[none terminal symbol] ${head}`
    }));

    let {newAst, midNode} = reduceAST(ast,
        ast.children.length - body.length, // start position
        ast.children.length - 1, // end position
        head);

    reduceHandler && reduceHandler([head, body], midNode, reducedTokens, ast);
    return newAst;
};

let getTopState = (configuration) => {
    let stack = configuration[0];
    return stack[stack.length - 1];
};

let getNextInputToken = (configuration) => {
    let tokens = configuration[1];
    return tokens[0];
};


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * reduce production to generate a AST
 *
 * s *rm=> αAω *rm=> αβω
 *
 * reduce from αβω to αAω by A → β
 *
 * current AST:
 *           S
 *        /  |  \
 *       /  / \  \
 *      α    β    ω
 *     / \  / \  / \
 *     ...  ...  ...
 *
 * reduce by A → β
 *
 * result AST:
 *           S
 *        /  |  \
 *       /   A   \
 *      /   / \   \
 *     α     β     ω
 *    / \   / \   / \
 *    ...   ...   ...
 *
 * AST data structure
 * node = {
 *      type: terminal | none-terminal,
 *      symbol,
 *      token,
 *      children: [node]
 * }
 *
 * reduce start point: a token list
 * reduce end point: S → r
 *
 * 1. init AST from a list of token
 *
 * 2. reduce production to expand AST
 */

let {
    map
} = __webpack_require__(121);

const TERMINAL_TYPE = 'terminal';
const NONE_TERMINAL_TYPE = 'none-terminal';

/**
 * @param startSymbol String
 * @param tokens Array
 *
 * @return ast Object
 *
 * tokens = [{
 *     name,
 *     text
 * }]
 */
let initAST = (startSymbol, tokens = []) => {
    return {
        type: NONE_TERMINAL_TYPE,
        symbol: startSymbol,
        children: map(tokens, tokenToLeaf)
    };
};

let tokenToLeaf = (token) => {
    return {
        type: TERMINAL_TYPE,
        symbol: token.name,
        token
    };
};

/**
 * s *rm=> αAω *rm=> αβω
 *
 * reduce from αβω to αAω by A → β
 *
 * @param ast
 * @param start
 * @param end
 * @param leftSymbol
 *
 * @return ast
 *
 * β = ast.children[start] ~ ast.children[end]
 *
 * 1. remove β from ast, replace with A
 * 2. make every elements of β as A's child
 */
let reduceAST = (ast, start = 0, end = 0, leftSymbol) => {
    // generate a new middle node, which will hang beta nodes
    let midNode = {
        type: NONE_TERMINAL_TYPE,
        symbol: leftSymbol
    };

    let beta = ast.children.splice(start, end - start + 1, midNode);
    midNode.children = beta;

    return {newAst: ast, midNode};
};

/**
 * @param ast
 * @param token
 */
let appendToken = (ast, token) => {
    ast.children.push(tokenToLeaf(token));
    return ast;
};

module.exports = {
    initAST,
    reduceAST,
    appendToken
};


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    iterate
} = __webpack_require__(144);

let {
    isFunction
} = __webpack_require__(119);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = isFunction(item) ? item : (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let reverse = (list) => reduce(list, (prev, cur) => {
    prev.unshift(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

let overArgs = (func, transform) => {
    return (...args) => {
        let newArgs = transform(...args);
        return func(...newArgs);
    };
};

module.exports = {
    overArgs,
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact,
    reverse
};


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let LR1CanonicalCollection = __webpack_require__(193);
let {
    forEach, findIndex
} = __webpack_require__(121);
let GO = __webpack_require__(194);
let {
    LR1Itemer
} = __webpack_require__(195);
let {
    sameClosure
} = __webpack_require__(131);

module.exports = (grammer) => {
    let {
        END_SYMBOL, isTerminalSymbol, N
    } = grammer;

    let ACTION = [], // action table
        GOTO = []; // goto table

    let LR1Grammer = LR1Itemer(grammer);
    let go = GO(grammer, LR1Grammer);

    let C = LR1CanonicalCollection(grammer, LR1Grammer, go);

    forEach(C, (I, index) => {
        ACTION[index] = ACTION[index] || {};

        // item = [head, body, dotPosition, forwards]

        forEach(I.items, (item) => {
            // [S`→ S., $] ϵ Ii
            if (LR1Grammer.isAcceptItem(item)) {
                //
                ACTION[index][END_SYMBOL] = {
                    type: 'accept'
                };
            } else if (item.isReduceItem()) { // [A → α., a] ϵ Ii, A≠S`
                forEach(item.getForwards(), (a) => {
                    ACTION[index][a] = {
                        type: 'reduce',
                        production: item.getProduction()
                    };
                });
            } else if (isTerminalSymbol(item.getNextSymbol())) {
                let Ij = go(I, item.getNextSymbol());

                if (Ij && Ij.items.length) {
                    ACTION[index][item.getNextSymbol()] = {
                        type: 'shift',
                        state: getStateIndex(C, Ij)
                    };
                }
            }
        });
    });

    forEach(C, (I, index) => {
        GOTO[index] = GOTO[index] || {};
        forEach(N, (A) => {
            let Ij = go(I, A);
            if (Ij && Ij.items.length) {
                GOTO[index][A] = getStateIndex(C, Ij);
            }
        });
    });

    return {
        GOTO,
        ACTION
    };
};

let getStateIndex = (C, I) => findIndex(C, I, {
    eq: sameClosure
});


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    buildClosure
} = __webpack_require__(131);
let {
    reduce
} = __webpack_require__(121);

/**
 * input: grammer G
 *
 * output: LR(0) canonical collection
 *
 * item = [head, body, dotPosition];
 *
 * item set = [viable prefix, items]
 */
module.exports = (grammer, LR1Grammer, go) => {
    let {
        symbols
    } = grammer;

    let initClosure = buildClosure([
        LR1Grammer.initItem(grammer)
    ], grammer, LR1Grammer);

    let C = [initClosure];
    let canonicalCollectionMap = {};
    canonicalCollectionMap[initClosure.serializedText] = true;

    let appendedC = C;

    while (true) { // eslint-disable-line
        let newAppendedC = [];

        for (let i = 0; i < appendedC.length; i++) {
            let I = appendedC[i];
            let gotoSet = getGoToSymbolsSet(symbols, I, go);

            for (let j = 0; j < gotoSet.length; j++) {
                let state = gotoSet[j];
                let serializedText = state.serializedText;

                if (!canonicalCollectionMap[serializedText]) {
                    // add new state
                    newAppendedC.push(state);
                    canonicalCollectionMap[serializedText] = true;
                }
            }
        }

        if (!newAppendedC.length) break;

        appendedC = newAppendedC;
        C = C.concat(appendedC);
    }

    return C;
};

let getGoToSymbolsSet = (symbols, I, go) => {
    // for every symbol
    let set = reduce(symbols, (pre, X) => {
        let newState = go(I, X);

        if (newState && newState.items.length) {
            pre.push(newState);
        }
        return pre;
    }, []);

    return set;
};


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    reduce, filter
} = __webpack_require__(121);

let {
    buildClosure
} = __webpack_require__(131);

/**
 * jump
 *
 * A→αX.β => A→α.Xβ
 *
 * J = go(I, X) = closure({A→αX.β | A→α.Xβ ϵ I})
 *
 * if one viable prefix of A→αX.β  of I is ρ=δα, then A→α.Xβ in J has viable prefix δαX.
 *
 * @param I
 *    [head, body, dotPosition]
 *
 * @param X
 *    symbol
 *
 * @param productions
 */
module.exports = (grammer, LR1Grammer) => {
    let getStartItems = (I, X) => {
        let nextSymbolX = filter(I.items, (item) => {
            return item.getNextSymbol() === X;
        });

        let startItems = reduce(nextSymbolX, (prev, item) => { // eslint-disable-line
            if (item.restIsNotEmpty()) {
                prev.push(item.nextPositionItem());
            }

            return prev;
        }, []);

        return startItems;
    };

    return (I, X) => {
        let targetClosure = null;

        I.cache_GOTO = I.cache_GOTO || {};

        if (I.cache_GOTO[X]) {
            targetClosure = I.cache_GOTO[X];
        } else {
            let startItems = getStartItems(I, X);

            targetClosure = buildClosure(
                startItems,

                grammer,

                LR1Grammer
            );

            I.cache_GOTO[X] = targetClosure;
        }

        return targetClosure;
    };
};


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let First = __webpack_require__(196);

let {
    union, reduce, filter, flat, map
} = __webpack_require__(121);

let LR1Itemer = (grammer) => {
    let {
        END_SYMBOL,
        isNoneTerminalSymbol,
        getProductionsOf
    } = grammer;

    let first = First(grammer);

    let buildLR1Item = (production, dotPosition, forwards) => {
        let {
            getHead, getBody, isTerminalSymbol, isEndSymbol
        } = grammer;

        // [A → α.Bβ, a]
        let getNextSymbol = () => {
            return getBody(production)[dotPosition];
        };

        let getForwards = () => forwards;

        let afterNextRest = () => getBody(production).slice(dotPosition + 1);

        let list = () => [getHead(production), getBody(production), dotPosition, forwards];

        // change the forwards
        let concatForwards = (newForwards) => {
            return buildLR1Item(production, dotPosition, union(forwards, newForwards));
        };

        let adjoints = null;

        // [A → α.Bβ, a], FIRST(βa)
        let getAdjoints = () => {
            if (adjoints === null) {
                let beta = afterNextRest();
                let forwards = getForwards();

                let ret = reduce(forwards, (prev, letter) => {
                    let firstSet = beta.length ? first(beta.concat([letter])) : [letter];
                    return prev.concat(filter(firstSet, (item) => isTerminalSymbol(item) || isEndSymbol(item)));
                }, []);

                adjoints = ret;

                return ret;
            } else {
                return adjoints;
            }
        };

        // rest = ε && a = $
        let isReducedItem = () => {
            return !afterNextRest().length && getForwards().length === 1 && isEndSymbol(getForwards()[0]);
        };

        let restIsNotEmpty = () => getBody(production).length && dotPosition < getBody(production).length;

        let nextPositionItem = () => {
            return buildLR1Item(production, dotPosition + 1, forwards, grammer);
        };

        let getGrammer = () => grammer;

        // [A → α., a] ϵ Ii, A≠S`
        let isReduceItem = () => {
            return dotPosition === getBody(production).length;
        };

        let getProduction = () => production;

        let serializeId = null;

        let serialize = () => {
            if (serializeId === null) {
                serializeId = JSON.stringify([production, dotPosition, forwards.sort()]);
            }
            return serializeId;
        };

        let serializePrefixId = null;
        let serializePrefix = () => {
            if (serializePrefixId === null) {
                serializePrefixId = JSON.stringify([production, dotPosition]);
            }

            return serializePrefixId;
        };

        return {
            getNextSymbol,
            getProduction,
            getForwards,
            afterNextRest,
            list,
            concatForwards,
            getAdjoints,
            isReducedItem,
            restIsNotEmpty,
            nextPositionItem,
            getGrammer,
            isReduceItem,
            serialize,
            serializePrefix
        };
    };

    // S` -> S.
    var acceptItem = () => {
        return buildLR1Item([grammer.EXPAND_START_SYMBOL, [grammer.startSymbol]], 1, [grammer.END_SYMBOL]);
    };

    let isAcceptItem = (item) => {
        return sameItem(acceptItem(item.getGrammer()), item);
    };

    var sameItem = (item1, item2) => {
        return item1.serialize() === item2.serialize();
    };

    let initItem = () => {
        let item = buildLR1Item(
            [grammer.EXPAND_START_SYMBOL, [grammer.startSymbol]],
            0, [grammer.END_SYMBOL]
        );

        return item;
    };

    let fromList = ([head, body, dotPosition, forwards]) => {
        return buildLR1Item([head, body], dotPosition, forwards);
    };

    /**
     * [B → .γ, b]
     */
    let supItem = (production, symbol) => {
        return buildLR1Item(production, 0, [symbol]);
    };

    let expandCacheMap = {};
    let expandItem = (item) => {
        let serializeId = item.serialize();

        if (expandCacheMap[serializeId]) {
            return expandCacheMap[serializeId].slice(0);
        }

        let {
            getNextSymbol,
            getAdjoints,
            isReducedItem
        } = item;
        let next = getNextSymbol();

        if (!next || !isNoneTerminalSymbol(next)) return [];

        let nextProductions = getProductionsOf(next);

        let newItems = flat(map(nextProductions, (production) => isReducedItem() ? [
            supItem(production, END_SYMBOL)
        ] : map(getAdjoints(), (b) => supItem(production, b))));

        expandCacheMap[serializeId] = newItems;

        return newItems;
    };

    return {
        expandItem,
        buildLR1Item,
        isAcceptItem,
        sameItem,
        initItem,
        fromList,
        supItem
    };
};

module.exports = {
    LR1Itemer
};


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    contain, union, reduce, difference, forEach
} = __webpack_require__(121);

let {
    isArray
} = __webpack_require__(119);

module.exports = (grammer) => {
    // cache first set
    let firstMap = {};

    /**
     * first set of sentential form
     *
     * α ϵ (T U N)*
     *
     * FIRST(α) = { a | α *=> a..., a ϵ T }
     *
     * if α *=> ε, then ε ϵ FIRST(α)
     *
     * A → ε => ['A', []]
     *
     * using null stand for ε
     */

    let first = (X) => {
        if (firstMap[X]) return firstMap[X];
        let ret = firstSet(X);
        firstMap[X] = ret;
        return ret;
    };

    let firstSet = (X) => {
        let {
            isTerminalSymbol,
            getProductionsOf,
            isEmptyProduction,
            getBody,
            EPSILON
        } = grammer;

        if (isTerminalSymbol(X)) {
            return [X];
        } else {
            // find all productions start with X
            let ps = getProductionsOf(X);

            return reduce(ps, (prev, production) => {
                let body = getBody(production);

                if (isEmptyProduction(production)) {
                    return union(prev, [EPSILON]); // union ε
                } else {
                    if (isTerminalSymbol(body[0])) {
                        return union(prev, [body[0]]);
                    } else {
                        return union(prev, firstList(body, grammer));
                    }
                }
            }, []);
        }
    };

    let firstListMap = {};
    /**
     * [...ab...]
     */
    let firstList = (body) => {
        let {
            EPSILON, getBodyId
        } = grammer;

        let bodyId = getBodyId(body);
        if (firstListMap[bodyId]) {
            return firstListMap[bodyId];
        }

        let ret = [];
        forEach(body, (y, index) => {
            let set = first(y);

            ret = union(ret, difference(set, [EPSILON]));
            if (!contain(set, EPSILON)) { // stop
                return true;
            }

            if (index === body.length - 1) {
                ret = union(ret, [EPSILON]);
            }
        });

        firstListMap[bodyId] = ret;
        return ret;
    };

    return (alpha) => {
        if (isArray(alpha)) {
            return firstList(alpha);
        } else {
            return first(alpha);
        }
    };
};


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * context free grammer
 *    terminal symbol
 *    non-terminal symbol
 *    begin symbol
 *    production
 *    left -> right
 *
 * production = [head, body]
 *
 * TODO validate
 */

const {
    END_SYMBOL, EXPAND_START_SYMBOL, EPSILON
} = __webpack_require__(143);

/**
 * context free grammer is read-only
 */

module.exports = ({
    startSymbol,
    T, N,
    productions
}) => {
    let symbols = T.concat(N);

    // cache
    let noneTerminalProductionMap = getNoneTerminalProductionMap(productions);
    let terminalMap = listToExistMap(T);
    let noneTerminalMap = listToExistMap(N);

    let isTerminalSymbol = (symbol) => !!terminalMap[symbol];
    let isNoneTerminalSymbol = (symbol) => !!noneTerminalMap[symbol];

    /**
     * get all the productions startSymbol with none terminal symbol
     */
    let getProductionsOf = (noneTerminal) => noneTerminalProductionMap[noneTerminal];

    // A -> ε
    let isEmptyProduction = (production) => { // eslint-disable-body
        return !getBody(production).length;
    };

    let getBody = (production) => production[1];

    let getHead = (production) => production[0];

    let isEndSymbol = (v) => v === END_SYMBOL;

    let getBodyId = (body) => JSON.stringify(body);

    return {
        isTerminalSymbol,
        isNoneTerminalSymbol,
        getProductionsOf,
        isEmptyProduction,
        getBody,
        getBodyId,
        getHead,
        EPSILON,
        END_SYMBOL,
        EXPAND_START_SYMBOL,
        startSymbol,
        productions,
        isEndSymbol,
        symbols,
        N
    };
};

let listToExistMap = (arr) => {
    let map = {};
    let tLen = arr.length;
    for (let i = 0; i < tLen; i++) {
        map[arr[i]] = true;
    }
    return map;
};

/**
 * get the production map, key is none terminal symbol, keys is the set of producitons
 */
let getNoneTerminalProductionMap = (producitons) => {
    let productionMap = {};

    let productionLen = producitons.length;
    for (let i = 0; i < productionLen; i++) {
        let production = producitons[i];
        let head = production[0];
        productionMap[head] = productionMap[head] || [];
        productionMap[head].push(production);
    }

    return productionMap;
};


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    stringGraph,
    numberGraph
} = __webpack_require__(199);

let {
    buildFSM
} = __webpack_require__(138);

let FSM = __webpack_require__(124);
let {
    stateGraphDSL
} = FSM;

let {
    g,
    c,
    union,
    sequence,
    range,
    circle
} = stateGraphDSL;

let whitespace = union(' ', '\f', '\n', '\r', '\t', '\v', '\u00a0', '\u1680', '\u180e', '\u2000-', '\u200a', '\u2028', '\u2029', '\u202f', '\u205f', '\u3000', '\ufeff');

// .abcbf
// .0
// ._
let nodeName = g(sequence(
    '.',
    union('_', '%', range('a', 'z'), range('A', 'Z'), range('0', '9')),
    circle(union('_', '%', range('a', 'z'), range('A', 'Z'), range('0', '9')))
));

let variableName = g(sequence(
    union('_', range('a', 'z'), range('A', 'Z')),
    circle(union('_', range('a', 'z'), range('A', 'Z'), range('0', '9')))
));

let nodeNameVariable = g(sequence(
    '.',
    '[',

    circle(whitespace, g(sequence(
        union('_', range('a', 'z'), range('A', 'Z')),

        circle(union('_', range('a', 'z'), range('A', 'Z'), range('0', '9')),
            circle(whitespace,
                g(c(']'))
            ),
        ))))
));

module.exports = [

    {
        priority: 1,
        match: 'true',
        name: 'true'
    }, {
        priority: 1,
        match: 'false',
        name: 'false'
    }, {
        priority: 1,
        match: 'null',
        name: 'null'
    }, {
        priority: 1,
        match: buildFSM(stringGraph),
        name: 'string'
    }, {
        priority: 1,
        match: buildFSM(numberGraph),
        name: 'number'
    },

    {
        priority: 1,
        match: buildFSM(nodeName),
        name: 'nodeName'
    },
    {
        priority: 1,
        match: buildFSM(nodeNameVariable),
        name: 'nodeNameVariable'
    },
    {
        priority: 1,
        match: buildFSM(variableName),
        name: 'variableName'
    },
    {
        priority: 1,
        match: '=',
        name: 'assign'
    },
    {
        priority: 1,
        match: '-',
        name: 'delete'
    },
    {
        priority: 1,
        match: '+',
        name: 'append'
    },
    {
        priority: 1,
        match: ';',
        name: 'semicolon'
    },
    {
        priority: 1,
        match: '(',
        name: 'leftBracket'
    },
    {
        priority: 1,
        match: ')',
        name: 'rightBracket'
    },
    {
        priority: 1,
        match: ',',
        name: 'comma'
    },
    {
        priority: 1,
        match: buildFSM(g(
            c(whitespace)
        )),
        name: 'whitespace'
    }
];


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    stateGraphDSL
} = __webpack_require__(124);

let {
    g, c, union, range, sequence, circle, left, repeat
} = stateGraphDSL;

let numberGraph = g(c(union(null, '-'),
    g(
        c('0', g('decimal',
            c('.', circle(range('0', '9'), 'science')),
            c(null, g('science',
                c(null, 'accept'),
                sequence(
                    union('e', 'E'),
                    union('+', '-', null),
                    range('0', '9'),
                    circle(range('0', '9'), 'accept')
                )
            ))
        )),

        sequence(
            range('1', '9'),
            circle(range('0', '9'), 'decimal')
        )
    )
));

let hexDigit = union(range('0', '9'), range('A', 'F'), range('a', 'f'));

let escapeSymbols = union('"', '\\', '\/', 'b', 'f', 'n', 'r', 't');

let stringGraph = g(
    c('"', g('enter',
        c('\\', g(
            c(escapeSymbols, 'enter'),
            c('u',
                g(repeat(hexDigit, 4, 'enter'))
            ))),
        c('"', 'accept'),
        c(left(), 'enter')
    )));

module.exports = {
    numberGraph,
    stringGraph
};


/***/ }),
/* 200 */
/***/ (function(module, exports) {

module.exports={"GOTO":[{"PROGRAM":11,"EXPRESSION_LIST":12,"EXPRESSION":13,"UPDATE_EXPRESSION":14,"QUERY_EXPRESSION":15,"PATH":16,"ATOM_DATA":17},{"PATH":20},{"PATH":23},{},{"PATH":25},{"PATH":26},{},{},{},{},{},{},{},{},{},{},{},{},{"PATH":29},{"PATH":30},{},{"PATH":31},{"PATH":32},{},{"QUERY_EXPRESSION":43,"QUERY_EXPRESSION_LIST":44,"PATH":45,"ATOM_DATA":46},{},{},{"EXPRESSION_LIST":47,"EXPRESSION":13,"UPDATE_EXPRESSION":14,"QUERY_EXPRESSION":15,"PATH":16,"ATOM_DATA":17},{"QUERY_EXPRESSION":48,"PATH":49,"ATOM_DATA":17},{},{},{},{},{"QUERY_EXPRESSION":50,"PATH":49,"ATOM_DATA":17},{},{},{"PATH":52},{"PATH":53},{},{},{},{},{},{},{},{},{},{},{},{},{},{"QUERY_EXPRESSION":43,"QUERY_EXPRESSION_LIST":57,"PATH":45,"ATOM_DATA":46},{},{},{"QUERY_EXPRESSION":43,"QUERY_EXPRESSION_LIST":58,"PATH":45,"ATOM_DATA":46},{},{},{},{},{}],"ACTION":[{"$":{"type":"reduce","production":["EXPRESSION",[]]},"semicolon":{"type":"reduce","production":["EXPRESSION",[]]},"variableName":{"type":"shift","state":3},"delete":{"type":"shift","state":1},"append":{"type":"shift","state":2},"true":{"type":"shift","state":6},"false":{"type":"shift","state":7},"null":{"type":"shift","state":8},"string":{"type":"shift","state":9},"number":{"type":"shift","state":10},"nodeName":{"type":"shift","state":4},"nodeNameVariable":{"type":"shift","state":5}},{"nodeName":{"type":"shift","state":18},"nodeNameVariable":{"type":"shift","state":19}},{"nodeName":{"type":"shift","state":21},"nodeNameVariable":{"type":"shift","state":22}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName"]]},"leftBracket":{"type":"shift","state":24}},{"$":{"type":"reduce","production":["PATH",["nodeName"]]},"assign":{"type":"reduce","production":["PATH",["nodeName"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeName"]]},"nodeName":{"type":"shift","state":4},"nodeNameVariable":{"type":"shift","state":5}},{"$":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"assign":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"nodeName":{"type":"shift","state":4},"nodeNameVariable":{"type":"shift","state":5}},{"$":{"type":"reduce","production":["ATOM_DATA",["true"]]},"semicolon":{"type":"reduce","production":["ATOM_DATA",["true"]]}},{"$":{"type":"reduce","production":["ATOM_DATA",["false"]]},"semicolon":{"type":"reduce","production":["ATOM_DATA",["false"]]}},{"$":{"type":"reduce","production":["ATOM_DATA",["null"]]},"semicolon":{"type":"reduce","production":["ATOM_DATA",["null"]]}},{"$":{"type":"reduce","production":["ATOM_DATA",["string"]]},"semicolon":{"type":"reduce","production":["ATOM_DATA",["string"]]}},{"$":{"type":"reduce","production":["ATOM_DATA",["number"]]},"semicolon":{"type":"reduce","production":["ATOM_DATA",["number"]]}},{"$":{"type":"accept"}},{"$":{"type":"reduce","production":["PROGRAM",["EXPRESSION_LIST"]]}},{"$":{"type":"reduce","production":["EXPRESSION_LIST",["EXPRESSION"]]},"semicolon":{"type":"shift","state":27}},{"$":{"type":"reduce","production":["EXPRESSION",["UPDATE_EXPRESSION"]]},"semicolon":{"type":"reduce","production":["EXPRESSION",["UPDATE_EXPRESSION"]]}},{"$":{"type":"reduce","production":["EXPRESSION",["QUERY_EXPRESSION"]]},"semicolon":{"type":"reduce","production":["EXPRESSION",["QUERY_EXPRESSION"]]}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]},"assign":{"type":"shift","state":28}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["ATOM_DATA"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["ATOM_DATA"]]}},{"$":{"type":"reduce","production":["PATH",["nodeName"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeName"]]},"nodeName":{"type":"shift","state":18},"nodeNameVariable":{"type":"shift","state":19}},{"$":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"nodeName":{"type":"shift","state":18},"nodeNameVariable":{"type":"shift","state":19}},{"$":{"type":"reduce","production":["UPDATE_EXPRESSION",["delete","PATH"]]},"semicolon":{"type":"reduce","production":["UPDATE_EXPRESSION",["delete","PATH"]]}},{"assign":{"type":"reduce","production":["PATH",["nodeName"]]},"nodeName":{"type":"shift","state":21},"nodeNameVariable":{"type":"shift","state":22}},{"assign":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"nodeName":{"type":"shift","state":21},"nodeNameVariable":{"type":"shift","state":22}},{"assign":{"type":"shift","state":33}},{"rightBracket":{"type":"shift","state":35},"variableName":{"type":"shift","state":34},"true":{"type":"shift","state":38},"false":{"type":"shift","state":39},"null":{"type":"shift","state":40},"string":{"type":"shift","state":41},"number":{"type":"shift","state":42},"nodeName":{"type":"shift","state":36},"nodeNameVariable":{"type":"shift","state":37}},{"$":{"type":"reduce","production":["PATH",["nodeName","PATH"]]},"assign":{"type":"reduce","production":["PATH",["nodeName","PATH"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeName","PATH"]]}},{"$":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]},"assign":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]}},{"$":{"type":"reduce","production":["EXPRESSION",[]]},"semicolon":{"type":"reduce","production":["EXPRESSION",[]]},"variableName":{"type":"shift","state":3},"delete":{"type":"shift","state":1},"append":{"type":"shift","state":2},"true":{"type":"shift","state":6},"false":{"type":"shift","state":7},"null":{"type":"shift","state":8},"string":{"type":"shift","state":9},"number":{"type":"shift","state":10},"nodeName":{"type":"shift","state":4},"nodeNameVariable":{"type":"shift","state":5}},{"variableName":{"type":"shift","state":3},"true":{"type":"shift","state":6},"false":{"type":"shift","state":7},"null":{"type":"shift","state":8},"string":{"type":"shift","state":9},"number":{"type":"shift","state":10},"nodeName":{"type":"shift","state":18},"nodeNameVariable":{"type":"shift","state":19}},{"$":{"type":"reduce","production":["PATH",["nodeName","PATH"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeName","PATH"]]}},{"$":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]}},{"assign":{"type":"reduce","production":["PATH",["nodeName","PATH"]]}},{"assign":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]}},{"variableName":{"type":"shift","state":3},"true":{"type":"shift","state":6},"false":{"type":"shift","state":7},"null":{"type":"shift","state":8},"string":{"type":"shift","state":9},"number":{"type":"shift","state":10},"nodeName":{"type":"shift","state":18},"nodeNameVariable":{"type":"shift","state":19}},{"comma":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName"]]},"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName"]]},"leftBracket":{"type":"shift","state":51}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","rightBracket"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","rightBracket"]]}},{"comma":{"type":"reduce","production":["PATH",["nodeName"]]},"rightBracket":{"type":"reduce","production":["PATH",["nodeName"]]},"nodeName":{"type":"shift","state":36},"nodeNameVariable":{"type":"shift","state":37}},{"comma":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"rightBracket":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"nodeName":{"type":"shift","state":36},"nodeNameVariable":{"type":"shift","state":37}},{"comma":{"type":"reduce","production":["ATOM_DATA",["true"]]},"rightBracket":{"type":"reduce","production":["ATOM_DATA",["true"]]}},{"comma":{"type":"reduce","production":["ATOM_DATA",["false"]]},"rightBracket":{"type":"reduce","production":["ATOM_DATA",["false"]]}},{"comma":{"type":"reduce","production":["ATOM_DATA",["null"]]},"rightBracket":{"type":"reduce","production":["ATOM_DATA",["null"]]}},{"comma":{"type":"reduce","production":["ATOM_DATA",["string"]]},"rightBracket":{"type":"reduce","production":["ATOM_DATA",["string"]]}},{"comma":{"type":"reduce","production":["ATOM_DATA",["number"]]},"rightBracket":{"type":"reduce","production":["ATOM_DATA",["number"]]}},{"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION_LIST",["QUERY_EXPRESSION"]]},"comma":{"type":"shift","state":54}},{"rightBracket":{"type":"shift","state":55}},{"comma":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]},"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]}},{"comma":{"type":"reduce","production":["QUERY_EXPRESSION",["ATOM_DATA"]]},"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION",["ATOM_DATA"]]}},{"$":{"type":"reduce","production":["EXPRESSION_LIST",["EXPRESSION","semicolon","EXPRESSION_LIST"]]}},{"$":{"type":"reduce","production":["UPDATE_EXPRESSION",["PATH","assign","QUERY_EXPRESSION"]]},"semicolon":{"type":"reduce","production":["UPDATE_EXPRESSION",["PATH","assign","QUERY_EXPRESSION"]]}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]}},{"$":{"type":"reduce","production":["UPDATE_EXPRESSION",["append","PATH","assign","QUERY_EXPRESSION"]]},"semicolon":{"type":"reduce","production":["UPDATE_EXPRESSION",["append","PATH","assign","QUERY_EXPRESSION"]]}},{"rightBracket":{"type":"shift","state":56},"variableName":{"type":"shift","state":34},"true":{"type":"shift","state":38},"false":{"type":"shift","state":39},"null":{"type":"shift","state":40},"string":{"type":"shift","state":41},"number":{"type":"shift","state":42},"nodeName":{"type":"shift","state":36},"nodeNameVariable":{"type":"shift","state":37}},{"comma":{"type":"reduce","production":["PATH",["nodeName","PATH"]]},"rightBracket":{"type":"reduce","production":["PATH",["nodeName","PATH"]]}},{"comma":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]},"rightBracket":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]}},{"variableName":{"type":"shift","state":34},"true":{"type":"shift","state":38},"false":{"type":"shift","state":39},"null":{"type":"shift","state":40},"string":{"type":"shift","state":41},"number":{"type":"shift","state":42},"nodeName":{"type":"shift","state":36},"nodeNameVariable":{"type":"shift","state":37}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","QUERY_EXPRESSION_LIST","rightBracket"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","QUERY_EXPRESSION_LIST","rightBracket"]]}},{"comma":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","rightBracket"]]},"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","rightBracket"]]}},{"rightBracket":{"type":"shift","state":59}},{"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION_LIST",["QUERY_EXPRESSION","comma","QUERY_EXPRESSION_LIST"]]}},{"comma":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","QUERY_EXPRESSION_LIST","rightBracket"]]},"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","QUERY_EXPRESSION_LIST","rightBracket"]]}}]}

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



// TODO reuse pfc-compiler

let {
    isObject,
    isFunction,
    isString
} = __webpack_require__(145);

let {
    T_ASSIGN,
    T_DELETE,
    T_VARIABLE_NAME,
    T_FUNCTION,
    T_PATH,
    T_NODE_NAME_VARIABLE,

    A_DEFAULT
} = __webpack_require__(132);

/**
 *
 * variableStub = {
 *    [variableName]: {
 *       type,
 *       default,  // default value of variable
 *       validate // function used to check dynamic
 *    }
 * }
 *
 *
 * TODO restraints checking
 */

// static check
let checkAST = (ast, {
    variableStub = {}
} = {}) => {
    let open = ast.slice(0);

    while (open.length) {
        let top = open.pop();
        let midType = top.type;

        if (midType === T_VARIABLE_NAME) {
            let varName = top.value;
            // must exist
            if (!variableStub.hasOwnProperty(varName)) {
                throw new Error(`missing variable ${varName} in [${Object.keys(variableStub).join(', ')}]`);
            }
        } else if (midType === T_FUNCTION) { // function
            let {
                funName,
                params
            } = top.value;
            let stub = variableStub[funName];
            if (!isObject(stub) || stub.type !== T_FUNCTION) {
                throw new Error(`missing function ${funName}, please check your variable map. Current variable map has keys [${Object.keys(variableStub).join(', ')}].`);
            }
            // push params
            let paramLen = params.length;
            for (let i = 0; i < paramLen; i++) {
                open.push(params[i]);
            }
        } else if (midType === T_ASSIGN) {
            open.push(top.value.path);
            open.push(top.value.value);
        } else if (midType === T_DELETE) {
            open.push(top.value.path);
        } else if (midType === T_PATH) {
            let path = top.value;
            for (let i = 0; i < path.length; i++) {
                let {
                    type,
                    value
                } = path[i];
                if (type === T_NODE_NAME_VARIABLE) {
                    let stub = variableStub[value];

                    if (!isObject(stub) || stub.type !== T_NODE_NAME_VARIABLE) {
                        throw new Error(`missing type attribute ${T_NODE_NAME_VARIABLE} for ${value}, please check your variable map. Current variable map has keys [${Object.keys(variableStub).join(', ')}].`);
                    }
                }
            }
        }
    }
};

let runTimeCheck = (variableStub, variableMap) => {
    for (let name in variableStub) {
        let stub = variableStub[name];
        // missing check
        if (!variableMap.hasOwnProperty(name) && !stub.hasOwnProperty(A_DEFAULT)) {
            throw new Error(`missing variable ${name} in variableMap whick keys are [${Object.keys(variableMap).join(', ')}].`);
        }

        // type match
        if (stub.type === T_FUNCTION && !isFunction(variableMap[name])) {
            throw new Error(`variable ${name} is not function as expected, please check your variable map. Current variable map has keys [${Object.keys(variableMap).join(', ')}].`);
        }

        if (stub.type === T_NODE_NAME_VARIABLE && !isString(variableMap[name])) {
            throw new Error(`variable ${name} is not string as expected, please check your variable map. Current variable map has keys [${Object.keys(variableMap).join(', ')}].`);
        }
    }
};

let getVariable = (name, variableMap, variableStub) => {
    let stub = variableStub[name] || {};
    let value = null;
    if (variableMap.hasOwnProperty(name)) {
        value = variableMap[name];
    } else {
        // try to using default
        if (!stub.hasOwnProperty(A_DEFAULT)) {
            throw new Error(`missing variable ${name}.`);
        } else {
            value = stub[A_DEFAULT];
        }
    }

    if (isObject(stub) && isFunction(stub.validate)) { // dynamic validation
        stub.validate(value);
    }

    return value;
};

module.exports = {
    checkAST,
    runTimeCheck,
    getVariable
};


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n,
    parseArgs
} = __webpack_require__(125);

module.exports = (...args) => {
    let tagName = args[0];

    if (typeof tagName === 'string') {
        return n(...args);
    } else { // regard as lumine view
        let {
            attributes,
            childs
        } = parseArgs(args, {
            doParseStyle: false
        });

        return tagName({
            props: attributes,
            children: childs
        });
    }
};


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let line = __webpack_require__(204);
let {
    n
} = __webpack_require__(125);

module.exports = ({
    length = 10,
    bold = 1,
    color = 'black',
    angle = 0,
    direction
} = {}) => {
    if (direction === 'left') {
        angle = 45;
    } else if (direction === 'top') {
        angle = 135;
    } else if (direction === 'right') {
        angle = 225;
    } else if (direction === 'bottom') {
        angle = 315;
    }
    return n('div', {
        style: {
            display: 'inline-block',
            transform: `rotate(${angle}deg)`
        }
    }, [
        line({
            color,
            bold,
            length
        }),

        n('div', {
            style: {
                marginLeft: length / 2 - bold / 2,
                marginTop: -1 * length / 2 - bold / 2
            }
        }, [
            line({
                color,
                bold,
                length,
                angle: 90
            })
        ])
    ]);
};


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(125);

module.exports = ({
    color = 'black',
    bold = 3,
    length = 20,
    direction = 'vertical',
    angle = 0
} = {}) => {
    return direction === 'vertical' ?
        n('div', {
            style: {
                width: bold,
                height: length,
                backgroundColor: color,
                transform: `rotate(${angle}deg)`
            }
        }) : n('div', {
            style: {
                height: bold,
                width: length,
                backgroundColor: color,
                transform: `rotate(${angle}deg)`
            }
        });
};


/***/ })
/******/ ]);