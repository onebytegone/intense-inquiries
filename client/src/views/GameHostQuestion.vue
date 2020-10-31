<template>
   <div class="view">
      <ProgressBar :progress="game.progress"></ProgressBar>
      <div class="content">
         <h3>Question:</h3>
         <h1>{{ game.question }}</h1>
      </div>
      <PlayerSubmittalStatus :players="game.players"></PlayerSubmittalStatus>
   </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import gameService from '../lib/game-service';
import PlayerSubmittalStatus from '../components/PlayerSubmittalStatus.vue';
import ProgressBar from '../components/ProgressBar.vue';

export default defineComponent({

   name: 'GameHostQuestion',

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
