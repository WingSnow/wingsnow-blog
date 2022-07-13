<script setup lang="ts">
interface Message {
  key: string | number | symbol
  content: string
  duration: number
  type: 'info' | 'warning' | 'error' | 'success'
  onClick?: (...args:any) => any
}

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