import { v4 as uuid } from 'uuid';
import { GameState, GameStatus } from '../../../lib/shared-types';
import filterUndefined from '../lib/filter-undefined';
import { AnswerModel } from './AnswerModel';
import { ModelStore } from './ModelStore';
import { PlayerModel } from './PlayerModel';

export class GameModel {

   public readonly id: string;
   public readonly hostSocketID: string;
   public readonly code: string;

   private _status: GameStatus;
   private _players = new ModelStore<PlayerModel>();
   private _initialQuestionCount: number;
   private _remainingQuestions: string[];
   private _activeQuestion?: string;
   private _answers = new ModelStore<AnswerModel>('authorID');
   private _playersDoneWithCurrentTask = new Set<string>();

   public constructor(hostSocketID: string, questions: string[]) {
      this.id = uuid();
      this.hostSocketID = hostSocketID;
      this.code = ('0000' + Math.floor(Math.random() * 10000).toString()).slice(-4);
      this._status = GameStatus.Lobby;
      this._remainingQuestions = questions;
      this._initialQuestionCount = questions.length;
   }

   public get status(): GameStatus {
      return this._status;
   }

   public getPlayers(): Readonly<PlayerModel[]> {
      return this._players.all();
   }

   public addPlayer(player: PlayerModel): boolean {
      if (this.status === GameStatus.Lobby) {
         if (this._players.findByProp('socketID', player.socketID) || this._players.findByProp('name', player.name)) {
            return false;
         }

         this._players.add(player);
      }
      return true;
   }

   public findPlayerWithID(playerID: string): PlayerModel | undefined {
      return this._players.findByID(playerID);
   }

   public findPlayerWithSocketID(socketID: string): PlayerModel | undefined {
      return this._players.findByProp('socketID', socketID);
   }

   public playerWithSocketIDDisconnected(socketID: string): boolean {
      const player = this.findPlayerWithSocketID(socketID);

      if (!player) {
         return false;
      }

      if (this.status === GameStatus.Lobby) {
         this._players.removeByID(player.id);
      } else {
         player.socketID = undefined;
      }

      return true;
   }

   public areAllActivePlayersDoneWithCurrentTask(): boolean {
      const playerNotDone = this._players.all()
         .filter((player) => {
            return !!player.socketID;
         })
         .find((player) => {
            return !this._playersDoneWithCurrentTask.has(player.id);
         });

      return playerNotDone === undefined;
   }

   public async step(): Promise<void> {
      if (this.status === GameStatus.Lobby && this.areAllActivePlayersDoneWithCurrentTask() && this._players.size >= 3) {
         this._status = GameStatus.Question;
         this._activeQuestion = this._remainingQuestions.pop();
         this._answers.clear();
         this._playersDoneWithCurrentTask.clear();
      } else if (this.status === GameStatus.Question && this.areAllActivePlayersDoneWithCurrentTask()) {
         this._status = GameStatus.Vote;
         this._playersDoneWithCurrentTask.clear();
      } else if (this.status === GameStatus.Vote && this.areAllActivePlayersDoneWithCurrentTask()) {
         this._status = GameStatus.Reveal;
         this._answers.all().forEach((answer) => {
            const author = this._players.findByID(answer.authorID);

            if (author) {
               author.awardPointsForFavorites(answer.favorited);
            }
         });
         this._playersDoneWithCurrentTask.clear();
      } else if (this.status === GameStatus.Reveal && this.areAllActivePlayersDoneWithCurrentTask()) {
         this._status = GameStatus.Question;
         this._activeQuestion = this._remainingQuestions.pop();
         this._answers.clear();
         this._playersDoneWithCurrentTask.clear();
      } else if (this.status === GameStatus.Reveal && this._remainingQuestions.length === 0) {
         this._status = GameStatus.Ended;
      }
   }

   public submitReadyForPlayer(player: PlayerModel): void {
      this._playersDoneWithCurrentTask.add(player.id);
   }

   public submitAnswerForPlayer(player: PlayerModel, answer: string): void {
      this._playersDoneWithCurrentTask.add(player.id);
      this._answers.add(new AnswerModel(player.id, answer));
   }

   public submitVoteForPlayer(player: PlayerModel, favoriteAnswerID: string): void {
      this._playersDoneWithCurrentTask.add(player.id);
      const favoriteAnswer = this._answers.findByProp('id', favoriteAnswerID);

      if (favoriteAnswer) {
         favoriteAnswer.addFavoriteFrom(player.id);
      }
   }

   public renderGameState(player?: PlayerModel): GameState {
      const baseState = {
         code: this.code,
         playerID: player ? player.id : undefined,
         players: this._players.all().map((p) => {
            return p.renderPlayerData();
         }),
         progress: Math.round((this._initialQuestionCount - this._remainingQuestions.length) / this._initialQuestionCount * 100) / 100,
      };

      const playersReady = [ ...this._playersDoneWithCurrentTask ]
         .map((playerID) => {
            const p = this._players.findByID(playerID);

            return p ? p.renderPlayerData() : undefined;
         })
         .filter(filterUndefined);

      if (this._status === GameStatus.Lobby) {
         return Object.assign({ status: this._status, playersReady }, baseState);
      } else if (this._status === GameStatus.Question) {
         if (!this._activeQuestion) {
            throw new Error('No active question is defined');
         }
         return Object.assign({
            status: this._status,
            question: this._activeQuestion,
            playersDone: this._answers.all()
               .map((answer) => {
                  return this._players.findByID(answer.authorID);
               })
               .filter(filterUndefined),
         }, baseState);
      } else if (this._status === GameStatus.Vote) {
         if (!this._activeQuestion) {
            throw new Error('No active question is defined');
         }

         const answers = player ? this._answers.withoutProp('authorID', player.id) : this._answers.all();

         return Object.assign({
            status: this._status,
            question: this._activeQuestion,
            answers: answers.map((answer) => {
               return answer.renderAnonymousAnswer();
            }),
            playersDone: playersReady,
         }, baseState);
      } else if (this._status === GameStatus.Reveal) {
         if (!this._activeQuestion) {
            throw new Error('No active question is defined');
         }

         return Object.assign({
            status: this._status,
            question: this._activeQuestion,
            answers: this._answers.all()
               .map((answer) => {
                  return answer.renderPlayerAnswerResult(this._players);
               })
               .filter(filterUndefined),
            playersReady,
         }, baseState);
      } else if (this._status === GameStatus.Ended) {
         return Object.assign({ status: this._status }, baseState, {
            players: this._players.all().map((p) => {
               return p.renderLeaderboardData();
            }),
         });
      }

      throw new Error(`Unhandled status ${this._status}`);
   }

}
