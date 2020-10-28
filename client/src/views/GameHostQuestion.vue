<template>
   <div class="view">
      <ProgressBar :progress="game.progress"></ProgressBar>
      <div class="content">
         <h3>Question:</h3>
         <h1>{{ game.question }}</h1>
      </div>
      <PlayerSubmittalStatus :players="playerSubmittalStatus"></PlayerSubmittalStatus>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { GameStatus, Player } from '../../../lib/shared-types';
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

         playerSubmittalStatus: computed(() => {
            const game = gameService.game.value;

            if (!game || game.status !== GameStatus.Question) {
               return;
            }

            const playersReady = game.playersDone.map((player) => {
               return player.id;
            });

            return game.players.map((player: Player) => {
               return Object.assign({
                  submitted: playersReady.includes(player.id),
               }, player);
            });
         }),
      };
   },

});
</script>

<style scoped lang="scss">
.view {
   display: flex;
   flex-direction: column;
   min-height: 100vh;
}
</style>
