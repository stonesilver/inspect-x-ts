<template>
  <div class="bg-slate-900 flex-1 flex flex-col justify-center items-center">
    <Welcome @next="nextStep" v-if="step === 0"/>
    <InspectionEngine @next="nextStep" v-if="step === 1"/>
  </div>
</template>
<script setup lang="ts">
import Welcome from "~/components/Welcome.vue";
import InspectionEngine from "~/components/InspectionEngine.vue";

const step = ref<number>(0)

const nextStep: () => void = () => {
  step.value = step.value + 1
}
</script>