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

.container > .dice {
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
