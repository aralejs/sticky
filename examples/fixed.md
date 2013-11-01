# Fixed

- order: 2

---

Sticky 附带的功能, 能模拟以下 CSS 设置:

```css
#fix {
    position: fixed;
    top: 0;
}
```

````iframe:300
<style>
.help {
    height: 400px;
    background-color: #f3f4f9;
    text-align: center;
}
#fix {
    position: absolute;
    left: 0;
    top: 0;

    width: 100%;
    height: 30px;
    line-height: 30px;

    background: #08c;
    color: #fff;
    z-index: 1;
    text-align: center;
}
</style>

<div class="help"></div>

<div id="fix">Fix Element(top)</div>

<script>
seajs.use(["$", "sticky"], function($, sticky) {
    var st = sticky.fix("#fix");
});
</script>
<div class="help"></div>
````

**注意: 模拟 `position: fixed;` 下设置 `bottom: 0px` 时, 当 window resize 时, 会有定位错误, 慎用! 建议自行找其他实现方式.**



