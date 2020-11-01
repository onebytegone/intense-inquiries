<template>
   <div class="content">
      <h1 v-if="game.player.hasSubmitted">Waiting...</h1>
      <div v-else>
         <h1>{{ game.question }}</h1>
         <form>
            <h3>Favorite answer:</h3>
            <div class="answer-row" v-for="answer in game.answers" :key="answer.id">
               <input type="radio" :id="answer.id" name="favorite" :value="answer.id" v-model="favorite">
               <label :for="answer.id">{{ answer.text }}</label>
            </div>
            <button :disabled="!canSubmit" @click.prevent="submitVote">Submit</button>
         </form>
      </div>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import gameService from '../lib/game-service';

export default defineComponent({

   name: 'GamePlayerVoting',

   setup: () => {
      const favorite = ref<string>('');

      return {
         game: gameService.game,
         favorite,

         canSubmit: computed(() => {
            return !!favorite.value;
         }),
         submitVote: () => {
            gameService.submitVote(favorite.value);
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
</style>
