<template>
   <div class="content">
      <h1 v-if="game.player.hasSubmitted">Waiting...</h1>
      <div v-else>
         <h1>{{ game.question }}</h1>
         <form>
            <fieldset>
               <legend>Favorite answer:</legend>
               <div class="answer-row" v-for="answer in game.answers" :key="answer.id">
                  <input type="radio" :id="'favorite-' + answer.id" name="favorite" :value="answer.id" v-model="favorite">
                  <label :for="'favorite-' + answer.id">{{ answer.text }}</label>
               </div>
            </fieldset>
            <fieldset>
               <legend>What did {{ playerToGuess.name }} say?</legend>
               <div class="answer-row" v-for="answer in game.answers" :key="answer.id">
                  <input type="radio" :id="'who-said-' + answer.id" name="guess" :value="answer.id" v-model="guess">
                  <label :for="'who-said-' + answer.id">{{ answer.text }}</label>
               </div>
            </fieldset>
            <button :disabled="!canSubmit" @click.prevent="submitVote">Submit</button>
         </form>
      </div>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { GameStatus } from '../../../lib/shared-types';
import gameService from '../lib/game-service';

export default defineComponent({

   name: 'GamePlayerVoting',

   setup: () => {
      const favorite = ref<string>(''),
            guess = ref<string>(''),
            seed = Math.random();

      const playerToGuess = computed(() => {
         const game = gameService.game.value;

         if (!game || game.status !== GameStatus.Vote) {
            return undefined;
         }

         return game.authors[Math.floor(game.authors.length * seed)];
      });

      return {
         game: gameService.game,
         favorite,
         guess,
         playerToGuess,

         canSubmit: computed(() => {
            return !!favorite.value && !!guess.value;
         }),

         submitVote: () => {
            if (!playerToGuess.value) {
               throw Error('playerToGuess is unset');
            }

            gameService.submitVote({
               favoriteAnswerID: favorite.value,
               attribution: [
                  {
                     playerID: playerToGuess.value.id,
                     answerID: guess.value,
                  },
               ],
            });
         },
      };
   },

});
</script>

<style scoped lang="scss">
.answer-row {
   display: flex;
   align-items: center;
   input[type=radio] {
      transform: scale(2);
      margin: 0.5em;
   }
}
fieldset {
   border: none;
   margin: 0.5em 0;
}
legend {
   padding: 0;
   color: #9e9e9e;
   font-weight: bold;
}
</style>
