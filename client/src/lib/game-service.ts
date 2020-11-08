import { computed, ref } from 'vue';
import io from 'socket.io-client';
import StrictEventEmitter from 'strict-event-emitter-types';
import { ClientEvents, GameState, ServerEvents, PlayerVote } from '../../../lib/shared-types';

// TODO: shouldn't need the "as StrictEventEmitter<...>" hammer. However without it, TS
// complains with: Types of parameters 'event' and 'event' are incompatible. Type 'typeof
// assignmentCompatibilityHack' is not assignable to type 'string'. ts(2322)
// eslint-disable-next-line no-process-env
const socket = io(process.env.VUE_APP_SERVER_URL) as StrictEventEmitter<SocketIOClient.Socket, ServerEvents, ClientEvents>;

const game = ref<GameState | null>(null),
      isWaiting = ref(true);

socket.on('connect', () => {
   const playerToken = localStorage.getItem('playerToken');

   if (!playerToken) {
      isWaiting.value = false;
      return;
   }

   socket.emit('rejoinGame', { token: playerToken }, (err) => {
      if (err) {
         localStorage.removeItem('playerToken');
      }
      isWaiting.value = false;
   });
});

socket.on('disconnect', (reason) => {
   if (reason === 'io server disconnect') {
      socket.connect();
   }

   isWaiting.value = true;
   game.value = null;
});

socket.on('gameUpdate', (data) => {
   game.value = data;
});

socket.on('gameEnd', () => {
   game.value = null;
   localStorage.removeItem('playerToken');
});

const exposed = {

   isHost: computed(() => {
      return game.value ? game.value.player === undefined : false;
   }),

   game,
   isWaiting,

   hostGame: () => {
      socket.emit('hostGame');
   },

   joinGame: (name: string, code: string) => {
      socket.emit('joinGame', { name, code }, (_err, data) => {
         if (data) {
            localStorage.setItem('playerToken', data.token);
         }
      });
   },

   submitAnswer: (answer: string) => {
      socket.emit('submitAnswer', { answer });
   },

   submitVote: (vote: PlayerVote) => {
      socket.emit('submitVote', { vote });
   },

   submitReady: () => {
      socket.emit('submitReady');
   },

};

export default exposed;
