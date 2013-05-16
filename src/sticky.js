define(function (require, exports, module) {

    var $ = require("$"),
        Events = require('events'),
        utils = require("./utils");

    var doc = $(document),
        guid = 0;// 用于记录 placeholder 累计 id;

    var isPositionFixedSupported = utils.checkPositionFixedSupported(),
        isPositionStickySupported = utils.checkPositionStickySupported(),
        stickyPrefix = utils.stickyPrefix;

    /**
     * Fixed
     * @param options
     * @constructor
     *      options.element: Selector
     */
    function Fixed(options) {
        var self = this;

        if (!(self instanceof Fixed)) {
            return new Fixed(options);
        }

        self.options = options;
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
        $(window).on('scroll', function () {  // todo: resize?
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
            addPlaceholder(elem);

            elem.css({
                position: 'fixed',
                top: marginTop
            });
            elem.data('_fixed', true);

            self.trigger("stick", elem);
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
            addPlaceholder(elem);

            elem.css({
                position: 'absolute',
                top: marginTop + doc.scrollTop()
            });
            elem.data('_fixed', true);

            self.trigger("stick", elem);
        } else if (elem.data('_fixed') && distance > marginTop) {
            self._restore();
        }
    };
    Fixed.prototype._restore = function () {
        var self = this,
            elem = self.elem;

        removePlaceholder(elem);
        // 恢复原有的样式
        elem.css(self._originStyles);
        elem.data('_fixed', false);

        self.trigger("restored", elem);
    };
    Fixed.prototype.destory = function () {
        var self = this;

        self.off();
        removePlaceholder(self.elem);
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

        if (!(self instanceof Sticky)) {
            return new Sticky(options);
        }

        self.options = options;
    }

    Events.mixTo(Sticky);

    Sticky.prototype.render = function () {
        var self = this,
            elem = self.elem = $(self.options.element),
            tmp = "";

        // 一个元素只允许绑定一次
        if (!elem.length || elem.data('bind-fixed')) return;

        // 记录元素原来的位置
        self._originTop = elem.offset().top;
        self.marginTop = $.isNumeric(self.options.marginTop) ? Math.min(self.options.marginTop, self._originTop) : self._originTop;

        for (var i = 0; i < stickyPrefix.length; i++) {
            tmp += "position:" + stickyPrefix[i] + "sticky;";
        }

        elem[0].style.cssText += tmp + "top: " + self.marginTop + "px;";

        // 和 fixed 一致, 滚动时两个触发事件
        self._supportSticky();

        $(window).on('scroll', function () {
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
            marginTop = self.marginTop;

        var distance = originTop - doc.scrollTop();

        if (!elem.data('_fixed') && distance <= marginTop) {
            elem.data('_fixed', true);
            // 支持 position: sticky 的是不需要占位符的
            self.trigger("stick", elem);
        } else if (elem.data('_fixed') && distance > marginTop) {
            elem.data('_fixed', false);

            self.trigger("restored", elem);
        }
    };

    Sticky.prototype.destory = function () {
        var self = this;

        self.off();
        removePlaceholder(self.elem);
    };


    function indexOf(array, item) {
        if (array == null) return -1;
        var nativeIndexOf = Array.prototype;

        if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
        for (var i = 0; i < array.length; i++) if (array[i] === item) return i;
        return -1;
    }

    // 需要占位符的情况有: position: static or relative; 但除了:
    // 1) !display: block; 2) float: left or right
    function addPlaceholder(elem) {
        var need = false,
            flt = elem.css("float"),
            position = elem.css("position"),
            display = elem.css("display");

        if (indexOf(["static", "relative"], position) !== -1) need = true;
        if (indexOf(["left", "right"], flt) !== -1 || display !== "block") need = false;

        if (need) {
            // 添加占位符
            var placeholder = $('<div id="arale_fixed_placeholder_' + guid + '" style="visibility: hidden;margin:0;padding:0;"></div>');
            placeholder.width(elem.outerWidth(true))
                .height(elem.outerHeight(true));

            elem.data("placeholder_id", guid++).after(placeholder);
        }
    }

    function removePlaceholder(elem) {
        // 如果后面有占位符的话, 删除掉
        var placeholder = elem.data("placeholder_id");
        placeholder !== undefined && elem.next("#arale_fixed_placeholder_" + placeholder).remove();
    }

    return {
        stick: function (elem, marginTop) {
            var actual = isPositionStickySupported ? Sticky : Fixed;
            return (new actual({
                element: elem,
                marginTop: marginTop
            }));
        },
        fix: function (elem) {
            return (new Fixed({
                element: elem
            })).render();
        }
    };
});