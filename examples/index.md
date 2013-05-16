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
#stick {
    background: #08c;
    color: #fff;
    width: 300px;
    height: 40px;

    line-height: 40px;
    z-index: 1;
    text-align: center;
}
#nav, #gotop, #bottom {
    position: absolute;
    height: 30px;
    line-height: 30px;
    background: #08c;
    color: #fff;
    z-index: 10;
    text-align: center;
}
#gotop {
    top: 800px;
    right: 10px;
    width: 80px;
}
#nav {
    left: 0;
    top: 0;
    width: 100%;

}
#bottom {
    width: 100%;
    left: 0;
    bottom: 0;
}
</style>

<div class="help">撑高度的元素。</div>

<div id="stick">跟随滚动的测试元素。</div>


````javascript
seajs.use(["$", "sticky"], function($, sticky) {
    // sticky
    sticky.stick({
        element: "#stick",
        marginTop: 30
    }).on("stick", function(e) {
        seajs.log("stick");
    }).on("restored", function(e) {
        seajs.log("restored");
    }).render();

    // fixed
    $('<div id="gotop">回到顶部</div>').appendTo("body");
    sticky.fix({
        element: "#gotop"
    }).on("fixed", function(e) {
        seajs.log("fixed");
    }).on("restored", function(e) {
        seajs.log("restored");
    }).render();

    $('<div id="nav">顶层fixed导航</div>').appendTo("body");
    sticky.fix({
        element: "#nav"
    }).render();

    $('<div id="bottom">footer fixed</div>').appendTo("body");
    sticky.fix({
        element: "#bottom"
    }).render();
});
````
    
<div class="help" style="height: 1500px; line-height: 1500px;">撑高度的元素。</div>
