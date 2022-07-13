<script setup lang="ts">


const props = withDefaults(defineProps<{
  type?: 'default' | 'primary'
}>(), {
  type: 'default',
})

</script>

<template>
  <button type="button" :class="type" class="button" >
    <slot />
  </button>
</template>

<style scoped>
.button {
  cursor: pointer;
  font-size: 1rem;
  line-height: 2rem;
  margin-right: 0.5rem;
  margin-bottom: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid;
  padding: 0.25rem 1rem;
}

.default {
  color: #000000d9;
  background-color: #fff;
  border-color: #d9d9d9;
}

.default:hover,
.default:focus {
  color: #40a9ff;
  border-color: #40a9ff;
}

.primary {
  color: #fff;
  background-color: #1890ff;
  border-color: #40a9ff;
}

.primary:hover,
.primary:focus {
  background-color: #40a9ff;
}

.button:active {
  box-shadow: 0px 1px 2px -2px rgba(0 0 0 / 0.16),
    0px 3px 6px 0px rgba(0 0 0 / 0.12),
    0px 5px 	12px 4px rgba(0 0 0 / 0.09);
}

</style>