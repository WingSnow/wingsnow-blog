---
order: 6
date: 2022-08-22
category:
  - 代码笔记
  - Vue笔记
tag:
  - Web
  - Vue
description: 本文介绍在使用 Typescript 时， 如何定义一个支持类型推断的组件引用实例。
---

# vue 组件带类型推断的 ref 写法

当我们需要在父组件中获取子组件实例时，可以通过在父组件中使用 ref 给子组件注册应用信息，然后通过 ref 访问子组件暴露的属性或方法。

但是在使用 Typescript 的时候，直接用`ref(ChildComponent)`会无法推测`childComponent`的类型信息，虽然能用也不会报错，但是通过引用获取到的属性和方法都是 any 类型的。

以下写法明确 ref 的类型：

```ts
import ChildComponent from './ChildComponent.vue'

const childrenRef = ref<InstanceType<typeof ChildComponent>>()
```

这样在使用 childrenRef 的时候就有类型提示了。

但是因为 childrenRef 可能为 undefined，使用时要用可选链`?`或非空断言`!`。