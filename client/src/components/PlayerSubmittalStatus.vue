<template>
   <ul>
      <li v-for="player in players" :key="player.id" :class="{ 'submitted': player.hasSubmitted, 'inactive': !player.isActive }" >
         {{ player.name }}
      </li>
   </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export interface PlayerSubmittalStatus {
   id: string;
   name: string;
   hasSubmitted: boolean;
}

export default defineComponent({

   name: '',

   props: {
      players: {
         type: Object as PropType<PlayerSubmittalStatus>,
         required: true,
      },
   },

});
</script>

<style scoped lang="scss">
ul {
   display: flex;
   justify-content: center;
   list-style-type: none;
   margin: 0;
   padding: 0.5em 0;
   border-top: 1px solid #efefef;
}
li {
   margin: 0.5em;
   padding: 0;
   color: #cccccc;
   &.submitted {
      color: #333333;
      font-weight: bold;
   }
   &.inactive {
      text-decoration: line-through wavy;
   }
}
</style>
