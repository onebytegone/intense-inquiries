<template>
   <div>
      <component v-bind:is="view"></component>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Welcome from './views/Welcome.vue';
import GameLobby from './views/GameLobby.vue';
import GameHostQuestion from './views/GameHostQuestion.vue';
import GamePlayerQuestion from './views/GamePlayerQuestion.vue';
import GameHostVoting from './views/GameHostVoting.vue';
import GamePlayerVoting from './views/GamePlayerVoting.vue';
import GameHostRoundReveal from './views/GameHostRoundReveal.vue';
import GamePlayerRoundReveal from './views/GamePlayerRoundReveal.vue';
import GameFinalScore from './views/GameFinalScore.vue';
import gameService from './lib/game-service';
import { GameStatus } from '../../lib/shared-types';

const gameStatusHostComponentMapping: Record<GameStatus, string> = {
   [GameStatus.Lobby]: 'GameLobby',
   [GameStatus.Question]: 'GameHostQuestion',
   [GameStatus.Vote]: 'GameHostVoting',
   [GameStatus.Reveal]: 'GameHostRoundReveal',
   [GameStatus.Ended]: 'GameFinalScore',
};

const gameStatusPlayerComponentMapping: Record<GameStatus, string> = {
   [GameStatus.Lobby]: 'GameLobby',
   [GameStatus.Question]: 'GamePlayerQuestion',
   [GameStatus.Vote]: 'GamePlayerVoting',
   [GameStatus.Reveal]: 'GamePlayerRoundReveal',
   [GameStatus.Ended]: 'Welcome',
};

export default defineComponent({

   name: 'App',

   components: {
      Welcome,
      GameLobby,
      GameHostQuestion,
      GamePlayerQuestion,
      GameHostVoting,
      GamePlayerVoting,
      GameHostRoundReveal,
      GamePlayerRoundReveal,
      GameFinalScore,
   },

   setup: () => {
      return {
         view: computed(() => {
            const game = gameService.game.value,
                  isHost = gameService.isHost.value;

            if (game) {
               if (isHost) {
                  return gameStatusHostComponentMapping[game.status];
               }
               return gameStatusPlayerComponentMapping[game.status];

            }

            return 'Welcome';
         }),
      };
   },

});
</script>

<style lang="scss">
#app {
   font-family: Avenir, Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   display: flex;
   justify-content: center;
   color: #263238;
   font-size: 2em;
   margin: 0 1em;
}
.color-green {
   color: #4caf50;
}
form {
   display: flex;
   flex-direction: column;
   input[type=text], label {
      margin: 0.5em 0;
   }
   button {
      margin: 1em 0;
   }
}
input, button {
   font-size: 1em;
}
input {
   padding: 0.2em;
}
button {
   padding: 0.5em 0;
   width: 100%;
   -webkit-appearance: none;
   -moz-appearance: none;
   border: 0;
   border-radius: 4px;
   background-color: #3672ad;
   color: #ffffff;
   font-size: 0.9em;
   &:hover {
      background-color: #214972;
   }
}
h3 {
   color: #9e9e9e;
   margin: 0.5em 0;
}
li {
   margin: 0.25em 0;
}
.submitted {
   display: flex;
   justify-content: center;
   list-style-type: none;
   margin: 0;
   padding: 0;
   li {
      margin: 0.5em;
      padding: 0;
   }
}
</style>