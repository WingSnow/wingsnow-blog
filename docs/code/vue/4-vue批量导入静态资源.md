---
order: 4
date: 2022-07-06
category:
  - 代码笔记
  - Vue笔记
tag:
  - Web
  - Vue
  - Vite
description: 本文介绍在 vite 项目中如何导入静态资源。
---
# Vue 批量导入静态资源

::: warning

本文基于 Vite 3。与 Vite 2 的区别是`import.meta.glob`的配置项不同以及弃用了`import.meta.globEager`。

:::

## 获取静态资源的URL

在 vite 项目中需要使用的静态资源可以分成两类：

1. 需要被源码引用的资源
2. 不需要被源码引用的资源

### 不需要被源码引用

首先介绍第二种。

不被源码引用，意味着资源只应该放在`index.html`或者`<template></template>`中。

::: warning
不被源码引用意味着也不会出现在`<template />`的**文本插值**或者**指令**中。
:::

这类资源应该放在指定的`public`目录下，并且使用根绝对路径引入。例如`public/favicon.ico`，应该使用`/favicon.ico`访问。

在打包时，`public`目录内的资源会被完整复制到目标目录的根目录下（这也是为什么路径中不能包含`/public`），并且会根据 vite 的`base`配置项修改实际的路径。

::: tip 举个例子
对于`base`配置为`/vue/`的情况，
文件`public/logo.png`在源文件中使用`/logo.png`访问

```vue
<img src="/logo.png" />
```

在使用开发服务器运行（vite）时，渲染结果为

```vue
<img src="/logo.png" />
```

在构建后预览时，渲染结果为

```html
<img src="/vue/logo.png" />
```

:::

不需要被源码引用的资源**也可以**不放在`public`目录下，但是写法以及渲染的结果都不同。例如`/src/assets/logo.png`，应该使用相对路径（如`./assets/logo.png`）访问。

::: tip 静态资源放在`src`目录内
对于`base`配置为`/vue/`的情况，比较`public/logo-a.png`和`src/assets/logo-b.png`

在源文件（文件在`src`目录下）中

```vue
<img src="/logo-a.png" />
<img src="./assets/logo-b.png" />
```

在使用开发服务器运行（vite）时，渲染结果为

```vue
<img src="/logo-a.png" />
<img src="/vue/src/assets/logo-b.png" />
```

在构建后预览时，渲染结果为

```html
<img src="/vue/logo-a.png" />
<img src="/vue/assets/logo-b.png" />
```

:::

### 需要被源码引用

需要被源码引用的情况则复杂一些。

最简单的场景，可以使用`import`引入资源。

```typescript
import imgUrl from './img.png'

document.getElementById('hero-img').src = imgUrl
```

import 静态资源通常会得到一个 URL（它会在开发时和生产构建时进行正确的路径转换）；如果要得到引入资源的内容，可以使用`?raw`后缀声明。

```typescript
import url from '../assets/text.txt'
// url: '/src/assets/text.txt'

import text from '../assets/text.txt?raw'
// text: 'Hello World'
```

json 文件比较特殊，默认会将 json 文件作为对象导入。可以通过加`?raw`后缀得到文本，或者加`?url`得到 URL（如果要获得一个导入的 js 或 ts 文件的文本内容或者 URL，也可以这么处理）。

```typescript
import json from '../assets/config.json'
// json: Object{foo: 'bar'}
import jsonRaw from '../assets/config.json?raw'
/**
 *  jsonRaw: 
 * '{
 *   "foo": "bar"
 *  }'
 */ 
import jsonUrl from '../assets/config.json?url'
// jsonUrl: '/src/assets/config.url'
```

但是在某些场景，以上方法不适用。例如要实现一个下面这样的组件：

```vue
<!-- /src/components/Pic.vue -->

<script setup lang="ts">
defineProps<{
  url: string
}>()
</script>

<template>
  <img :src="url" />
</template>
```

当需要引用内部资源时，以上组件将**无法正常工作**。

因为无论是运行时还是构建后，都会使用 url 的原始值来渲染。即使用来访问`public`目录下的资源，当`base`不为默认值时也会出现异常。

如果内部资源比较少，可以在组件中 import 全部资源，然后使用 Map 等数据结构将 prop 转换成对应的引入。

但是如果内部资源很多时显然不能这么做，而且每次增加资源都要修改组件。

正确的做法是使用`new URL(url, import.meta.url)`得到一个被完整解析的静态资源URL。

```vue
<!-- /src/components/Pic.vue -->

<script setup lang="ts">
import { computed } from 'vue';

// url必须是 /src/assets 目录下的文件名
const props = defineProps<{
  url: string
}>()

const imgUrl = computed(() => {
  const str = props.url
  const importUrl = new URL(`../assets/${str}`, import.meta.url).href
  return importUrl
})
</script>

<template>
  <img :src="imgUrl" />
</template>
```

然后使用方式和渲染结果如下：

```html
<!-- 使用 -->
<pic :url="logo.png" ></pic>

<!-- 运行时 -->
<img src="http://localhost:5173/vue/src/assets/logo.png">

<!--  -->
<img src="http://localhost:4173/vue/assets/logo.03d6d6da.png">
```

需要注意的是，关于 vite 中`new URL(url, import.meta.url)`的用法，先看[官方文档](https://cn.vitejs.dev/guide/assets.html#new-url-url-import-meta-url)，其中提到"在生产构建时，Vite 才会进行必要的转换保证 URL 在打包和资源哈希后仍指向正确的地址。"

对于上面的例子，构建后会生成以下代码：

```javascript
var Xl = "/vue/assets/logo-vite.d5a2af01.png",
  Zl = "/vue/assets/logo-vue.ca95ce9d.png",
  Ql = "/vue/assets/logo.03d6d6da.png",
const eo = ["src"],
  to = Xs({
    __name: "Pic",
    props: { url: null },
    setup(e) {
      const t = e,
        n = gr(() => {
          const s = t.url;
          return new URL(
            {
              "../assets/logo-vite.png": Xl,
              "../assets/logo-vue.png": Zl,
              "../assets/logo.png": Ql,
            }[`../assets/${s}`],
            self.location
          ).href;
        });
      return (s, r) => (ur(), ar("img", { src: js(n) }, null, 8, eo));
    },
  });
```

可以看出，实际上 vite 是将根据`new URL()`的第一个参数，将符合条件的资源全部打包（无论实际上是否会用到）并记录正确的打包后地址，之后在使用根据传入的真实参数来访问对应的地址，然后结合`self.location`得到资源的绝对路径。

所以可以得出两个结论：

1. 项目需要使用的静态资源要在打包时就提供，打包之后再在`assets`目录下添加的资源是无法访问的；
2. 在官方文档中也提到，`new URL()`的第一个参数必须是可以让 vite 知道要打包哪些文件的。例如：

```typescript
// 需要打包assets目录下的所有文件
new URL(`../assets/${url}`, import.meta.url)

// 需要打包assets目录下的所有png文件
new URL(`../assets/${url}.png`, import.meta.url)


// 需要打包src目录下的所有jpg文件
// 不能写成`new URL(`/src/**/${url}.jpg`)`，那样虽然可以打包，但是字符串模板无法构成正确的索引
new URL(`/src/${path}/${url}.jpg`, import.meta.url)

// vite无法处理
new URL(url, import.meta.url)
```

## Glob导入

Vite 提供了一个特殊的函数`import.meta.globa`来支持批量导入。

[官方文档](https://cn.vitejs.dev/guide/features.html#glob-import)

```typescript
const modules = import.meta.glob('./dir/*.js')
// 等价于（Vite会在生成时进行转换）
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js')
}
```

::: tip
在Vite 3中，`import.meta.glob`的`key`总是相对于当前模块的。

```javascript
// 文件：/foo/index.js
const modules = import.meta.glob('../foo/*.js')
// 转换为：
const modules = {
  './bar.js': () => {}
}
```

:::

与上面提到的`new URL(url, import.meta.url)`一样，对象的索引会根据匹配的文件清单自动生成。在该例子中，`dir`目录下有`foo.js`和`bar.js`两个js文件。

在该模式下，匹配到的文件默认是懒加载的，通过动态导入实现，并会在构建时分离为独立的 chunk。如果你倾向于直接引入所有的模块（例如依赖于这些模块中的副作用首先被应用），你可以传入 { eagar: true } 作为第二个参数：

```typescript
const modules = import.meta.glob('./dir/*.js', { eager: true })
// 等价于
import * as __glob__0_0 from './dir/foo.js'
import * as __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1
}
```

::: warning
Vite2 的`import.meta.globEager()`方法已弃用。
:::

根据上面的等价代码，可以这样访问导入的模块：

```typescript
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

对于图片之类的媒体资源，使用 import 导入时，实际上要获取的是它的默认导出（default），所以可以使用`mod.default`访问，或者利用`import`选项。

```typescript
const modules = import.meta.glob('../assets/*', { import: 'default', eager: true })
```

利用`import`选项，也可以实现具名导入，例如`import.meta.glob('./dir/*.js', { import: 'setup' })`

此外，上面提到的导入路径后缀`?raw`和`?url`也可以作为选项`as`传入。

```typescript
import.meta.glob('./assets', { as : 'raw' })
```

所以，在使用 glob 的时候，上面组件的例子可以改成：

```vue{13-15}
<!-- /src/components/Pic.vue -->

<script setup lang="ts">
import { computed } from 'vue';

// url必须是 /src/assets 目录下的文件名
const props = defineProps<{
  url: string
}>()

const imgUrl = computed(() => {
  const str = props.url
  const modules = import.meta.glob('../assets/*', { import: 'default', eager: true })
  const importUrl = modules[`../assets/${str}`]
  return importUrl as string ?? undefined
})
</script>

<template>
  <img :src="imgUrl" />
</template>
```

根据上面的原理，可以实现一个批量导入`assets`目录下的所有 png 图片并显示的组件：

```vue
<!-- /src/components/Gallery.vue -->

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const images = ref<string[]>([])

onMounted(() => {
  const modules = import.meta.glob('../assets/*.png', { import: 'default', eager: true })
  for (const path in modules) {
    images.value.push(modules[path] as string)
  }
})
</script>

<template>
  <img v-for="item in images" :src="item" height="150"/>
</template>
```

或者自己造一个自动导入组件的轮子。

> 之所以说是轮子，是因为该需求可以通过Ant Fu的 [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) 实现

```typescript
// 插件，自动导入`components`目录下的.vue文件并注册为全局组件
// /src/utils/autoImport.ts

import { App, defineAsyncComponent, type AsyncComponentLoader } from 'vue'

export default {
  install: (app: App<Element>) => {
    const componentModules = import.meta.glob('../components/*.vue')
    console.log(componentModules)
    for(const path in componentModules) {
      const fileName = path.match(/[^/]+(?=.vue)/)![0]
      const component = defineAsyncComponent(componentModules[path] as AsyncComponentLoader)
      app.component(fileName, component)
    }
  }
}

// 使用
// /src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import autoImport from './utils/autoImport'

createApp(App)
.use(autoImport)
.mount('#app')

```
