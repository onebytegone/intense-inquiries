<template>
   <div class="content">
      <h1 v-if="game.player.hasSubmitted">Waiting...</h1>
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
import { defineComponent, ref } from 'vue';
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
      };
   },

});
</script>

<style scoped lang="scss">

</style>
