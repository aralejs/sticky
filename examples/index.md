# 基本使用

- order: 1

---

滚动看效果。

<style>
#content {
    position: static;
}

.help {
    height: 300px;
    background-color: #f3f4f9;
    text-align: center;
    line-height: 300px;
}
#stick, #bottom {
    background: #08c;
    color: #fff;
    width: 300px;
    height: 40px;

    line-height: 40px;
    z-index: 1;
    text-align: center;
}
#nav, #gotop {
    position: absolute;
    height: 30px;
    line-height: 30px;
    background: #08c;
    color: #fff;
    z-index: 10;
    text-align: center;
}
#gotop {
    bottom: 50px;
    right: 10px;
    width: 80px;
}
#nav {
    left: 0;
    top: 0;
    width: 100%;
}
</style>

<div class="help">撑高度的元素。</div>

<div id="stick">跟随滚动的测试元素(top)</div>

````javascript
seajs.use(["jquery", "index"], function($, sticky) {
    // sticky
    var st = sticky("#stick", 30, function(status) {
        if (status) {
            window.console && console.log("stick");
        } else {
            window.console && console.log("unstick");
        }
    });

    // fixed
    $('<div id="nav">顶层fixed导航</div>').appendTo("body");
    sticky.fix("#nav");
});
````
<div class="help" style="height: 800px; line-height: 800px;">撑高度的元素。</div>


