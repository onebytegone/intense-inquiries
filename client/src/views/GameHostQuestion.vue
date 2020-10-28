<template>
   <div>
      <ProgressBar :progress="game.progress"></ProgressBar>
      <div class="content">
         <h3>Question:</h3>
         <h1>{{ game.question }}</h1>
         <ul class="submitted">
            <li v-for="player in game.players" :key="player.id" :class="{ 'ready': player.ready === true }" >
               {{ player.name }}
            </li>
         </ul>
      </div>
   </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import gameService from '../lib/game-service';
import ProgressBar from '../components/ProgressBar.vue';

export default defineComponent({

   name: 'GameHostQuestion',

   components: {
      ProgressBar,
   },

   setup: () => {
      return {
         game: gameService.game,
      };
   },

});
</script>

<style scoped lang="scss">

</style>
