<template>
   <div>
      <h1>{{ game.question }}</h1>
      <h3>Answers</h3>
      <ul>
         <li v-for="answer in game.answers" :key="answer.id">
            {{ answer.text }}
         </li>
      </ul>
      <ul class="submitted">
         <li v-for="player in game.playersDone" :key="player.id">
            {{ player.name }}
         </li>
      </ul>
   </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import gameService from '../lib/game-service';

export default defineComponent({

   name: 'GameHostVoting',

   setup: () => {
      return {
         game: gameService.game,
      };
   },

});
</script>

<style scoped lang="scss">
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
