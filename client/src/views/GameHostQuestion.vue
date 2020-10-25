<template>
   <div>
      <h3>Question:</h3>
      <h1>{{ game.question }}</h1>
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

   name: 'GameHostQuestion',

   setup: () => {
      return {
         game: gameService.game,
      };
   },

});
</script>

<style scoped lang="scss">

</style>
