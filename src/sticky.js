define(function (require, exports, module, undefined) {

    var $ = require("$"),
        doc = $(document),
        stickyPrefix = ["-webkit-", "-ms-", "-o-", "-moz-", ""],
        guid = 0,

        // 只需判断是否是 IE 和 IE6
        ua = (window.navigator.userAgent || "").toLowerCase(),
        isIE = ua.indexOf("msie") !== -1,
        isIE6 = ua.indexOf("msie 6") !== -1;

    var isPositionStickySupported = checkPositionStickySupported(),
        isPositionFixedSupported = checkPositionFixedSupported();


    // Sticky
    // 实现侧边栏跟随滚动的效果
    // 当滚动条滚动到一定距离时，指定区域变为 sticky 效果开始跟随页面
    // ---
    function Sticky(options) {
        this.options = options || {};
        this.elem = $(this.options.element);        
        this.callback = options.callback || function() {};
        this.position = options.position;
        this._stickyId = guid++;
    }

    Sticky.prototype.render = function () {
        var self = this;

        // 一个元素只允许绑定一次
        if (!this.elem.length || this.elem.data('bind-sticked')) {
            return this;
        }

        this.adjust = function() {
            self._restore();

            var offset = self.elem.offset();
            self._originTop = offset.top;
            self._originLeft = offset.left;

            scrollFn.call(self);
        };
        // 记录元素原来的位置
        var offset = this.elem.offset();
        this._originTop = offset.top;
        this._originLeft = offset.left;

        // 表示需要 fixed，不能用 position:sticky 来实现
        if (this.position.top === Number.MAX_VALUE) {
            var callFix = true;    // 表示调用了 sticky.fix
            this.position.top = this._originTop;
        }

        // 保存原有的样式
        this._originStyles = {
            position: null,
            top: null,
            bottom: null,
            left: null
        };
        for (var style in this._originStyles) {
            if (this._originStyles.hasOwnProperty(style)) {
                this._originStyles[style] = this.elem.css(style);
            }
        }

        var scrollFn;
        // sticky.fix 无法用 sticky 方式来实现
        if (sticky.isPositionStickySupported && !callFix) {
            scrollFn = this._supportSticky;

            // 直接设置 sticky 的样式属性
            var tmp = "";
            for (var i = 0; i < stickyPrefix.length; i++) {
                tmp += "position:" + stickyPrefix[i] + "sticky;";
            }
            if (this.position.top !== undefined) {
                tmp += "top: " + this.position.top + "px;";
            }
            if (this.position.bottom !== undefined) {
                tmp += "bottom: " + this.position.bottom + "px;";
            }
            this.elem[0].style.cssText += tmp;

            // position: sticky, 默认就支持元素位置的动态改变
            this.adjust = function() {
                scrollFn.call(self);
            };
        } else if (sticky.isPositionFixedSupported) {
            scrollFn = this._supportFixed;
        } else {
            scrollFn = this._supportAbsolute;   // ie6
            // avoid floatImage Shake for IE6
            // see: https://github.com/lifesinger/lifesinger.
            //      github.com/blob/master/lab/2009/ie6sticked_position_v4.html
            $("<style type='text/css'> * html" +
              "{ background:url(null) no-repeat fixed; } </style>").appendTo("head");
        }

        // 先运行一次
        scrollFn.call(this);

        // 监听滚动事件
        // fixed 是本模块绑定的滚动事件的命名空间
        $(window).on('scroll.' + this._stickyId, function () {
            if (!self.elem.is(':visible')) {
                return;
            }
            scrollFn.call(self);
        });

        // 标记已定位
        this.elem.data('bind-sticked', true);

        return this;
    };

    Sticky.prototype._supportFixed = function () {
        var scrollTop = doc.scrollTop();
        var top;
        var bottom;
        var _sticky = this.elem.data('sticked');

        // 计算元素距离当前窗口上方的距离
        if (this.position.top !== undefined) {
            top = this._originTop - scrollTop <= this.position.top;
        }
        // 计算元素底部距窗口底部的距离
        if (this.position.bottom !== undefined) {
            bottom = scrollTop + $(window).height() - this._originTop - this.elem.outerHeight() <= this.position.bottom;
        }

        // 当距离小于等于预设的值时
        // 将元素设为 fix 状态
        if (!_sticky && (top !== undefined && top || bottom !== undefined && bottom)) {
            this._addPlaceholder();

            this.elem.css($.extend({
                position: 'fixed',
                left: this._originLeft
            }, top ? { top: this.position.top } : { bottom: this.position.bottom }));
            this.elem.data('sticked', true);
            this.callback.call(this, true);
        } else if (_sticky && (!top && !bottom)) {
            this._restore();
        }
    };

    Sticky.prototype._supportAbsolute = function () {
        // 计算元素距离当前窗口上方的距离
        var distance = this._originTop - doc.scrollTop();

        // 当距离小于等于预设的值时
        // 将元素设为 fixed 状态
        if (distance <= this.marginTop) {
            // 状态变化只有一次
            if (!this.elem.data('sticked')) {
                this._addPlaceholder();
                this.elem.data('sticked', true);
                this.callback.call(this, true);
            }
            this.elem.css({
                position: 'absolute',
                top: this.marginTop + doc.scrollTop()
            });
        } else if (this.elem.data('sticked') && distance > this.marginTop) {
            this._restore();
        }
    };

    Sticky.prototype._supportSticky = function () {
        // 由于 position:sticky 尚未提供接口判断状态
        // 因此仍然要计算 top 以便进行回调
        var offsetTop = this.elem.offset().top;
        var scrollTop = doc.scrollTop();
        var top;
        var bottom;
        var _sticky = this.elem.data('sticked');

        if (this.position.top !== undefined) {
            top = offsetTop - scrollTop <= this.position.top;
        }
        if (this.position.bottom !== undefined) {
            bottom = scrollTop + $(window).height() - offsetTop - this.elem.outerHeight() <= this.position.bottom;
        }
        if (!_sticky && (top !== undefined && top || bottom !== undefined && bottom)) {
            this.elem.data('sticked', true);
            this.callback.call(this, true);
        } else if (_sticky && (!top && !bottom)){
            this.elem.data('sticked', false);
            this.callback.call(this, false);    // 不需要恢复样式和去占位符
        }
    };

    Sticky.prototype._restore = function () {
        this._removePlaceholder();

        // 恢复原有的样式
        this.elem.css(this._originStyles);
        
        // 设置元素状态
        this.elem.data('sticked', false);
    
        this.callback.call(this, false);
    };

    // 需要占位符的情况有: 1) position: static or relative，除了 display 不是 block 的情况
    Sticky.prototype._addPlaceholder = function() {
        var need = false;
        var position = this.elem.css("position");

        if (position === 'static' || position === 'relative') {
            need = true;
        }
        if (this.elem.css("display") !== "block") {
            need = false;
        }

        if (need) {
            // 添加占位符
            this._placeholder = $('<div style="visibility:hidden;margin:0;padding:0;"></div>');
            this._placeholder.width(this.elem.outerWidth(true))
                .height(this.elem.outerHeight(true))
                .css("float", this.elem.css("float")).insertAfter(this.elem);
        }
    };

    Sticky.prototype._removePlaceholder = function() {
        // 如果后面有占位符的话, 删除掉
        this._placeholder && this._placeholder.remove();
    };

    Sticky.prototype.destory = function () {
        this._restore();
        this.elem.data("bind-sticked", false);
        $(window).off('scroll.' + this._stickyId);
    };

    // 接口们
    // ---

    module.exports = sticky;

    function sticky(elem, position, callback) {
        if (!$.isPlainObject(position)) {
            position = {
                top: position
            };
        }
        if (position.top === undefined && position.bottom === undefined) {
            throw new Error('must set top or bottom')
        }
        return (new Sticky({
            element: elem,
            position: position,
            callback: callback
        })).render();
    }

    // sticky.stick(elem, position, callback)
    sticky.stick = sticky;

    // sticky.fix(elem)
    sticky.fix =  function (elem) {
        return (new Sticky({
            element: elem,
            // 无穷大的 position.top 即表示元素永远 fixed
            position: {
                top: Number.MAX_VALUE
            }
        })).render();
    };

    // 便于写测试用例
    sticky.isPositionStickySupported = isPositionStickySupported;
    sticky.isPositionFixedSupported = isPositionFixedSupported;

    // Helper
    // ---
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
    }

});
