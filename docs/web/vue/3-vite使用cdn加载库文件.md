# vite 使用 cdn 加载库文件

## 创建项目

新建一个 vite 项目，并且完整引入 antd 。

```bash
npm create vite vite-build-demo
cd vite-build-demo
npm i
npm i ant-design-vue
```

```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)

app.use(Antd)

app.mount('#app')
```

```vue
<template>
<div>
  <a-space>
    <a-button type="primary">Primary Button</a-button>
    <a-button>Default Button</a-button>
    <a-button type="dashed">Dashed Button</a-button>
    <a-button type="danger">Danger Button</a-button>
    <a-button type="text">Text Button</a-button>
    <a-button type="link">Link Button</a-button>
  </a-space>
  
  <div>
    <a-button type="primary" @click="count++">count is: {{ count }}</a-button>
  </div>
  
  </div>
</template>
```

```bash
npm run dev
```

## 直接打包

```bash
npm run build
```

结果如下

```bash
dist/assets/logo.03d6d6da.png    6.69 KiB
dist/index.html                  0.42 KiB
dist/assets/index.6eaa3366.css   607.21 KiB / gzip: 69.10 KiB
dist/assets/index.51c34651.js    1113.16 KiB / gzip: 345.44 KiB
```

明显可以看到`index.js`和`index.css`过大，这是因为把`ant-design-vue`的所有组件代码和样式文件都打包进去了。

## 引入分析工具——rollup-plugin-visualizer

```bash
npm i -D rollup-plugin-visualizer
```

修改`vite.config.ts`添加配置

```typescript{4,10}
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import visualizer from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer()
  ]
})
```

再次执行打包后，会在项目根目录生成`stats.html`文件，可以快速查看每个包在最终打包体积中的占比。

## 使用 rollup-plugin-external-globals 插件

接下来通过配置`rollup`（`vite`使用`rollup`来打包）来实现 antd 使用 cdn 加载。

根据这篇[文章](https://blog.craftyun.cn/post/228.html)，不能直接配置`rollup`的`output.globals`选项，需要使用插件。

### 安装插件

```bash
npm i -D rollup-plugin-external-globals
```

### 添加配置

配置`vite.config.ts`

```typescript{5,13-22}
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import visualizer from 'rollup-plugin-visualizer'
import externalGlobals from 'rollup-plugin-external-globals'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer()
  ],
  build: {
    rollupOptions: {
      external: ['ant-design-vue'],
      plugins: [
        externalGlobals({
          "ant-design-vue": "antd",
        }),
      ],
    },
  },
})
```

参数对解释：

- `ant-design-vue` - 这里需要和`external`对应，这个字符串就是`(import xxx from aaa)`中的`aaa`，也就是包的名字

- `antd` - 这个是js文件导出的全局变量的名字，比如说`vue`就是`Vue`，`ant-design-vue`就是`antd`，查看源码或者参考作者文档可以获得

### 引入静态文件

删除`main.ts`中原来 import 的**样式**

```typescript{4}
import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
// - import 'ant-design-vue/dist/antd.css'

const app = createApp(App)

app.use(Antd)

app.mount('#app')
```

修改根目录下的index.html，引入cdn文件

```html
<link rel="stylesheet" href="https://unpkg.com/ant-design-vue@3.2.4/dist/antd.min.css">
<script src="https://unpkg.com/dayjs@1.11.2/dayjs.min.js"></script>
<script src="https://unpkg.com/ant-design-vue@3.2.4/dist/antd.min.js"></script>
```

::: tip
根据antdv的[官方文档](https://www.antdv.com/docs/vue/introduce-cn#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BC%95%E5%85%A5)，引入`antd.js`前需要自行引入`dayjs`。
:::

## 重新打包

```bash
npm run build
```

结果如下

```bash
dist/assets/logo.03d6d6da.png    6.69 KiB
dist/index.html                  0.72 KiB
dist/assets/index.68b37ec5.css   0.20 KiB / gzip: 0.17 KiB
dist/assets/index.6c1a0271.js    52.91 KiB / gzip: 21.24 KiB
```

可以看到作为一个demo，`index.js`还是过大了。

通过查看分析文件`stats.html`，可以看到绝大部分都是`vue`占用的体积。

参照上面的步骤，将vue也通过cdn的方式引入。

## 最终效果

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import visualizer from 'rollup-plugin-visualizer'
import externalGlobals from 'rollup-plugin-external-globals'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer()
  ],
  build: {
    rollupOptions: {
      external: ['vue', 'ant-design-vue'],
      plugins: [
        externalGlobals({
          "vue": "Vue",
          "ant-design-vue": "antd",
        }),
      ],
    },
  },
})
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://unpkg.com/ant-design-vue@3.2.4/dist/antd.min.css">
    <script src="https://unpkg.com/vue@3.2.36/dist/vue.global.prod.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.2/dayjs.min.js"></script>
    <script src="https://unpkg.com/ant-design-vue@3.2.4/dist/antd.min.js"></script>
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

打包后大小如下：

```bash
dist/assets/logo.03d6d6da.png    6.69 KiB
dist/index.html                  0.72 KiB
dist/assets/index.c45942b9.js    2.26 KiB / gzip: 0.95 KiB
dist/assets/index.68b37ec5.css   0.20 KiB / gzip: 0.17 KiB
```

打包速度和打包后文件大小都有了大幅提升。

使用`npm run preview`预览打包结果，效果与开发时运行的一致。
