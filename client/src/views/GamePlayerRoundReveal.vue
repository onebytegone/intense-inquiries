<template>
   <div class="content">
      <h1 v-if="game.player.hasSubmitted">Waiting...</h1>
      <div v-else>
         <h1>Look at the host screen!</h1>
         <button @click.prevent="submitReady">Continue</button>
      </div>
   </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import gameService from '../lib/game-service';

export default defineComponent({

   name: 'GamePlayerRoundReveal',

   setup: () => {
      return {
         game: gameService.game,
         submitReady: () => {
            gameService.submitReady();
         },
      };
   },

});
</script>

<style scoped lang="scss">

</style>
