---
order: 7
date: 2022-08-22
category:
  - 代码笔记
  - Vue笔记
tag:
  - Web
  - Vue
  - Vite
description: 本文介绍如何在 vite 项目中使用 ionicons。
---

# Vite 使用 ionicons

在 ionicons 的[官方文档](https://ionic.io/ionicons/usage)中，对于不使用ionic框架的情况，建议使用cdn的方式引入。

> 第二行是为了兼容不支持module的浏览器，不考虑兼容的话不用加

``` html
<script type="module" src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/6.0.2/ionicons/ionicons.esm.min.js"></script>
<script nomodule src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/6.0.2/ionicons.min.js"></script>
```

::: details 吐槽
ionicons的官方上版本号还是5.5.2，但是npm上包版本都到6.0.2了。

根据github上的[更新指南](https://github.com/ionic-team/ionicons/releases/tag/v6.0.0)，对大多数开发者来说没有影响。所以用新不用旧。
:::

对于 vite 项目，cdn的引入自然是要放在`./index.html`中。

然后就可以使用：

```html
<ion-icon name="logo-ionic"></ion-icon>
```

现在图标可以正常显示了。但是如果你打开调试工具，会发现如下报错：

```plain
[Vue warn]: Failed to resolve component: ion-icon
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement. 
  at <ParentCompoent> 
  at <App>
```

这是因为 vue 无法解析`ion-icon`这个组件。其实提示也给出解决方案了，要配置`compilerOptions.isCustomElement`。

在 vite <Badge type="tip" text="^2.9.x" vertical="middle" />中，`compilerOptions.isCustomElement`要这么配：

在`vite.config.ts`中

```typescript{7-11}
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('ion-')
        }
      }
    }),
  ],
})
```