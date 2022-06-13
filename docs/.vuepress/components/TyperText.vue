<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const TimeoutPromise = async (ms?: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

interface Props {
  texts: string[]
  speed?: number | 'fast' | 'slow'
  loop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  speed: 300,
  loop: false,
})

const curTextId = ref(0)
const curTextPosition = ref(0)
let speed = 300

const cursor = ref('|')

const content = computed(() => {
  return `${props.texts[curTextId.value]
    .slice(0, curTextPosition.value)
    .split('<')
    .join('<br />')}${cursor.value}`
})

const print = () => {
  if (curTextPosition.value < props.texts[curTextId.value].length) {
    curTextPosition.value += 1
  }
}

const printBack = async () => {
  if (curTextPosition.value > 0) {
    await TimeoutPromise(speed / 2)
    curTextPosition.value -= 1
    await printBack()
  }
}

// 模拟电脑光标闪动，0.53秒闪一次
const cursorFlash = () => {
  setTimeout(() => {
    cursor.value = '&nbsp;'
  }, 100)
  setTimeout(() => {
    cursor.value = '|'
  }, 630)
}

const printLoop = async () => {
  // 打字
  await new Promise<void>((resolve) => {
    const printInterval = setInterval(() => {
      print()
      if (curTextPosition.value >= props.texts[curTextId.value].length) {
        clearInterval(printInterval)
        resolve()
      }
    }, speed)
  })
  // 打字结束后光标闪动
  // 设置setInterval前调用一次，立即执行一次，之后定期循环执行
  cursorFlash()
  const cursorFlashInterval = setInterval(cursorFlash, 1060)
  await TimeoutPromise((props.texts[curTextId.value].length - 1) * speed)
  // 切换到下一句或结束循环
  if (curTextId.value < props.texts.length - 1) {
    clearInterval(cursorFlashInterval)
    await printBack()
    curTextId.value += 1
    curTextPosition.value = 0
    printLoop()
  } else if (props.loop) {
    clearInterval(cursorFlashInterval)
    await printBack()
    curTextId.value = 0
    printLoop()
  }
}

onMounted(async () => {
  if (Number.isNaN(Number(props.speed))) {
    if (props.speed === 'fast') {
      speed = 100
    } else if (props.speed === 'slow') {
      speed = 500
    }
  } else {
    speed = Number(props.speed)
  }
  printLoop()
})
</script>

<template>
  <p v-html="content"></p>
</template>
