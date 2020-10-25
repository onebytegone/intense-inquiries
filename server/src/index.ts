import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import { ClientEvents, ServerEvents, GameStatus } from '../../lib/shared-types';
import getQuestionList from './lib/get-question-list';
import { GameModel } from './models/GameModel';
import { ModelStore } from './models/ModelStore';
import { PlayerModel } from './models/PlayerModel';

const app = express(),
      port = process.env.PORT || 3000,
      server = new http.Server(app),
      io = socketio(server) as TypedServer<ServerEvents>;

app.get('/', (_req, res) => {
   res.json({
      pong: new Date(),
   });
});

server.listen(port, () => {
   // eslint-disable-next-line no-console
   console.log(`Listening on port ${port}`);
});

interface TypedServer<T extends Record<string | symbol, any>> extends socketio.Server {
   in(room: string): TypedNamespace<T>;
}

interface TypedNamespace<T extends Record<string | symbol, any>> extends socketio.Namespace {
   emit<K extends keyof T>(event: K, args: T[K]): boolean;
}

interface TypedSocket<T extends Record<string | symbol, any>, U extends Record<string | symbol, any>> extends socketio.Socket {
   on<K extends keyof T>(name: K, listener: (v: T[K]) => void): this;
   emit<K extends keyof U>(event: K, args: U[K]): boolean;
}

const games = new ModelStore<GameModel>();

function updateAllAssociatedWithGame(game: GameModel): void {
   io.in(game.hostSocketID).emit('gameUpdate', game.renderGameState());
   game.getPlayers().forEach((player) => {
      io.in(player.socketID).emit('gameUpdate', game.renderGameState(player));
   });

   if (game.status === GameStatus.Ended) {
      games.removeByID(game.id);
   }
}

function findGameAndPlayerAssociatedToSocket(socketID: string): [ GameModel | undefined, PlayerModel | undefined ] {
   for (let game of games.all()) {
      const player = game.findPlayerWithSocketID(socketID);

      if (player) {
         return [ game, player ];
      }
   }

   return [ undefined, undefined ];
}

io.on('connection', (socket: TypedSocket<ClientEvents, ServerEvents>) => {
   socket.on('hostGame', async () => {
      const questions = await getQuestionList(1),
            game = new GameModel(socket.id, questions);

      games.add(game);
      socket.join(game.id);
      updateAllAssociatedWithGame(game);
   });

   socket.on('joinGame', (data) => {
      if (!PlayerModel.is_valid_name(data.name)) {
         return;
      }

      const game = games.all().find((g) => { return g.status === GameStatus.Lobby && g.code === data.code; });

      if (!game) {
         return;
      }

      // TODO: Don't allow duplicate player names
      game.addPlayer(new PlayerModel(socket.id, data.name));
      socket.join(game.id);
      updateAllAssociatedWithGame(game);
   });

   socket.on('submitReady', async () => {
      const [ game, player ] = findGameAndPlayerAssociatedToSocket(socket.id);

      if (!game || !player) {
         return;
      }

      game.submitReadyForPlayer(player);
      await game.step();
      updateAllAssociatedWithGame(game);
   });

   socket.on('submitAnswer', async (data) => {
      const [ game, player ] = findGameAndPlayerAssociatedToSocket(socket.id);

      if (!game || !player) {
         return;
      }

      game.submitAnswerForPlayer(player, data.answer);
      await game.step();
      updateAllAssociatedWithGame(game);
   });

   socket.on('submitVote', async (data) => {
      const [ game, player ] = findGameAndPlayerAssociatedToSocket(socket.id);

      if (!game || !player) {
         return;
      }

      game.submitVoteForPlayer(player, data.favorite);
      await game.step();
      updateAllAssociatedWithGame(game);
   });

   socket.on('disconnecting', () => {
      games.all().forEach((game) => {
         if (game.hostSocketID === socket.id) {
            io.in(game.id).emit('gameEnd', {});
            games.removeByID(game.id);
         } else {
            const success = game.removePlayerWithSocketID(socket.id);

            if (success) {
               updateAllAssociatedWithGame(game);
            }
         }
      });
   });
});
