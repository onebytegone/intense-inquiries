<template>
   <div>
      <ProgressBar :progress="game.progress"></ProgressBar>
      <div class="content">
         <h1>{{ game.question }}</h1>
         <h3>Answers</h3>
         <ul>
            <li v-for="answer in game.answers" :key="answer.id">
               {{ answer.text }}
            </li>
         </ul>
         <ul class="submitted">
            <li v-for="player in game.playersDone" :key="player.id">
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

   name: 'GameHostVoting',

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
