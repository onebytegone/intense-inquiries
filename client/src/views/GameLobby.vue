<template>
   <div class="content">
      <h3>Game Code</h3>
      <h1>{{ game.code }}</h1>
      <h3>Players</h3>
      <ul>
         <li v-for="player in game.players" :key="player.name">
            {{ player.name }}
            <font-awesome-icon class="color-green" icon="check-circle" v-if="player.hasSubmitted" />
         </li>
         <li v-show="game.players.length === 0">
            No players yet :(
         </li>
      </ul>
      <button :disabled="game.player?.hasSubmitted" v-show="game.player" @click.prevent="submitReady">Ready</button>
   </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
