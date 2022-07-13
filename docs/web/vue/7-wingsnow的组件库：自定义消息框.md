# WingSnow的组件库：自定义消息框

<img src="https://img.shields.io/badge/vue-3.2-brightgreen">

<Teleport to="body">
  <PopAlter :messages="messages" :removeMessage="removeMessage" />
</Teleport>

<script setup>
import { ref, createApp } from 'vue'

const messages = ref([])

const removeMessage = (item) => {
  const index = messages.value.indexOf(item)
  if (index >= 0) {
    messages.value.splice(index,1)
  }
}

const showMessage = async (message) => {
  await new Promise((resolve) => {
    if (message.duration === 0) {
      const preClickHandler = message.onClick
      message.onClick = () => {
        if (preClickHandler) {
          preClickHandler()
        }
        resolve()
        // 先执行回调函数，然后再移除消息
        setTimeout(() => {
          removeMessage(message)
        })
      }
    }
    else {
      setTimeout(() => {
        resolve()
        setTimeout(() => {
          removeMessage(message)
        })
      }, message.duration * 1000)
    }
    messages.value.push(message)
  })
}

const message = {
  info: (content, duration, onClick) => showMessage({
    key: Symbol(),
    content,
    duration: duration ?? 3,
    type: 'info',
    onClick,
  }),
  warning: (content, duration, onClick) => showMessage({
    key: Symbol(),
    content,
    duration: duration ?? 3,
    type: 'warning',
    onClick,
  }),
  error: (content, duration, onClick) => showMessage({
    ckey: Symbol(),
    content,
    duration: duration ?? 3,
    type: 'error',
    onClick,
  }),
  success: (content, duration, onClick) => showMessage({
    key: Symbol(),
    content,
    duration: duration ?? 3,
    type: 'success',
    onClick,
  }),
}

</script>

## 代码

::: details

`popAlter/types.d.ts`

```typescript
export interface Message {
  key: string | number | symbol
  content: string
  duration: number
  type: 'info' | 'warning' | 'error' | 'success'
  onClick?: (...args:any) => any
}
```

`popAlter/PopAlter.vue`

```vue
<script setup lang="ts">
import { type Message } from './types'

const props = defineProps<{
  messages: Message[],
}>()

const onClick = (message: Message) => {
  if (message.onClick) {
    message.onClick(message)
  }
}

</script>

<template>
  <div class="message">
    <TransitionGroup name="fade-list">
      <div v-for="message in messages" :key="message.key" class="message-notice">
        <div class="message-notice-content" :class="message.type" @click="onClick(message)">
          {{ message.content }}
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.message {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: #000000d9;
  position: fixed;
  font-size: 1rem;
  top: 0.5rem;
  left: 0;
  z-index: 1000;
  width: 100%;
  text-align: center;
}

.message .message-notice {
  width: 100%;
}

.message .message-notice .message-notice-content {
  border-radius: 0.25rem;
  display: inline-block;
  padding: 0.5rem 1rem;
  margin: 0.25rem auto;
  box-shadow: 0px 6px 16px -8px #00000014,
    0px 9px 28px 0px #0000000d,
    0px 12px 	48px 16px #00000008;
  margin-right: 10px;
}

.message-notice-content.info {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
}

.message-notice-content.warning {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
}

.message-notice-content.error {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
}

.message-notice-content.success {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
}

.fade-list-enter-from,
.fade-list-leave-to {
  opacity: 0;
  transform: translateY(-0.75rem);
}

.fade-list-enter-active {
  transition: all 0.4s ease;
}

.fade-list-move, 
.fade-list-leave-active {
  transition: all 0.6s ease;
}

.fade-list-leave-active {
  position: absolute;
}
</style>
```

`popAlter/index.ts`

```typescript
import { createApp, ref } from 'vue'
import PopAlter from './PopAlter.vue'
import { type Message } from './types'

const messages = ref<Message[]>([])

const removeMessage = (message: Message) => {
  const index = messages.value.indexOf(message)
  if (index >= 0) {
    messages.value.splice(index,1)
  }
}

const showMessage = async (message: Message) => {
  await new Promise<void>((resolve) => {
    if (message.duration === 0) {
      const preClickHandler = message.onClick
      message.onClick = () => {
        if (preClickHandler) {
          preClickHandler()
        }
        resolve()
        // 先执行回调函数，然后再移除消息
        setTimeout(() => {
          removeMessage(message)
        })
      }
    }
    else {
      setTimeout(() => {
        resolve()
        setTimeout(() => {
          removeMessage(message)
        })
      }, message.duration * 1000)
    }
    messages.value.push(message)
  })
}

/**
 * 展示全局提示信息
 * @param content 提示内容
 * @param duration 自动关闭的延时，单位秒。默认为 3 秒，设为 0 时不自动关闭。
 * @param onClose 关闭时触发的回调函数
 * @example
 * ```js
 * message.info('Hello World')
 * ```
 */
export const message = {
  info: (content: string, duration?: number, onClick?: (...args: any) => any) => showMessage({
    key: Symbol(),
    content,
    duration: duration ?? 3,
    type: 'info',
    onClick,
  }),
  warning: (content: string, duration?: number, onClick?: (...args: any) => any) => showMessage({
    key: Symbol(),
    content,
    duration: duration ?? 3,
    type: 'warning',
    onClick,
  }),
  error: (content: string, duration?: number, onClick?: (...args: any) => any) => showMessage({
    key: Symbol(),
    content,
    duration: duration ?? 3,
    type: 'error',
    onClick,
  }),
  success: (content: string, duration?: number, onClick?: (...args: any) => any) => showMessage({
    key: Symbol(),
    content,
    duration: duration ?? 3,
    type: 'success',
    onClick,
  }),
}

const mountNode = document.createElement('div')
document.body.appendChild(mountNode)
const messageApp = createApp(PopAlter, {
  messages: messages.value
})
messageApp.mount(mountNode)
```

:::

## 使用

### 普通提示

<CustomButton @click="message.info('This is an normal message')" type="primary">Info</CustomButton>

```typescript
import { message } from './popAlter'

message.info('This is a normal message')
```

### 提示类型

<CustomButton @click="message.info('This is an info message')" >Info</CustomButton>
<CustomButton @click="message.warning('This is a warning message')" >Warning</CustomButton>
<CustomButton @click="message.error('This is an error message')" >Error</CustomButton>
<CustomButton @click="message.success('This is a success message')" >Success</CustomButton>

包括信息、成功、失败、警告

```typescript
import { message } from './popAlter'

message.info('This is an info message')
message.success('This is a success message')
message.error('This is an error message')
message.warning('This is a warning message')
```

### Prmomise 接口

<CustomButton @click="message.info('Action in progress..').then(() => message.info('Loading finished')).then(() => message.success('Loading finished is finished'))">Display a sequence of message</CustomButton>

返回一个 Promise，可以通过 then 或 await 在关闭后运行 callback。以下用例将在每个 message 将要结束时显示新的 message

```typescript
import { message } from './popAlter'

await message.info('Action in progress..')
await message.info('Loading finished')
await message.success('Loading finished is finished')
```

### 延时关闭

<CustomButton @click="message.success('This is a prompt message for success, and it will disappear in 10 seconds', 10)">Customized display duration</CustomButton>

自动关闭的延时，单位秒。默认时长`3s`，设为`0`时不自动关闭

```typescript
import { message } from './popAlter'

await message.info('This is a prompt message for success, and it will disappear in 10 seconds', 10)
```

### 点击回调

<CustomButton @click="message.info('Click this message to close', 0, () => {
  message.success('message clicked')
})">Clickable Message</CustomButton>

消息设为不自动关闭时，默认点击关闭。以下用例点击关闭消息并显示新的消息

```typescript
import { message } from './popAlter'

message.info('Click this message to close', 0, () => {
  message.success('message clicked')
})
```

### API

组件提供了一些静态方法，使用方式和参数如下：

- `message.success(content, duration, onClick)`
- `message.error(content, duration, onClick)`
- `message.info(content, duration, onClick)`
- `message.warning(content, duration, onClick)`

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | :---: | :---: |
| content | 提示内容 | string | - |
| duration | 自动关闭的延时，单位秒。设为 0 时不自动关闭。 | number | 3 |
| onClick | 点击时触发的回调函数 | function | - |

上述方法返回 Promise。
