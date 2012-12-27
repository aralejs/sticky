# fixed

---

实现侧边栏跟随滚动的效果，当滚动条滚动到一定距离时，指定区域变为 fixed 效果开始跟随页面。

例如 [brunch.io](http://brunch.io/) 和 [bootstrap](http://twitter.github.com/bootstrap/getting-started.html) 页面左边侧边栏的效果，或着请看 [演示](/fixed/examples/)。

相似组件：[博客侧边栏跟随滚动效果](http://www.neoease.com/sidebar-follow-scrolling-section/) 。

实现原理是在除 IE6 外其他浏览器使用 `position: fixed`，对 IE6 进行 js 模拟。

---

## 使用说明

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
