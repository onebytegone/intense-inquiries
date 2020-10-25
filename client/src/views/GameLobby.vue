<template>
   <div>
      <h3>Game Code</h3>
      <h1>{{ game.code }}</h1>
      <h3>Players</h3>
      <ul>
         <li v-for="player in game.players" :key="player.name">
            {{ player.name }}
         </li>
         <li v-show="game.players.length === 0">
            No players yet :(
         </li>
      </ul>
      <button :disabled="isReady" v-show="!isHost" @click.prevent="submitReady">Ready</button>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { GameStatus } from '../../../lib/shared-types';
import gameService from '../lib/game-service';

export default defineComponent({

   name: 'GameLobby',

   setup: () => {
      return {
         isHost: gameService.isHost,
         game: gameService.game,

         isReady: computed(() => {
            const game = gameService.game.value;

            if (!game) {
               return;
            }

            const playerID = game.playerID,
                  playersReady = game.status === GameStatus.Lobby ? game.playersReady : [];

            return !!playersReady.find((player) => {
               return player.id === playerID;
            });
         }),
         submitReady: () => {
            gameService.submitReady();
         },
      };
   },

});
</script>

<style scoped lang="scss">
h1 {
   margin-top: 0;
   margin-bottom: 0.5em;
}
</style>
