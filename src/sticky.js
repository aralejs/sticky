define(function (require, exports, module) {

    var $ = require("$"),
        Events = require('events');

    var doc = $(document),
        guid = 0, // 用于记录 placeholder 累计 id
        stickyPrefix = ["-webkit-", "-ms-", "-o-", "-moz-", ""];

    /**
     * Fixed
     * @param options
     * @constructor
     *      options.element: Selector
     */
    function Fixed(options) {
        this.options = options;
    }
    Events.mixTo(Fixed);

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
        $(window).on('scroll', throttle(function () {
            if (!elem.is(':visible')) return;
            scrollFn();
        }, 200));
        elem.data('bind-fixed', true);
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
            elem.css({
                position: 'fixed',
                top: marginTop
            });
            elem.data('_fixed', true);

            _afterFixed(elem, self);
        } else if (elem.data('_fixed') && distance > marginTop) {
            // 恢复原有的样式
            elem.css(self._originStyles);
            elem.data('_fixed', false);

            _afterRestored(elem, self);
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
            elem.css({
                position: 'absolute',
                top: marginTop + doc.scrollTop()
            });
            elem.data('_fixed', true);

            _afterFixed(elem, self);
        } else if (elem.data('_fixed') && distance > marginTop) {
            // 恢复原有的样式
            elem.css(self._originStyles);
            elem.data('_fixed', false);

            _afterRestored(elem, self);
        }
    };


    /**
     * Sticky
     * @param options
     * @constructor
     *      options.element: Selector
     *      options.marginTop: Number
     */
    function Sticky(options) {
        this.options = options;
    }
    Events.mixTo(Sticky);

    Sticky.prototype.render = function() {
        var self = this,
            elem = self.elem = $(self.options.element),
            tmp = "";

        // 一个元素只允许绑定一次
        if (!elem.length || elem.data('bind-fixed')) return;

        // 记录元素原来的位置
        self._originTop = elem.offset().top;
        self.marginTop = $.isNumeric(self.options.marginTop) ? Math.min(self.options.marginTop, self._originTop) : self._originTop;

        for (var i = 0; i < stickyPrefix.length; i++) {
            tmp = "position:" + stickyPrefix[i] + "sticky;";
        }

        elem[0].style.cssText += tmp + "top: " + self.marginTop + ";";

        // 和 fixed 一致, 滚动时两个触发事件
        self._supportSticky();

        $(window).on('scroll', throttle(function () {
            if (!elem.is(':visible')) return;
            self._supportSticky();
        }, 200));

        elem.data('bind-fixed', true);
    };
    Sticky.prototype._supportSticky = function () {
        var self = this,
            elem = self.elem,
            originTop = self._originTop,
            marginTop = self.marginTop;

        var distance = originTop - doc.scrollTop();

        if (!elem.data('_fixed') && distance <= marginTop) {
            elem.data('_fixed', true);

            _afterSticky(elem, self);
        } else if (elem.data('_fixed') && distance > marginTop) {
            elem.data('_fixed', false);

            _afterRestored(elem, self);
        }
    };




    function _afterFixed(elem, self) {
        // todo: 有时不需要占位符
        // 添加占位符
        var placeholder = $('<div id="_arale_fixed_placeholder_' + guid + '" style="visibility: hidden;margin:0;padding:0;"></div>');
        placeholder.width(elem.outerWidth(true))
            .height(elem.outerHeight(true));

        elem.after(placeholder).data("_placeholder_id", guid++);

        self.trigger("afterFixed", elem);
    }

    // 支持 position: sticky 的是不需要占位符的
    function _afterSticky(elem, self) {

        self.trigger("afterSticky", elem);
    }

    function _afterRestored(elem, self) {
        // 如果后面有占位符的话, 删除掉
        elem.next("#_arale_fixed_placeholder_" + elem.data("_placeholder_id")).remove();

        self.trigger("afterRestored", elem);
    }
    // From: http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED
    var isPositionFixedSupported = (function () {
        var container = doc[0].body;

        if (doc[0].createElement && container && container.appendChild && container.removeChild) {
            var el = doc[0].createElement('div');

            if (!el.getBoundingClientRect) return null;

            el.innerHTML = 'x';
            el.style.cssText = 'position:fixed;top:100px;';
            container.appendChild(el);

            var originalHeight = container.style.height,
                originalScrollTop = container.scrollTop;

            container.style.height = '3000px';
            container.scrollTop = 500;

            var elementTop = el.getBoundingClientRect().top;
            container.style.height = originalHeight;

            var isSupported = (elementTop === 100);
            container.removeChild(el);
            container.scrollTop = originalScrollTop;

            return isSupported;
        }

        return null;
    })();

    var isPositionStickySupported = (function () {
        var container = doc[0].body;

        if (doc[0].createElement && container && container.appendChild && container.removeChild) {
            var isSupported,
                el = doc[0].createElement("div"),
                has = function (val) {
                    var actual = "";
                    if (window.getComputedStyle) {
                        actual = window.getComputedStyle(el).getPropertyValue("position");
                    } else {
                        actual = el.currentStyle.getAttribute("position");
                    }
                    return actual.indexOf(val) !== -1;
                };

            container.appendChild(el);

            for (var i = 0; i < stickyPrefix.length; i++) {
                el.style.cssText = "position:" + stickyPrefix[i] + "sticky;visibility:hidden;";
                if (isSupported = has("sticky")) break;
            }

            container.removeChild(el);
            return isSupported;
        }

        return null;
    })();

    var throttle = function (fn, ms, context) {
        ms = ms || 150;

        if (ms === -1) {
            return (function () {
                fn.apply(context || this, arguments);
            });
        }

        var last = $.now();

        return (function () {
            var now = $.now();
            if (now - last > ms) {
                last = now;
                fn.apply(context || this, arguments);
            }
        });
    };

    return {
        stick: isPositionStickySupported ? Sticky : Fixed,
        fix: Fixed
    };
});