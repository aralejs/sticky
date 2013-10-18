# 演示文档

---

滚动看效果。

<style>
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

<div class="help">撑高度的元素。</div>
<div class="help">撑高度的元素。</div>

<div id="bottom">跟随滚动的测试元素(bottom)</div>

````javascript
seajs.use(["$", "sticky"], function($, sticky) {
    // sticky
    var st = sticky("#stick", 30, function(status) {
        if (status) {
            console.log("stick");
        } else {
            console.log("unstick");
        }
    });

    setTimeout(function() {
        $('.help').height(800);

        st.adjust();
    }, 6000);


    var st1 = sticky("#bottom", {
        top: 10,
        bottom: 10
    }, function(status) {
        if (status) {
            console.log("bottom stick");
        } else {
            console.log("bottom unstick");
        }
    });

    // fixed
    $('<div id="gotop">回到顶部</div>').appendTo("body");
    //sticky.fix("#gotop");

    $('<div id="nav">顶层fixed导航</div>').appendTo("body");
    //sticky.fix("#nav");
});
````
<div class="help" style="height: 800px; line-height: 800px;">撑高度的元素。</div>


