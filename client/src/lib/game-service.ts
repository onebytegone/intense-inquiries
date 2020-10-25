import { computed, ref } from 'vue';
import io from 'socket.io-client';
import { ClientEvents, GameState, ServerEvents } from '../../../lib/shared-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TypedSocketClient<T extends Record<string | symbol, any>, U extends Record<string | symbol, any>> extends SocketIOClient.Socket {
   on<K extends keyof T>(name: K, listener: (v: T[K]) => void): this;
   emit<K extends keyof U>(event: K, args: U[K]): TypedSocketClient<T, U>;
}

const socket = io('http://localhost:3000') as TypedSocketClient<ServerEvents, ClientEvents>;

const game = ref<GameState | null>(null);

socket.on('connect', () => {
   game.value = null;
});

socket.on('gameUpdate', (data) => {
   game.value = data;
});

socket.on('gameEnd', () => {
   game.value = null;
});

const exposed = {

   isHost: computed(() => {
      return game.value ? game.value.playerID === undefined : false;
   }),

   game,

   state: computed(() => {
      if (game.value === null) {
         return 'noGame';
      }

      return 'waitingForPlayers';
   }),

   hostGame: () => {
      socket.emit('hostGame', {});
   },

   joinGame: (name: string, code: string) => {
      socket.emit('joinGame', { name, code });
   },

   submitAnswer: (answer: string) => {
      socket.emit('submitAnswer', { answer });
   },

   submitVote: (favorite: string) => {
      socket.emit('submitVote', { favorite });
   },

   submitReady: () => {
      socket.emit('submitReady', {});
   },

};

export default exposed;
