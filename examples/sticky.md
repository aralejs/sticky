# Sticky

- order: 1

---

### 设置 top

模拟以下 CSS 设置:

```css
#sticky {
    position: sticky;
    top: 30px;
}
```

````iframe:400
<style>
.help {
    height: 400px;
    background-color: #f3f4f9;
    text-align: center;
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
</style>

<div class="help"></div>

<div id="stick">Sticky Element(top)</div>

<script>
seajs.use(["$", "sticky"], function($, sticky) {
    var st = sticky("#stick", 30, function(status) {
        if (status) {
            window.console && console.log("top stick");
        } else {
            window.console && console.log("top unstick");
        }
    });
});
</script>
<div class="help"></div>
````

### 设置 bottom

模拟以下 CSS 设置:

```css
#sticky {
    position: sticky;
    bottom: 30px;
}
```

````iframe:400
<style>
.help {
    height: 400px;
    background-color: #f3f4f9;
    text-align: center;
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
</style>

<div class="help"></div>

<div id="stick">Sticky Element(bottom)</div>

<script>
seajs.use(["$", "sticky"], function($, sticky) {
    var st = sticky("#stick", { bottom: 30 }, function(status) {
        if (status) {
            window.console && console.log("bottom stick");
        } else {
            window.console && console.log("bottom unstick");
        }
    });
});
</script>
<div class="help"></div>
````



### 设置 top 和 bottom

模拟以下 CSS 设置:

```css
#sticky {
    position: sticky;
    top: 30px;
    bottom: 30px;
}
```

````iframe:400
<style>
.help {
    height: 400px;
    background-color: #f3f4f9;
    text-align: center;
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
</style>

<div class="help"></div>

<div id="stick">Sticky Element(top + bottom)</div>

<script>
seajs.use(["$", "sticky"], function($, sticky) {
    var st = sticky("#stick", { top: 30, bottom: 30 }, function(status) {
        if (status) {
            window.console && console.log("top bottom stick");
        } else {
            window.console && console.log("top bottom unstick");
        }
    });
});
</script>
<div class="help"></div>
````

### 其他元素位置改变或 window resize 时, 手工调整 sticky 状态

````iframe:400
<style>
.help {
    height: 360px;
    background-color: #f3f4f9;
    text-align: center;
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
</style>

<div class="help"></div>

<div id="stick">Sticky Element(top)</div>

<script>
seajs.use(["$", "sticky"], function($, sticky) {
    var st = sticky("#stick", 30, function(status) {
        if (status) {
            window.console && console.log("top stick");
        } else {
            window.console && console.log("top unstick");
        }
    });

    setTimeout(function() {
        $(".help").height(600);

        st.adjust();
    }, 6000);
});
</script>
<div class="help"></div>
````