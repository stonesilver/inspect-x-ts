<template>
  <h1 title="welcome" class="text-white text-3xl font-bold">Welcome to Inspection X</h1>
  <h1 title="welcome" class="text-white text-sm mt-1">Click start to begin</h1>
  <button @click="$emit('next')" class="mt-12 rounded-lg border border-white h-16 w-52 text-lg font-bold">Start</button>
</template>

<script setup lang="ts">
defineComponent({
  name: 'Welcome'
})
defineEmits(['next'])
</script>

<style scoped>

</style>