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
      <PlayerSubmittalStatus :players="playerSubmittalStatus"></PlayerSubmittalStatus>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import gameService from '../lib/game-service';
import ProgressBar from '../components/ProgressBar.vue';
import PlayerSubmittalStatus from '../components/PlayerSubmittalStatus.vue';
import { GameStatus, Player } from '../../../lib/shared-types';

export default defineComponent({

   name: 'GameHostVoting',

   components: {
      PlayerSubmittalStatus,
      ProgressBar,
   },

   setup: () => {
      return {
         game: gameService.game,

         playerSubmittalStatus: computed(() => {
            const game = gameService.game.value;

            if (!game || game.status !== GameStatus.Vote) {
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
