import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import jwt from 'jwt-simple';
import StrictEventEmitter from 'strict-event-emitter-types';
import { randomBytes } from 'crypto';
import { ClientEvents, ServerEvents, GameStatus } from '../../lib/shared-types';
import getQuestionList from './lib/get-question-list';
import { GameModel } from './models/GameModel';
import { ModelStore } from './models/ModelStore';
import { PlayerModel } from './models/PlayerModel';

const app = express(),
      port = process.env.PORT || 3000, // eslint-disable-line no-process-env
      server = new http.Server(app),
      io = socketio(server),
      secret = randomBytes(256).toString('hex');

app.get('/', (_req, res) => {
   res.json({
      pong: new Date(),
   });
});

server.listen(port, () => {
   // eslint-disable-next-line no-console
   console.log(`Listening on port ${port}`);
});

interface PlayerTokenPayload {
   playerID: string;
   gameID: string;
}

const games = new ModelStore<GameModel>();

function updateAllAssociatedWithGame(game: GameModel): void {
   io.in(game.hostSocketID).emit('gameUpdate', game.renderGameState());
   game.getPlayers().forEach((player) => {
      if (player.socketID) {
         io.in(player.socketID).emit('gameUpdate', game.renderGameState(player));
      }
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

io.on('connection', (socket: StrictEventEmitter<SocketIO.Socket, ClientEvents, ServerEvents>) => {

   socket.use(([ event, data ], next) => {
      const [ game, player ] = findGameAndPlayerAssociatedToSocket(socket.id);

      // eslint-disable-next-line no-console
      console.info(
         `Socket: ${socket.id}`
         + `\t(Game: ${game ? game.id : 'n/a'} Player: ${player ? player.name : 'n/a'})`
         + `\tEvent: ${event}`
         + `\tData: ${JSON.stringify(data)}`
      );
      next();
   });

   socket.on('hostGame', async () => {
      const questions = await getQuestionList(8),
            game = new GameModel(socket.id, questions);

      games.add(game);
      socket.join(game.id);
      updateAllAssociatedWithGame(game);
   });

   socket.on('joinGame', (data, ack) => {
      if (!PlayerModel.is_valid_name(data.name)) {
         ack({ message: `${data.name} is not valid` });
         return;
      }

      const game = games.all().find((g) => { return g.status === GameStatus.Lobby && g.code === data.code; });

      if (!game) {
         ack({ message: `Game ${data.code} is not open for joining` });
         return;
      }

      const player = new PlayerModel(socket.id, data.name),
            success = game.addPlayer(player);

      if (!success) {
         ack({ message: `Game ${data.code} is not open for joining` });
         return;
      }

      const payload: PlayerTokenPayload = { playerID: player.id, gameID: game.id },
            token = jwt.encode(payload, secret, 'HS256');

      ack(undefined, { token });
      socket.join(game.id);
      updateAllAssociatedWithGame(game);
   });

   socket.on('rejoinGame', (data, ack) => {
      let decoded: PlayerTokenPayload;

      try {
         decoded = jwt.decode(data.token, secret, false, 'HS256');
      } catch(e) {
         ack({ message: 'Invalid token' });
         return;
      }

      const game = games.all().find((g) => { return g.status !== GameStatus.Ended && g.id === decoded.gameID; });

      if (!game) {
         ack({ message: 'Game no longer exists' });
         return;
      }

      const player = game.findPlayerWithID(decoded.playerID);

      if (!player) {
         ack({ message: 'Player is not part of the game' });
         return;
      }

      ack();
      if (player.socketID) {
         const oldSocket = io.sockets.connected[player.socketID];

         if (oldSocket) {
            oldSocket.disconnect();
         }
      }
      player.socketID = socket.id;
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

      game.submitVoteForPlayer(player, data.vote);
      await game.step();
      updateAllAssociatedWithGame(game);
   });

   socket.on('disconnecting', () => {
      games.all().forEach((game) => {
         if (game.hostSocketID === socket.id) {
            io.in(game.id).emit('gameEnd');
            games.removeByID(game.id);
         } else {
            const success = game.playerWithSocketIDDisconnected(socket.id);

            if (success) {
               game.step().then(() => {
                  updateAllAssociatedWithGame(game);
               });
            }
         }
      });
   });
});
