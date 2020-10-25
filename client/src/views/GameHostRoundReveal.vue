<template>
   <div>
      <h1>{{ game.question }}</h1>
      <ul>
         <li v-for="answer in answers" :key="answer.id">
            {{ answer.text }} &mdash; {{ answer.author.name }}
            <font-awesome-icon class="like" icon="heart" v-for="player in answer.favoriteOf" :key="player.id" />
         </li>
      </ul>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import gameService from '../lib/game-service';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { GameStatus } from '../../../lib/shared-types';
library.add(faHeart);

export default defineComponent({

   name: 'GameHostRoundReveal',

   setup: () => {
      return {
         game: gameService.game,

         answers: computed(() => {
            const game = gameService.game.value;

            if (!game || game.status !== GameStatus.Reveal) {
               return;
            }

            return game.answers.sort((a, b) => {
               return b.favoriteOf.length - a.favoriteOf.length;
            });
         }),
      };
   },
});
</script>

<style scoped lang="scss">
.like {
   color: #cf3a3a;
   margin: 0 0.1em;
}
</style>
