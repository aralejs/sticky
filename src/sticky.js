define(function (require, exports, module) {

    var $ = require("$"),

        doc = $(document),
        stickyPrefix = ["-webkit-", "-ms-", "-o-", "-moz-", ""],

        // 只需判断是否是 IE 和 IE6
        ua = (window.navigator.userAgent || "").toLowerCase(),
        isIE = ua.indexOf("msie") !== -1,
        isIE6 = ua.indexOf("msie 6") !== -1,

        guid = 0;

    var _isPositionStickySupported = checkPositionStickySupported(),
        _isPositionFixedSupported = checkPositionFixedSupported();

    function Fixed(options) {
        this.options = options;

        this._stickyId = guid++;
    }

    Fixed.prototype.render = function () {
        var self = this,
            elem = self.elem = $(self.options.element);

        // 一个元素只允许绑定一次
        if (!elem.length || elem.data('bind-fixed')) return;

        // 记录元素原来的位置
        self._originTop = elem.offset().top;
        self.marginTop = $.isNumeric(self.options.marginTop) ? Math.min(self.options.marginTop, self._originTop) : self._originTop;


        self._originStyles = {
            position: null,
            top: null,
            left: null
        };
        // 保存原有的样式
        for (var style in self._originStyles) {
            if (self._originStyles.hasOwnProperty(style)) {
                self._originStyles[style] = elem.css(style);
            }
        }

        var scrollFn = stick.isPositionFixedSupported ? $.proxy(self._supportFixed, self) : $.proxy(self._supportAbsolute, self);

        if (!stick.isPositionFixedSupported) {
            // avoid floatImage Shake for IE6
            // see: https://github.com/lifesinger/lifesinger.github.com/blob/master/lab/2009/ie6_fixed_position_v4.html
            $("<style type='text/css'> * html { background:url(null) no-repeat fixed; } </style>").appendTo("head");
        }
        // 先运行一次
        scrollFn();

        // 监听滚动事件
        // fixed 是本模块绑定的滚动事件的命名空间
        $(window).on('scroll.'+self._stickyId, function () {
            if (!elem.is(':visible')) return;
            scrollFn();
        });

        elem.data('bind-fixed', true);

        return self;
    };
    Fixed.prototype._supportFixed = function () {
        var self = this,
            elem = self.elem,
            originTop = self._originTop,
            marginTop = self.marginTop;

        // 计算元素距离当前窗口上方的距离
        var distance = originTop - doc.scrollTop();

        // 当距离小于等于预设的值时
        // 将元素设为 fix 状态
        if (!elem.data('_fixed') && distance <= marginTop) {
            var offsetLeft = elem.offset().left;

            self._addPlaceholder();

            elem.css({
                position: 'fixed',
                top: marginTop,
                left: offsetLeft
            });

            elem.data('_fixed', true);

            $.isFunction(self.options.callback) && self.options.callback.call(self, true);
        } else if (elem.data('_fixed') && distance > marginTop) {
            self._restore();
        }
    };
    Fixed.prototype._supportAbsolute = function () {
        var self = this,
            elem = self.elem,
            originTop = self._originTop,
            marginTop = self.marginTop;

        // 计算元素距离当前窗口上方的距离
        var distance = originTop - doc.scrollTop();

        // 当距离小于等于预设的值时
        // 将元素设为 fix 状态
        if (distance <= marginTop) {
            self._addPlaceholder();
            elem.css({
                position: 'absolute',
                top: marginTop + doc.scrollTop()
            });
            elem.data('_fixed', true);

            $.isFunction(self.options.callback) && self.options.callback.call(self, true);
        } else if (elem.data('_fixed') && distance > marginTop) {
            self._restore();
        }
    };
    Fixed.prototype._restore = function (f) {
        var self = this,
            elem = self.elem;

        self._removePlaceholder();
        // 恢复原有的样式
        elem.css(self._originStyles);
        elem.data('_fixed', false);

        !f && $.isFunction(self.options.callback) && self.options.callback.call(self, false);
    };

    // 需要占位符的情况有: 1) position: static or relative; 但除了:
    // 1) !display: block;
    Fixed.prototype._addPlaceholder = function() {
        var self = this,
            elem = self.elem;

        var need = false,
            flt = elem.css("float"),
            position = elem.css("position"),
            display = elem.css("display");

        if (indexOf(["static", "relative"], position) !== -1) need = true;
        if (display !== "block") need = false;

        if (need) {
            // 添加占位符
            self._placeholder = $('<div style="visibility: hidden;margin:0;padding:0;"></div>');
            self._placeholder.width(elem.outerWidth(true))
                .height(elem.outerHeight(true))
                .css("float", flt).insertAfter(elem);
        }
    };
    Fixed.prototype._removePlaceholder = function() {
        var self = this;

        // 如果后面有占位符的话, 删除掉
        self._placeholder && self._placeholder.remove();
    };
    Fixed.prototype.destory = function () {
        var self = this;

        self._restore(1);
        self.elem.data("bind-fixed", false);

        $(window).off('scroll.'+self._stickyId);
    };


    function Sticky(options) {
        this.options = options;

        this._stickyId = guid++;
    }

    Sticky.prototype.render = function () {
        var self = this,
            elem = self.elem = $(self.options.element);

        // 一个元素只允许绑定一次
        if (!elem.length || elem.data('bind-fixed')) return;

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

        self._supportSticky();

        $(window).on('scroll.'+self._stickyId, function () {
            if (!elem.is(':visible')) return;
            self._supportSticky();
        });

        elem.data('bind-fixed', true);

        return self;
    };
    Sticky.prototype._supportSticky = function () {
        var self = this,
            elem = self.elem,
            originTop = self._originTop,
            marginTop = self.marginTop,
            tmp = "";

        var distance = originTop - doc.scrollTop();

        if (!elem.data('_fixed') && distance <= marginTop) {
            for (var i = 0; i < stickyPrefix.length; i++) {
                tmp += "position:" + stickyPrefix[i] + "sticky;";
            }

            elem[0].style.cssText += tmp + "top: " + self.marginTop + "px;";

            elem.data('_fixed', true);
            // 支持 position: sticky 的是不需要占位符的
            $.isFunction(self.options.callback) && self.options.callback.call(self, true);
        } else if (elem.data('_fixed') && distance > marginTop) {
            self._restore();
        }
    };

    Sticky.prototype._restore = function(f) {
        var self = this,
            elem = self.elem;

        // 恢复原有的样式
        elem.css(self._originStyles);
        elem.data('_fixed', false);

        !f && $.isFunction(self.options.callback) && self.options.callback.call(self, false);
    };

    Sticky.prototype.destory = function () {
        var self = this;

        self._restore(1);
        self.elem.data("bind-fixed", false);
        $(window).off('scroll.'+self._stickyId);
    };


    function stick(elem, marginTop, callback) {
        var actual = stick.isPositionStickySupported ? Sticky : Fixed;

        return (new actual({
            element: elem,
            marginTop: marginTop || 0,
            callback: callback
        })).render();
    }
    stick.stick = stick;
    stick.fix =  function (elem) {
        return (new Fixed({
            element: elem
        })).render();
    };

    function checkPositionFixedSupported() {
        return !isIE6;
    }
    function checkPositionStickySupported() {
        if (isIE) return false;

        var container = doc[0].body;

        if (doc[0].createElement && container && container.appendChild && container.removeChild) {
            var isSupported,
                el = doc[0].createElement("div"),
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
    }

    function indexOf(array, item) {
        if (array == null) return -1;
        var nativeIndexOf = Array.prototype.indexOf;

        if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
        for (var i = 0; i < array.length; i++) if (array[i] === item) return i;
        return -1;
    }

    // 便于写测试用例
    stick.isPositionFixedSupported = _isPositionFixedSupported;
    stick.isPositionStickySupported = _isPositionStickySupported;

    module.exports = stick;
});
