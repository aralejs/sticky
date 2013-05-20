define("arale/sticky/1.1.0/sticky-debug", [ "$-debug", "arale/events/1.1.0/events-debug", "./utils-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), Events = require("arale/events/1.1.0/events-debug"), utils = require("./utils-debug");
    var doc = $(document);
    var isPositionFixedSupported = utils.checkPositionFixedSupported(), isPositionStickySupported = utils.checkPositionStickySupported(), stickyPrefix = utils.stickyPrefix;
    /**
     * Fixed
     * @param options
     * @constructor
     *      options.element: Selector
     */
    function Fixed(options) {
        var self = this;
        /*if (!(self instanceof Fixed)) {
            return new Fixed(options);
        }*/
        self.options = options;
    }
    Events.mixTo(Fixed);
    Fixed.prototype.render = function() {
        var self = this, elem = self.elem = $(self.options.element);
        // 一个元素只允许绑定一次
        if (!elem.length || elem.data("bind-fixed")) return;
        // 记录元素原来的位置
        self._originTop = elem.offset().top;
        self.marginTop = $.isNumeric(self.options.marginTop) ? Math.min(self.options.marginTop, self._originTop) : self._originTop;
        self._originStyles = {
            position: null,
            top: null
        };
        // 保存原有的样式
        for (var style in self._originStyles) {
            if (self._originStyles.hasOwnProperty(style)) {
                self._originStyles[style] = elem.css(style);
            }
        }
        var scrollFn = isPositionFixedSupported ? $.proxy(self._supportFixed, self) : $.proxy(self._supportAbsolute, self);
        // 先运行一次
        scrollFn();
        // 监听滚动事件
        // fixed 是本模块绑定的滚动事件的命名空间
        $(window).on("scroll", function() {
            if (!elem.is(":visible")) return;
            scrollFn();
        });
        elem.data("bind-fixed", true);
        return self;
    };
    Fixed.prototype._supportFixed = function() {
        var self = this, elem = self.elem, originTop = self._originTop, marginTop = self.marginTop;
        // 计算元素距离当前窗口上方的距离
        var distance = originTop - doc.scrollTop();
        // 当距离小于等于预设的值时
        // 将元素设为 fix 状态
        if (!elem.data("_fixed") && distance <= marginTop) {
            self._addPlaceholder();
            elem.css({
                position: "fixed",
                top: marginTop
            });
            elem.data("_fixed", true);
            self.trigger("stick", elem);
        } else if (elem.data("_fixed") && distance > marginTop) {
            self._restore();
        }
    };
    Fixed.prototype._supportAbsolute = function() {
        var self = this, elem = self.elem, originTop = self._originTop, marginTop = self.marginTop;
        // 计算元素距离当前窗口上方的距离
        var distance = originTop - doc.scrollTop();
        // 当距离小于等于预设的值时
        // 将元素设为 fix 状态
        if (distance <= marginTop) {
            self._addPlaceholder();
            elem.css({
                position: "absolute",
                top: marginTop + doc.scrollTop()
            });
            elem.data("_fixed", true);
            self.trigger("stick", elem);
        } else if (elem.data("_fixed") && distance > marginTop) {
            self._restore();
        }
    };
    Fixed.prototype._restore = function() {
        var self = this, elem = self.elem;
        self._removePlaceholder();
        // 恢复原有的样式
        elem.css(self._originStyles);
        elem.data("_fixed", false);
        self.trigger("restored", elem);
    };
    // 需要占位符的情况有: 1) position: static or relative; 但除了:
    // 1) !display: block;
    Fixed.prototype._addPlaceholder = function() {
        var self = this, elem = self.elem;
        var need = false, flt = elem.css("float"), position = elem.css("position"), display = elem.css("display");
        if (utils.indexOf([ "static", "relative" ], position) !== -1) need = true;
        if (display !== "block") need = false;
        if (need) {
            // 添加占位符
            self._placeholder = $('<div style="visibility: hidden;margin:0;padding:0;"></div>');
            self._placeholder.width(elem.outerWidth(true)).height(elem.outerHeight(true)).css("float", flt).insertAfter(elem);
        }
    };
    Fixed.prototype._removePlaceholder = function() {
        var self = this;
        // 如果后面有占位符的话, 删除掉
        self._placeholder && self._placeholder.remove();
    };
    Fixed.prototype.destory = function() {
        var self = this;
        self.off();
        self._removePlaceholder();
    };
    /**
     * Sticky
     * @param options
     * @constructor
     *      options.element: Selector
     *      options.marginTop: Number
     */
    function Sticky(options) {
        var self = this;
        self.options = options;
    }
    Events.mixTo(Sticky);
    Sticky.prototype.render = function() {
        var self = this, elem = self.elem = $(self.options.element), tmp = "";
        // 一个元素只允许绑定一次
        if (!elem.length || elem.data("bind-fixed")) return;
        // 记录元素原来的位置
        self._originTop = elem.offset().top;
        self.marginTop = $.isNumeric(self.options.marginTop) ? Math.min(self.options.marginTop, self._originTop) : self._originTop;
        for (var i = 0; i < stickyPrefix.length; i++) {
            tmp += "position:" + stickyPrefix[i] + "sticky;";
        }
        elem[0].style.cssText += tmp + "top: " + self.marginTop + "px;";
        // 和 fixed 一致, 滚动时两个触发事件, 如果不需要事件的话, 下面的代码都可以删掉...
        self._supportSticky();
        $(window).on("scroll", function() {
            if (!elem.is(":visible")) return;
            self._supportSticky();
        });
        elem.data("bind-fixed", true);
        return self;
    };
    Sticky.prototype._supportSticky = function() {
        var self = this, elem = self.elem, originTop = self._originTop, marginTop = self.marginTop;
        var distance = originTop - doc.scrollTop();
        if (!elem.data("_fixed") && distance <= marginTop) {
            elem.data("_fixed", true);
            // 支持 position: sticky 的是不需要占位符的
            self.trigger("stick", elem);
        } else if (elem.data("_fixed") && distance > marginTop) {
            elem.data("_fixed", false);
            self.trigger("restored", elem);
        }
    };
    Sticky.prototype.destory = function() {
        this.off();
    };
    function stick(elem, marginTop) {
        var actual = isPositionStickySupported ? Sticky : Fixed;
        return new actual({
            element: elem,
            marginTop: marginTop
        });
    }
    stick.stick = stick;
    stick.fix = function(elem) {
        return new Fixed({
            element: elem
        }).render();
    };
    module.exports = stick;
});

define("arale/sticky/1.1.0/utils-debug", [ "$-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), doc = document, stickyPrefix = [ "-webkit-", "-ms-", "-o-", "-moz-", "" ], // 只需判断是否是 IE 和 IE6
    ua = (window.navigator.userAgent || "").toLowerCase(), isIE = ua.indexOf("msie") !== -1, isIE6 = ua.indexOf("msie 6") !== -1;
    return {
        // https://github.com/RubyLouvre/detectPositionFixed/blob/master/index.js
        checkPositionFixedSupported: function() {
            if (isIE6) return false;
            var positionfixed;
            var test = document.createElement("div"), control = test.cloneNode(false), root = document.body;
            var oldCssText = root.style.cssText;
            root.style.cssText = "padding:0;margin:0";
            test.style.cssText = "position:fixed;top:42px";
            root.appendChild(test);
            root.appendChild(control);
            positionfixed = test.offsetTop !== control.offsetTop;
            test.parentNode.removeChild(test);
            control.parentNode.removeChild(control);
            root.style.cssText = oldCssText;
            return positionfixed;
        },
        checkPositionStickySupported: function() {
            if (isIE) return false;
            var container = doc.body;
            if (doc.createElement && container && container.appendChild && container.removeChild) {
                var isSupported, el = doc.createElement("div"), getStyle = function(st) {
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
        indexOf: function(array, item) {
            if (array == null) return -1;
            var nativeIndexOf = Array.prototype.indexOf;
            if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
            for (var i = 0; i < array.length; i++) if (array[i] === item) return i;
            return -1;
        },
        stickyPrefix: stickyPrefix
    };
});
