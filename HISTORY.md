# 历史

---

## 1.3.1

`tag:fixed` [#19](https://github.com/aralejs/sticky/issues/19), 绑定 window 的 resize 事件

`tag:changed` `destory` -> `destroy`

## 1.3.0

`tag:fixed` [#17](https://github.com/aralejs/sticky/issues/17), 添加 `adjust` 方法用于当元素被动改变位置时, 导致滚动条改变, 从而需要调整当前 sticky 元素状态

`tag:changed` [#18](https://github.com/aralejs/sticky/issues/18), 模拟页面底部 sticky 的需求, 调整 API

## 1.2.1

`tag:improved` 修改 sticky.stick 的默认 marginTop 为 0, fix [#13](https://github.com/aralejs/sticky/issues/13)

`tag:improved` 优化代码结构。

## 1.2.0

`tag:improved` 优化接口, 去除 event 依赖, 增加 callback 参数. 简化两个 position 判断.  [#11](https://github.com/aralejs/sticky/issues/11)


## 1.1.0

`tag:changed` 组件由 `arale/fixed` 改名为 `arale/sticky`。

`tag:changed` 拆分成两个接口 Sticky.stick 和 Sticky.fix 。

`tag:new` [#1](https://github.com/aralejs/sticky/issues/1) 增加 stickd (设置 stick 之后) 和 restored (取消 stick 之后) 两个事件。

`tag:new` [#6](https://github.com/aralejs/sticky/issues/6) 根据需要提供占位元素。

`tag:improved` [#3](https://github.com/aralejs/sticky/issues/3) 判断 IE6 的方式改进。

## 1.0.1

`tag:fixed` 修复了在 IE 下功能失效的问题。

## 1.0.0

`tag:unresolved` IE 下这个组件失效了。

`tag:new` 新建组件。
