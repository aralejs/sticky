define(function(require, exports, module) {

    var $ = require('$')

    // 用于保存可能修改到的样式
    var originStyles = {
        position: null,
        top: null
    };
    
    var ie6 = $.browser.msie && $.browser.version == 6.0;
    var doc = $(document)
    var body = $(document.body)


    // Fixed
    // ---
    // 制造跟随滚动效果的模块
    // element 是需要跟随滚动的目标元素
    // marginTop 指当元素距离可视窗口顶部的距离等于这个值时，开始触发跟随 fixed 状态
    var Fixed = function(element, marginTop) {

        var sourceElem = $(element)
        if (sourceElem.data('bind-fixed')) {
            return
        }

        var visualElem = sourceElem.clone()
        marginTop = marginTop || 0
        visualElem.removeAttr('id')
        body.append(visualElem)

        // 记录元素原来的位置
        var originTop = sourceElem.offset().top;
        // 修正过高的 marginTop
        marginTop = marginTop<=originTop ? marginTop : originTop;


        var scrollFn = !ie6 ? function() {
            
            // 计算元素距离当前窗口上方的距离
            var distance = originTop - doc.scrollTop()

            // 当距离小于等于预设的值时
            // 将元素设为 fix 状态
            if (!sourceElem.data('_fixed') && distance <= marginTop) {
                onFixed(function() {
                    visualElem.css({
                        position: 'fixed',
                        left: sourceElem.position().left,
                        top: marginTop
                    })
                    sourceElem.data('_fixed', true)
                })
            } 
            else if (sourceElem.data('_fixed') && distance > marginTop) {
                // 恢复原有的样式
                onOrigin(function() {
                    visualElem.css(originStyles)
                    sourceElem.data('_fixed', false)
                })
            }
        } : function() {
            
            // 计算元素距离当前窗口上方的距离
            var distance = originTop - doc.scrollTop();

            // 当距离小于等于预设的值时
            // 将元素设为 fix 状态
            if (distance <= marginTop) {
                onFixed(function() {
                    visualElem.css({
                        position: 'absolute',
                        top: marginTop + doc.scrollTop()
                    })
                    sourceElem.data('_fixed', true)
                })
            } 
            else if (element.data('_fixed') && distance > marginTop) {
                // 恢复原有的样式
                onOrigin(function() {
                    visualElem.css(originStyles)
                    sourceElem.data('_fixed', false)
                })
            }
        };


        function onFixed(fn) {
            sourceElem.css('visibility', 'hidden')
            visualElem.css('visibility', 'visible')
            fn()
        }

        function onOrigin(fn) {
            sourceElem.css('visibility', 'visible')
            visualElem.css('visibility', 'hidden')
            fn()
        }

        // 先运行一次
        scrollFn()

        // 监听滚动事件
        // fixed 是本模块绑定的滚动事件的命名空间
        doc.on('scroll', scrollFn)
        sourceElem.data('bind-fixed', true)

        // for Travis
        return visualElem

    }


    module.exports = Fixed;

});
