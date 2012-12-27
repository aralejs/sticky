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
#test {
    background: #08c;
    color: #fff;
    width: 300px;
    height: 40px;
    line-height: 40px;
    z-index: 1;
    text-align: center;    
}
</style>

<div class="help">撑高度的元素。</div>

<div id="test">跟随滚动的测试元素。</div>


````javascript
seajs.use('fixed', function(Fixed){
    Fixed('#test', 30);
});
````
    
<div class="help" style="height: 1500px; line-height: 1500px;">撑高度的元素。</div>
