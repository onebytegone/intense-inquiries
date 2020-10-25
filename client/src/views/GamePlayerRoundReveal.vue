<template>
   <div>
      <h1 v-if="isWaiting">Waiting...</h1>
      <div v-else>
         <h1>Look at the host screen!</h1>
         <button @click.prevent="submitReady">Continue</button>
      </div>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { GameStatus } from '../../../lib/shared-types';
import gameService from '../lib/game-service';

export default defineComponent({

   name: 'GamePlayerRoundReveal',

   setup: () => {
      return {
         isWaiting: computed(() => {
            const game = gameService.game.value;

            if (!game) {
               return;
            }

            const playerID = game.playerID,
                  playersReady = game.status === GameStatus.Reveal ? game.playersReady : [];

            return !!playersReady.find((player) => {
               return player.id === playerID;
            });
         }),

         submitReady: () => {
            gameService.submitReady();
         },
      };
   },

});
</script>

<style scoped lang="scss">

</style>
