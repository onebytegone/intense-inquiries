<template>
   <div>
      <h1>Look at the host screen!</h1>
      <button @click.prevent="submitReady">Continue</button>
   </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import gameService from '../lib/game-service';

export default defineComponent({

   name: 'LookAtHost',

   setup: () => {
      return {
         submitReady: () => {
            gameService.submitReady();
         },
      };
   },

});
</script>

<style scoped lang="scss">

</style>
