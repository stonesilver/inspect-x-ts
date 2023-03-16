<template>
  <h1 title="welcome" class="text-white text-3xl font-bold">Welcome to Inspection X</h1>
  <h1 title="welcome" class="text-white text-sm">Click start to begin</h1>
  <button class="mt-12 rounded-lg border border-white h-16 w-52 text-lg font-bold">Start</button>
</template>

<script setup lang="ts">
import {useInspection} from "~/store/inspection";

defineComponent({
  name: 'Welcome'
})
</script>

<style scoped>

</style>