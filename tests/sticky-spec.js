define(function(require) {

    //mocha.setup({ignoreLeaks: true});

    var expect = require('expect');
    var Sticky = require('sticky');
    var $ = require('$');
    var element = null;
    var setTop = 50;
    var elementTop;
    var ie6 = $.browser.msie && $.browser.version == 6.0;

    describe('fixed', function() {
        beforeEach(function() {
            $('body').css('height', '2000px');
            element = $('<div>test</div>');
            element.appendTo('body');
        });

        afterEach(function() {
            element.remove();
            element = null;
            $('body').css('height', '');
            $(document).off('scroll');
            $(document).scrollTop(0);
        });

        it('fixed 元素, 滚动100像素', function(done) {
            var originPosition = element.css('position');
            new Sticky.fix(element, setTop);
            $(document).scrollTop(1);
            setTimeout(function() {
                expect(element.css('position')).to.be(originPosition);
                done();
            }, 0);
        });
        it('需要占位符的 fixed 元素', function(done) {

        });
        it('不需要占位符的 fixed 元素', function(done) {

        });
        it('afterFixed 事件触发', function(done) {

        });
        it('afterRestored 事件触发', function(done) {

        });

        it('页面多个 fixed 实例', function(done) {
        });

        it('重复绑定 fixed', function(done) {
        });

    });

    describe('sticky', function() {
        beforeEach(function () {
            $('body').css('height', '2000px');
            element = $('<div>test</div>');
            element.appendTo('body');
            elementTop = element.offset().top - setTop;
        });

        afterEach(function() {
            element.remove();
            element = null;
            $('body').css('height', '');
            $(document).off('scroll');
            $(document).scrollTop(0);
        });

        it('滚动了一像素', function(done) {
            var originPosition = element.css('position');
            Fixed(element, setTop);
            $(document).scrollTop(1);
            setTimeout(function() {
                expect(element.css('position')).to.be(originPosition);
                done();
            }, 0);
        });

        it('滚动到差一像素', function(done) {
            var originPosition = element.css('position');
            Fixed(element, setTop);
            $(document).scrollTop(elementTop-1);
            setTimeout(function() {
                expect(element.css('position')).to.be(originPosition);
                done();
            }, 0);
        });

        it('滚动到元素临界位置', function(done) {
            Fixed(element, setTop);
            $(document).scrollTop(elementTop);
            setTimeout(function() {
                expect(element.css('position')).to.be(ie6?'absolute':'fixed');
                done();
            }, 0);
        });

        it('滚动到元素临界位置多一像素', function(done) {
            Fixed(element, setTop);
            $(document).scrollTop(elementTop+1);
            setTimeout(function() {
                expect(element.css('position')).to.be(ie6?'absolute':'fixed');
                done();
            }, 0);
        });

        it('滚动到元素临界位置多300像素', function(done) {
            Fixed(element, setTop);
            $(document).scrollTop(elementTop+300);
            setTimeout(function() {
                expect(element.css('position')).to.be(ie6?'absolute':'fixed');
                done();
            }, 0);
        });

        it('效率检查', function() {
            Fixed(element, setTop);
            Fixed(element, setTop);
        });

        it('重复绑定', function(done) {
            Fixed(element, setTop);
            Fixed(element, setTop + 100);   // 将无效
            $(document).scrollTop(elementTop + 50);
            setTimeout(function() {
                expect(element.css('position')).to.be(ie6?'absolute':'fixed');
                done();
            }, 0);
        });
    });

});

