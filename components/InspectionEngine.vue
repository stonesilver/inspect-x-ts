<template>
  <div class="flex-1 flex items-center w-full relative">
    <!--  video  -->
    <video id="video" playsinline class="lg:h-screen h-full w-full min-w-screen px-0 mx-0">
      Video stream not available.
    </video>

    <!-- Snap Btn -->
    <div class="absolute flex justify-center bottom-16 w-full">
      <div class="w-[65px] h-[65px] rounded-full bg-white flex justify-center items-center">
        <div class="w-[60px] h-[60px] rounded-full bg-white border border-slate-500"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useInspection} from "~/store/inspection";

defineComponent({
  name: 'InspectionEngine',
})

const inspection = useInspection()

onMounted(() => {
  inspection.startInspectionEngine()
})
</script>

<style scoped>

</style>