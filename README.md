# Sticky

---

[![Build Status](https://travis-ci.org/aralejs/sticky.png?branch=master)](https://travis-ci.org/aralejs/sticky)
[![Coverage Status](https://coveralls.io/repos/aralejs/sticky/badge.png?branch=master)](https://coveralls.io/r/aralejs/sticky)

实现侧边栏跟随滚动的效果，当滚动条滚动到一定距离时，指定区域变为 sticky 效果开始跟随页面。

例如 [brunch.io](http://brunch.io/) 和 [bootstrap](http://twitter.github.com/bootstrap/getting-started.html) 页面左边侧边栏的效果，或着请看 [演示](/sticky/examples/)。

实现原理是支持 `position: sticky` 的直接使用 CSS 实现, 不支持的浏览器(除 IE6 外)使用 `position: fixed`，对 IE6 进行 js 模拟。

> 原 `arale/fixed` 改名为 `arale/sticky`，原有的调用方式见下文。

---

## 使用说明 `1.1.0`

### Sticky.stick(element, marginTop)

```javascript
seajs.use(["$", "sticky"], function($, sticky) {
    sticky.stick("#stick", 30).on("stick", function(e) {
        seajs.log("stick");
    }).on("restored", function(e) {
        seajs.log("restored");
    }).render();
});
````

`element` 是指需要跟随滚动的目标元素，接受 jQuery selector 对象。

`marginTop` 指当元素距离当前可视窗口顶部的距离等于这个值时，开始触发跟随状态。

> 注意: 当 `marginTop` 设置的值超过元素本身在文档中的高度时, 就变为全局 fixed 效果。


### Sticky.fixed(element)

```javascript
seajs.use(["$", "sticky"], function($, sticky) {
    $('<div id="gotop">回到顶部</div>').appendTo("body");
    sticky.fix("#gotop");

    $('<div id="nav">顶层 fixed 导航</div>').appendTo("body");
    sticky.fix("#nav");

    $('<div id="bottom">footer fixed</div>').appendTo("body");
    sticky.fix("#bottom");
});
```

`element` 是指需要 fixed 的目标元素，接受 jQuery selector 对象。

> 注意: 1) 请自行设置元素的 `left, top` 等 CSS 属性。
>      2) **Sticky 对某些情况下的元素会向 DOM 中插入占位元素, 所以务必在 DOM ready 之后初始化该组件**

## 使用说明 `1.0.1`

这是一个工具模块，只提供一个接收两个参数的方法`Fixed`。

### Fixed(element, marginTop)

```js
seajs.use('fixed', function(fixed){
    Fixed('#test', 30);
});
```

`element` 是指需要跟随滚动的目标元素，接受 jQuery selector 对象。

`marginTop` 指当元素距离当前可视窗口顶部的距离等于这个值时，开始触发跟随 fixed 状态。

当把第二个参数设置的特别大时，这基本上就是一个 js 的全局 Fixed 解决方案。

```js
seajs.use('fixed', function(fixed){
    Fixed('#test', 20000);
});
```
