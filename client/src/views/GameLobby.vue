<template>
   <div class="content">
      <h3>Game Code</h3>
      <h1>{{ game.code }}</h1>
      <h3>Players</h3>
      <ul>
         <li v-for="player in players" :key="player.name">
            {{ player.name }}
            <font-awesome-icon class="color-green" icon="check-circle" v-if="player.ready" />
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
import { GameStatus, Player } from '../../../lib/shared-types';
import gameService from '../lib/game-service';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
library.add(faCheckCircle);

export default defineComponent({

   name: 'GameLobby',

   setup: () => {
      return {
         isHost: gameService.isHost,
         game: gameService.game,

         players: computed(() => {
            const game = gameService.game.value;

            if (!game || game.status !== GameStatus.Lobby) {
               return;
            }

            const playersReady = game.playersReady.map((player) => {
               return player.id;
            });

            return game.players.map((player: Player) => {
               return Object.assign({
                  ready: playersReady.includes(player.id),
               }, player);
            });
         }),

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
