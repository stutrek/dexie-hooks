(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var react_1 = require("react");
    exports.useTable = function (table) {
        var reducer = react_1.useCallback(function (state, action) {
            switch (action.type) {
                case 'resolved':
                    return [action.data, false, undefined];
                case 'error':
                    return [undefined, false, action.error];
                default:
                    return [undefined, true, undefined];
            }
        }, [table]);
        var _a = react_1.useReducer(reducer, [undefined, true, undefined]), state = _a[0], dispatch = _a[1];
        react_1.useEffect(function () {
            var getAndDispatch = function () {
                return table
                    .toArray()
                    .then(function (data) {
                    dispatch({
                        type: 'resolved',
                        data: data
                    });
                })["catch"](function (error) {
                    dispatch({
                        type: 'error',
                        error: error
                    });
                });
            };
            var listener = function (changes) {
                for (var _i = 0, changes_1 = changes; _i < changes_1.length; _i++) {
                    var change = changes_1[_i];
                    if (change.table === table.name) {
                        getAndDispatch();
                        break;
                    }
                }
            };
            getAndDispatch();
            table.db.on('changes', listener);
            return function () {
                table.db.off('changes', listener);
            };
        }, [table]);
        return state;
    };
    exports.useItem = function (table, id) {
        var reducer = react_1.useCallback(function (state, action) {
            switch (action.type) {
                case 'resolved':
                    return [action.data, false, undefined];
                case 'error':
                    return [undefined, false, action.error];
                default:
                    return [undefined, true, undefined];
            }
        }, [table]);
        var _a = react_1.useReducer(reducer, [undefined, true, undefined]), state = _a[0], dispatch = _a[1];
        react_1.useEffect(function () {
            var getAndDispatch = function () {
                return table
                    .get(id)
                    .then(function (data) {
                    dispatch({
                        type: 'resolved',
                        data: data
                    });
                })["catch"](function (error) {
                    dispatch({
                        type: 'error',
                        error: error
                    });
                });
            };
            var listener = function (changes) {
                for (var _i = 0, changes_2 = changes; _i < changes_2.length; _i++) {
                    var change = changes_2[_i];
                    if (change.table === table.name && change.key === id) {
                        getAndDispatch();
                        break;
                    }
                }
            };
            getAndDispatch();
            table.db.on('changes', listener);
            return function () {
                table.db.off('changes', listener);
            };
        }, [table, id]);
        return state;
    };
});
//# sourceMappingURL=index.js.map