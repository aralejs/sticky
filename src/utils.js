define(function (require, exports, module) {

    var $ = require("$"),

        doc = document,
        stickyPrefix = ["-webkit-", "-ms-", "-o-", "-moz-", ""],

        // UA判断IE版本参见: https://github.com/kissyteam/kissy/blob/1.3.0/src/seed/src/ua.js
        navigator = window.navigator,
        ua = navigator && navigator.userAgent || "",
        div = doc && doc.createElement('div'),
        VERSION_PLACEHOLDER = '{{version}}',
        IE_DETECT_TPL = '<!--[if IE ' + VERSION_PLACEHOLDER + ']><' + 's></s><![endif]-->',
        IE_DETECT_RANGE = [6, 9],  // 检测 IE 6~9
        s = [],
        isIE = false,
        ieVersion = undefined;

    function numberify(s) {
        var c = 0;
        return parseFloat(s.replace(/\./g, function () {
            return (c++ === 0) ? '.' : '';
        }));
    }
    function getIEVersion(ua) {
        var m;
        if ((m = ua.match(/MSIE\s([^;]*)/)) && m[1]) {
            return numberify(m[1]);
        }
        return 0;
    }
    if (div) {
        div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, '');
        s = div.getElementsByTagName('s');
    }

    if (s.length > 0) {
        isIE = true;

        for (var v = IE_DETECT_RANGE[0], end = IE_DETECT_RANGE[1]; v <= end; v++) {
            div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, v);
            if (s.length > 0) {
                ieVersion = v;
                break;
            }
        }
        !ieVersion && (ieVersion = getIEVersion(ua))
    }

    return {
        // https://github.com/RubyLouvre/detectPositionFixed/blob/master/index.js
        checkPositionFixedSupported: function () {
            if (isIE && ieVersion == 6.0) return false;

            var positionfixed;

            var test = document.createElement('div'),
                control = test.cloneNode(false),
                root = document.body;

            var oldCssText = root.style.cssText;
            root.style.cssText = 'padding:0;margin:0';
            test.style.cssText = 'position:fixed;top:42px';
            root.appendChild(test);
            root.appendChild(control);

            positionfixed = test.offsetTop !== control.offsetTop;

            test.parentNode.removeChild(test);
            control.parentNode.removeChild(control);
            root.style.cssText = oldCssText;

            return positionfixed;
        },
        checkPositionStickySupported: function () {
            if (isIE) return false;

            var container = doc.body;

            if (doc.createElement && container && container.appendChild && container.removeChild) {
                var isSupported,
                    el = doc.createElement("div"),
                    getStyle = function (st) {
                        if (window.getComputedStyle) {
                            return window.getComputedStyle(el).getPropertyValue(st);
                        } else {
                            return el.currentStyle.getAttribute(st);
                        }
                    };

                container.appendChild(el);

                for (var i = 0; i < stickyPrefix.length; i++) {
                    el.style.cssText = "position:" + stickyPrefix[i] + "sticky;visibility:hidden;";
                    if (isSupported = getStyle("position").indexOf("sticky") !== -1) break;
                }

                el.parentNode.removeChild(el);
                return isSupported;
            }

            return false;
        },
        indexOf: function (array, item) {
            if (array == null) return -1;
            var nativeIndexOf = Array.prototype;

            if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
            for (var i = 0; i < array.length; i++) if (array[i] === item) return i;
            return -1;
        },
        stickyPrefix: stickyPrefix
    }
});