define(function (require) {

    //mocha.setup({ignoreLeaks: true});

    var expect = require('expect');
    var Sticky = require('sticky');
    var $ = require('$');
    var element = null;
    var setTop = 50;
    var elementTop;

    var doc = $(document),
        isPositionStickySupported = (function () {
            var stickyPrefix = ["-webkit-", "-ms-", "-o-", "-moz-", ""],
                container = doc[0].body;

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

                container.removeChild(el);
                return isSupported;
            }

            return null;
        })(),
        isPositionFixedSupported = (function () {
            var positionfixed = false;

            new function () {
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
            };
            return positionfixed;
        })();


    describe('Sticky.fix', function () {
        beforeEach(function () {
            $('body').css('height', '2000px');
            element = $('<div>test</div>');
            element.appendTo('body');
        });

        afterEach(function () {
            element.remove();
            element = null;
            $('body').css('height', '');
            $(document).off('scroll');
            $(document).scrollTop(0);
        });

        it('fixed 元素, 滚动 500 像素', function (done) {
            var oldTop = element.offset().top;

            var obj = Sticky.fix(element);

            $(document).scrollTop(500);

            setTimeout(function () {

                expect(element.css('position')).to.be(isPositionFixedSupported ? 'fixed' : 'absolute');
                expect(element.offset().top).to.be(oldTop + 500);
                expect(element.next().attr("id").indexOf("arale_fixed_placeholder_")).to.be(0);
                done();

                obj.destory();
            }, 10);
        });
        it('不需要占位符的 fixed 元素', function (done) {
            element.css("float", "left");

            var obj = Sticky.fix(element);
            $(document).scrollTop(500);

            setTimeout(function () {
                expect(element.next().length).to.be(0);
                done();
                obj.destory();
            }, 10);

        });

        it('重复绑定', function (done) {
            var obj1 = Sticky.fix(element);

            var obj2 = Sticky.fix(element);

            $(document).scrollTop(500);

            setTimeout(function () {
                expect(element.data("bind-fixed")).to.be(true);
                expect(obj2).to.be(undefined);
                done();

                obj1.destory();
            }, 10);
        });
    });

    describe('Sticky.stick', function () {
        beforeEach(function () {
            $('body').css('height', '2000px');
            element = $('<div>test</div>');
            element.appendTo('body');
            elementTop = element.offset().top - setTop;
        });

        afterEach(function () {
            element.remove();
            element = null;
            $('body').css('height', '');
            $(document).off('scroll');
            $(document).scrollTop(0);
        });

        it('滚动了一像素', function (done) {
            var originPosition = element.css('position');
            var obj = Sticky.stick(element, setTop).render();
            $(document).scrollTop(1);

            setTimeout(function () {
                if (isPositionStickySupported) {
                    expect(element.css('position').indexOf("sticky") !== -1).to.be(true);
                } else {
                    expect(element.css('position')).to.be(originPosition);
                }
                done();
                obj.destory();
            }, 10);
        });

        it('滚动到差一像素', function (done) {
            var originPosition = element.css('position');
            var obj = Sticky.stick(element, setTop).render();
            $(document).scrollTop(elementTop - 1);

            setTimeout(function () {
                if (isPositionStickySupported) {
                    expect(element.css('position').indexOf("sticky") !== -1).to.be(true);
                } else {
                    expect(element.css('position')).to.be(originPosition);
                }
                done();
                obj.destory();
            }, 10);
        });

        it('滚动到元素临界位置', function (done) {
            var obj = Sticky.stick(element, setTop).render();
            $(document).scrollTop(elementTop);

            setTimeout(function () {
                if (isPositionStickySupported) {
                    expect(element.css('position').indexOf("sticky") !== -1).to.be(true);
                } else if (isPositionFixedSupported) {
                    expect(element.css('position')).to.be("fixed");
                } else {
                    expect(element.css('position')).to.be("absolute");
                }
                done();
                obj.destory();
            }, 10);
        });

        it('滚动到元素临界位置多一像素', function (done) {
            var obj = Sticky.stick(element, setTop).render();
            $(document).scrollTop(elementTop + 1);

            setTimeout(function () {
                if (isPositionStickySupported) {
                    expect(element.css('position').indexOf("sticky") !== -1).to.be(true);
                } else if (isPositionFixedSupported) {
                    expect(element.css('position')).to.be("fixed");
                } else {
                    expect(element.css('position')).to.be("absolute");
                }
                done();
                obj.destory();
            }, 10);

        });

        it('滚动到元素临界位置多300像素', function (done) {
            var obj = Sticky.stick(element, setTop).render();
            $(document).scrollTop(elementTop + 300);

            setTimeout(function () {
                if (isPositionStickySupported) {
                    expect(element.css('position').indexOf("sticky") !== -1).to.be(true);
                } else if (isPositionFixedSupported) {
                    expect(element.css('position')).to.be("fixed");
                } else {
                    expect(element.css('position')).to.be("absolute");
                }
                done();
                obj.destory();
            }, 10);
        });

        it('stick/restored 事件触发', function (done) {
            var triggered = 0;

            var obj = Sticky.stick(element, setTop).on("stick",function () {
                    triggered = 1;
                }).on("restored",function () {
                    triggered = 2;
                }).render();

            $(document).scrollTop(elementTop);

            setTimeout(function () {
                expect(triggered).to.be(1);
                $(document).scrollTop(0);

                setTimeout(function () {
                    expect(triggered).to.be(2);
                    done();
                    obj.destory();
                }, 10);
            }, 10);
        });

        it('重复绑定', function (done) {
            var triggered = 0;

            var obj1 = Sticky.stick(element, setTop);
            obj1.on("stick",function () {
                    triggered = 1;
                }).render();
            var obj2 = Sticky.stick(element, setTop);
            obj2.on("stick",function () {
                    triggered = 2;
                }).render();

            $(document).scrollTop(elementTop);

            setTimeout(function () {
                expect(triggered).to.be(1);

                done();

                obj1.destory();
                obj2.destory();
            }, 10);
        });
    });

});

