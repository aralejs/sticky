define(function (require, exports, module) {

    var doc = document,
        stickyPrefix = ["-webkit-", "-ms-", "-o-", "-moz-", ""];

    // https://github.com/RubyLouvre/detectPositionFixed/blob/master/index.js

    var _now = Date.now || function () {
        return +new Date();
    };
    return {
        checkPositionFixedSupported: function () {
            var positionfixed = false;

            var test = document.createElement('div'),
                control = test.cloneNode(false),
                fake = false,
                root = document.body || (function () {
                    fake = true;
                    return document.documentElement.appendChild(document.createElement('body'));
                }());

            var oldCssText = root.style.cssText;
            root.style.cssText = 'padding:0;margin:0';
            test.style.cssText = 'position:fixed;top:42px';
            root.appendChild(test);
            root.appendChild(control);

            positionfixed = test.offsetTop !== control.offsetTop;

            root.removeChild(test);
            root.removeChild(control);
            root.style.cssText = oldCssText;

            if (fake) {
                document.documentElement.removeChild(root);
            }
            return positionfixed;
        },
        checkPositionStickySupported: function () {
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

                container.removeChild(el);
                return isSupported;
            }

            return null;
        },
        throttle: function (fn, ms, context) {
            ms = ms || 150;

            if (ms === -1) {
                return (function () {
                    fn.apply(context || this, arguments);
                });
            }

            var last = _now();

            return (function () {
                var now = _now();
                if (now - last > ms) {
                    last = now;
                    fn.apply(context || this, arguments);
                }
            });
        },
        stickyPrefix: stickyPrefix
    }
});