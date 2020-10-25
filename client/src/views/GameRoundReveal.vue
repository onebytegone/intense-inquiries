<template>
   <div>
      <h1>{{ game.question }}</h1>
      <ul>
         <li v-for="answer in game.answers" :key="answer.id">
            {{ answer.text }} &mdash; {{ answer.author.name }} {{ answer.favoriteOf.map(() => { return '&hearts;'; }).join(' ') }}
         </li>
      </ul>
   </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import gameService from '../lib/game-service';

export default defineComponent({

   name: 'GameRoundReveal',

   setup: () => {
      return {
         game: gameService.game,
      };
   },
});
</script>

<style scoped lang="scss">

</style>
