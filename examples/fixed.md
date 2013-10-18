# Fixed

- order: 2

---

### 设置 top

模拟以下 CSS 设置:

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
### 设置 bottom

模拟以下 CSS 设置:

```css
#fix {
    position: fixed;
    bottom: 0;
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
    bottom: 0;

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

<div id="fix">Fix Element(bottom)</div>

<script>
seajs.use(["$", "sticky"], function($, sticky) {
    var st = sticky.fix("#fix");
});
</script>
<div class="help"></div>
````



