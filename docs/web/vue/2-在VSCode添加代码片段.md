---
sidebarDepth: 3
---
# 在VSCode添加代码片段

## 安装插件

本文使用[Vue VSCode Snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets)这个插件。

### 示例

列举一些根据个人习惯常用的代码片段（Snippets）

#### vbase-3-ts-setup

在单文件组件 (即`*.vue`文件，简称 SFC) 中可用

```vue
<template>
  <div>

  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
```

::: tip

个人习惯是在SFC中按照`<script> <template> <style>`的顺序排列，与插件提供的标准模板略有差异

另外插件没有提供定义样式`lang`的模板（例如`vbase-3-ts-setup-scss`）

:::

#### vfor

在`template`（包括SFC的`template`以及`*.html`文件）中可用

```vue
<div v-for="item in items" :key="item.id">
  {{ item }}
</div>
```

#### vclass

```vue
<div :class="{ className: data }"></div>
```

#### vclass-obj

```vue
<div :class="[classNameA, classNameB]"></div>
```

#### vclass-obj-mult

```vue
<div :class="[classNameA, {classNameB : condition}]"></div>
```

#### vstyle

```vue
<div :style="{ fontSize: data + 'px' }"></div>
```

#### vstyle-obj

```vue
<div :style="[styleObjectA, styleObjectB]"></div>
```

#### vroutename

```vue
<router-link :to="{name: 'name'}">LinkTitle</router-link>
```

#### vroutenameparam

```vue
<router-link :to="{name: 'name', params:{id: 'value'} }">LinkTitle</router-link>
```

#### vroutepath

```vue
<router-link to="path">LinkTitle</router-link>
```

#### v3ref

在`script`（包括SFC的`script`以及`*.js`或`*.ts`文件）中可用

```typescript
const name = ref(initialValue)
```

#### v3reactive

```typescript
const name = reactive({
  count: 0
})
```

#### v3computed

```typescript
const name = computed(() => {
  return 
})
```

#### v3watch

```typescript
watch(() => foo, (newValue, oldValue) => {
  
})
```

#### v3watcheffect

```typescript
watchEffect(() => {
  
})
```

#### v3onmounted

```typescript
onMounted(() => {})
```

## 配置自定义代码片段

如[上文](#vbase-3ts-setup)所述，插件提供的标准模板可能与自己的习惯不同，或者缺少想要的模板，这时候可以自己配置。

可以用以下两个方式进入VSCode的用户代码片段配置界面：

1. Ctrl+Shift+P打开命令面板，输入snippets，选择首选项：配置用户代码片段，然后进行具体的选择（新建代码片段或者修改现有代码片段）
2. 点击左下角齿轮（管理），选择用户代码片段

代码片段的写法可以参考以下资料

::: tip 参考资料

[[VS Code\]跟我一起在Visual Studio Code 添加自定义snippet（代码段），附详细配置 | CSDN](https://blog.csdn.net/maokelong95/article/details/54379046/)

:::

在以下的例子中，前两个代码片段`vbase-3-ts-setup`和`vbase-3-ts-setup-sass`在插件标准模板的基础上进行了微调，调整了`<script>`和`<template>`的顺序，并增加了使用`sass`的版本。

第三个代码片段定义了一个函数注释模板，主要演示代码片段的制表符跳转和占位符功能。

::: details 附录

```json
{
  "vbase-3-ts-setup":{
    "prefix": "vbase-3-ts-setup",
    "scope": "vue",
    "body": [
      "<script setup lang=\"ts\">",
      "  $1",
      "</script>",
      "",
      "<template>",
      "  <div>",
      "    $2",
      "  </div>",
      "</template>",
      "",
      "<style scoped>",
      "$3",
      "</style>",
      "",
    ],
    "description": "Single File component setup Composition API with Typescript",
  },

  "vbase-3-ts-setup-sass":{
    "prefix": "vbase-3-ts-setup",
    "scope": "vue",
    "body": [
      "<script setup lang=\"ts\">",
      "  $1",
      "</script>",
      "",
      "<template>",
      "  <div>",
      "    $2",
      "  </div>",
      "</template>",
      "",
      "<style lang=\"sass\" scoped >",
      "$3",
      "</style>",
      "",
    ],
    "description": "Single File component setup Composition API with Typescript and SASS",
  },

  "cmmbf":{
    "prefix": "cmmbf",
    "scope": "javascript, typescript",
    "body": [
      "/**",
      " * ${1:description}",
      " * @param ${2:first} — ${3:The description for first param}",
      " * @param ${4:second} — ${5:The description for second param}",
      " * @returns — ${6:The description for return}",
      " */",
    ],
    "description": "comment block for function",
  },
}
```

:::
