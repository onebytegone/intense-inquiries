<template>
   <div>
      <h1 v-if="isWaiting">Waiting...</h1>
      <div v-else>
         <h1>{{ game.question }}</h1>
         <form>
            <input name="answer" v-model="answer" type="text">
            <button :disabled="answer.length === 0" @click.prevent="submitAnswer">Submit</button>
         </form>
      </div>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { GameStatus } from '../../../lib/shared-types';
import gameService from '../lib/game-service';

export default defineComponent({

   name: 'GamePlayerQuestion',

   setup: () => {
      const answer = ref('');

      return {
         answer,
         game: gameService.game,

         submitAnswer: () => {
            gameService.submitAnswer(answer.value);
         },

         isWaiting: computed(() => {
            const game = gameService.game.value;

            if (!game) {
               return;
            }

            const playerID = game.playerID,
                  playersDone = game.status === GameStatus.Question ? game.playersDone : [];

            return !!playersDone.find((player) => {
               return player.id === playerID;
            });
         }),
      };
   },

});
</script>

<style scoped lang="scss">

</style>
