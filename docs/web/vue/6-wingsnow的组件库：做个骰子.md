# WingSnow的组件库：做个骰子

<img src="https://img.shields.io/badge/vue-3.2-brightgreen">

<div class="demo">
  <Dice class="dice" size="small" :point="point1"/>
  <Dice class="dice" :point="point2" theme="tradition" />
  <Dice class="dice" size="large" :point="point3" theme="nighty" />
  <Dice class="dice" :point="point4" theme="gold" />
  <Dice class="dice" :point="point5" theme="volcano" />
  <Dice class="dice" :point="point6" theme="ocean" />
  <div class="button">
    <CustomButton @click="click" type="primary">掷骰子</CustomButton>
  </div>
</div>

<script setup>
import { ref } from 'vue'

const point1 = ref(1)
const point2 = ref(2)
const point3 = ref(3)
const point4 = ref(4)
const point5 = ref(5)
const point6 = ref(6)

const randomPoint = (preVal) => {
  let newVal
  for(;;) {
    newVal = Math.floor(Math.random() * 6 + 1)
    if (newVal !== preVal) {
      break
    }
  }
  return newVal
}

const click = () => {
  point1.value = randomPoint(point1.value)
  point2.value = randomPoint(point2.value)
  point3.value = randomPoint(point3.value)
  point4.value = randomPoint(point4.value)
  point5.value = randomPoint(point5.value)
  point6.value = randomPoint(point6.value)
}
</script>

<style>
.demo > .dice {
  margin: 20px;
}

.demo > .button {
  margin-top:20px;
  text-align: center;
}

</style>

## 代码

::: details

```vue
<script setup lang="ts">
import { computed } from 'vue'

type ThemeType = 'default' | 'tradition' | 'nighty' | 'gold' | 'volcano' | 'ocean'

type Size = 'small' | 'middle' | 'large'

interface Theme {
  bgColor: string
  itemColor: string
}

const defaultTheme: Record<string, Theme> = {
  default: {
    bgColor: '#fafafa',
    itemColor: '#262626',
  },
  tradition: {
    bgColor: '#fffef8',
    itemColor: '#262626',
  },
  nighty: {
    bgColor: '#191970',
    itemColor: '#b2bbbe',
  },
  gold: {
    bgColor: '#ffd700',
    itemColor: '#874d00',
  },
  volcano: {
    bgColor: '#d4380d',
    itemColor: '#fff2e8',
  },
  ocean: {
    bgColor: '#0050b3',
    itemColor: '#e6f7ff',
  }
}

interface Props {
  point: 1 | 2 | 3 | 4 | 5 | 6
  theme?: ThemeType | Theme
  size?: Size | number
}

const rotateMap = [
  { x: 0, y: 0 },
  { x: 0, y: 90 },
  { x: -90, y: 0 },
  { x: 90, y: 0 },
  { x: 0, y: -90 },
  { x: 0, y: 180 },
]

const props = withDefaults(defineProps<Props>(), {
  theme: 'default',
  size: 'middle',
})

const rotateX = computed(() => {
  return rotateMap[props.point - 1].x
})
const rotateY = computed(() => {
  return rotateMap[props.point - 1].y
})

const bgColor = computed(() => {
  let theme: Theme
  if (typeof props.theme === 'string') {
    theme = defaultTheme[props.theme]
  } else {
    theme = props.theme
  }
  return theme.bgColor
})

const itemColor = computed(() => {
  let theme: Theme
  if (typeof props.theme === 'string') {
    theme = defaultTheme[props.theme]
  } else {
    theme = props.theme
  }
  return theme.itemColor
})

const extraItemColor = computed(() => {
  if (props.theme === 'tradition') {
    return '#f04b22'
  }
  return itemColor.value
})

const diceSize = computed(() => {
  switch (props.size) {
    case 'large':
      return '2rem'
    case 'middle':
      return '1.5rem'
    case 'small':
      return '1rem'
    default:
      return `${props.size}rem`
  }
})

</script>

<template>
  <div
    class="container"
    :style="{
      '--bg-color': bgColor,
      '--item-color': itemColor,
      '--extra-item-color': extraItemColor,
      '--dice-size': diceSize,
    }"
  >
    <div
      class="dice"
      :style="{
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }"
    >
      <div class="box box1">
        <span class="item"></span>
      </div>
      <div class="box box2">
        <span class="item"></span>
        <span class="item"></span>
      </div>
      <div class="box box3">
        <span class="item"></span>
        <span class="item"></span>
        <span class="item"></span>
      </div>
      <div class="box box4">
        <div class="row">
          <span class="item"></span>
          <span class="item"></span>
        </div>
        <div class="row">
          <span class="item"></span>
          <span class="item"></span>
        </div>
      </div>
      <div class="box box5">
        <div class="row">
          <span class="item"></span>
          <span class="item"></span>
        </div>
        <div class="row">
          <span class="item"></span>
        </div>
        <div class="row">
          <span class="item"></span>
          <span class="item"></span>
        </div>
      </div>
      <div class="box box6">
        <div class="row">
          <span class="item"></span>
          <span class="item"></span>
        </div>
        <div class="row">
          <span class="item"></span>
          <span class="item"></span>
        </div>
        <div class="row">
          <span class="item"></span>
          <span class="item"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  font-size: calc(var(--dice-size));
  perspective: 800px;
  perspective-origin: 50% 50%;
  display: inline-block;
}

.dice {
  box-sizing: border-box;
  width: 4em;
  height: 4em;
  margin: 0 auto;
  transform-style: preserve-3d;
  transition: all 1s ease-in-out;
  position: relative;
}

.box {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 5%;
  border-radius: 10%;
  background: var(--bg-color);
  display: flex;
  border: 1px solid var(--item-color);
}

.box1,
.box4 {
  .item {
    background-color: var(--extra-item-color);
  }
}

.item {
  display: inline-block;
  width: 0.9em;
  height: 0.9em;
  border-radius: 50%;
  background: var(--item-color);
}

.box1 {
  justify-content: center;
  align-items: center;
}

.box2 {
  justify-content: space-between;
  .item:nth-child(2) {
    align-self: flex-end;
  }
}

.box3 {
  justify-content: space-between;

  .item:nth-child(2) {
    align-self: center;
  }

  .item:nth-child(3) {
    align-self: flex-end;
  }
}

.box4,
.box5,
.box6 {
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
}

.row {
  display: flex;
  flex-basis: 100%;
  justify-content: space-between;
}

.box5 .row:nth-child(2) {
  justify-content: center;
}

.dice .box1 {
  transform: rotateY(0) translateZ(2em);
}

.dice .box2 {
  transform: rotateY(-90deg) translateZ(2em);
}

.dice .box3 {
  transform: rotateX(90deg) translateZ(2em);
}

.dice .box4 {
  transform: rotateX(-90deg) translateZ(2em);
}

.dice .box5 {
  transform: rotateY(90deg) translateZ(2em);
}

.dice .box6 {
  transform: rotateY(180deg) translateZ(2em);
}
</style>

```

:::

## 使用

### 基础用法

```vue
<Dice :point="1" />
```

### 主题类型

内置六种主题颜色：`default`（默认值）、`tradition`（传统）、`nighty`（夜色）、`gold`（黄金）、`volcano`（火山）、`ocean`（海洋）。

也可以传入对象`{ bgColor: string, itemColor: string }`自定义颜色。

```vue
<Dice :point="4" theme="tradition"/>
<Dice :point="5" theme="nighty"/>
<Dice :point="6" theme="ocean"/>

<Dice :point="1" :theme="{
  bgColor: '#fff',
  itemColor: '#000',
}" />
```

### 骰子尺寸

骰子有大`large`、中`middle`、小`small`三种尺寸。默认为`middle`。

也可以传入`number`自定义尺寸，`large`、`middle`、`small`对应的尺寸值分别为`2`、`1.5`、`1`。

```vue
<Dice :point="6" theme="ocean"/>
```

### API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | :---: | :---: |
| point | 骰子点数 | 1 - 6 | - |
| theme | 主题颜色 | `'default'` \| `'tradition'` \| `'nighty'`\| <br /> `'gold'` \| `'volcano'` \| `'ocean'` \| <br /> `{ bgColor: string, itemColor: string }` | `'default'` |
| size | 骰子尺寸 | `'large'` \| `'middle'` \| `'small'` \| number | `'middle'`
