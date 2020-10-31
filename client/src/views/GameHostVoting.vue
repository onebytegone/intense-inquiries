<template>
   <div class="view">
      <ProgressBar :progress="game.progress"></ProgressBar>
      <div class="content">
         <h1>{{ game.question }}</h1>
         <h3>Answers</h3>
         <ul>
            <li v-for="answer in game.answers" :key="answer.id">
               {{ answer.text }}
            </li>
         </ul>
      </div>
      <PlayerSubmittalStatus :players="game.players"></PlayerSubmittalStatus>
   </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import gameService from '../lib/game-service';
import ProgressBar from '../components/ProgressBar.vue';
import PlayerSubmittalStatus from '../components/PlayerSubmittalStatus.vue';

export default defineComponent({

   name: 'GameHostVoting',

   components: {
      PlayerSubmittalStatus,
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
