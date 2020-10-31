<template>
   <div class="progress-bar">
      <div class="progress" :style="{ width: (progress * 100) + '%' }"></div>
   </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({

   name: 'ProgressBar',

   props: {
      progress: {
         type: Number,
      },
   },

});
</script>

<style scoped lang="scss">
.progress-bar {
   margin-bottom: 1em;
   width: 100%;
}
.progress {
   background-color: #3672ad;
   height: 0.5em;
   transition: width 1s ease-in-out;
}
</style>
