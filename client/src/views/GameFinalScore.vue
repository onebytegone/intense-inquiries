<template>
   <div class="content">
      <h1>Final Score:</h1>
      <ol>
         <li v-for="player in game.players.sort((a, b) => b.score - a.score)" :key="player.id">
            {{ player.name }} ({{ player.score }})
         </li>
      </ol>
      <button @click.prevent="done">Play again</button>
   </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import gameService from '../lib/game-service';

export default defineComponent({

   name: 'GameFinalScore',

   setup: () => {
      return {
         game: gameService.game,
         done: () => {
            gameService.game.value = null;
         },
      };
   },

});
</script>

<style scoped lang="scss">

</style>
