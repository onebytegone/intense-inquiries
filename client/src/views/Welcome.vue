<template>
   <div>
      <h1>Welcome!</h1>
      <form>
         <label for="name">Your Name</label>
         <input name="name" v-model="name" type="text" maxlength="12">
         <label for="gameCode">Game Code</label>
         <input name="gameCode" v-model="gameCode" type="text" maxlength="4">
         <button :disabled="!canJoinGame" @click.prevent="joinGame">Join Game</button>
         <hr>
         <button @click.prevent="hostGame">Host Game</button>
      </form>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import gameService from '../lib/game-service';

export default defineComponent({

   name: 'Welcome',

   setup: () => {
      const name = ref(''),
            gameCode = ref('');

      return {
         name,
         gameCode,

         hostGame: () => {
            gameService.hostGame();
         },

         canJoinGame: computed(() => {
            return !!name.value && !!gameCode.value;
         }),
         joinGame: () => {
            gameService.joinGame(name.value, gameCode.value);
         },
      };
   },

});
</script>

<style scoped lang="scss">
hr {
   width: 100%;
   margin: 1em 0;
}
</style>
