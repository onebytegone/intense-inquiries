export interface Player {
   id: string;
   name: string;
}

export interface LeaderboardPlayer {
   id: string;
   name: string;
   score: number;
}

export enum GameStatus {
   Lobby = 'LOBBY',
   Question = 'QUESTION',
   Vote = 'VOTE',
   Reveal = 'REVEAL',
   Ended = 'ENDED',
}

interface BaseGameState {
   code: string;
   playerID?: string;
   players: Player[];
   progress: number;
}

export interface GameStateLobby extends BaseGameState {
   status: GameStatus.Lobby;
   playersReady: Player[];
}

export interface GameStateQuestion extends BaseGameState {
   status: GameStatus.Question;
   question: string;
   playersDone: Player[];
}

export interface AnonymousAnswer {
   id: string;
   text: string;
}

export interface GameStateVote extends BaseGameState {
   status: GameStatus.Vote;
   question: string;
   answers: AnonymousAnswer[];
   playersDone: Player[];
}

export interface PlayerAnswerResult {
   id: string;
   text: string;
   author: Player;
   favoriteOf: Player[];
   guessedBy: Player[];
}

export interface GameStateReveal extends BaseGameState {
   status: GameStatus.Reveal;
   question: string;
   answers: PlayerAnswerResult[];
   playersReady: Player[];
}

export interface GameStateEnded extends BaseGameState {
   status: GameStatus.Ended;
   players: LeaderboardPlayer[];
}

export type GameState = GameStateLobby | GameStateQuestion | GameStateVote | GameStateReveal | GameStateEnded;

export interface ClientEvents {
   hostGame: {};
   joinGame: { code: string, name: string };
   submitAnswer: { answer: string };
   submitVote: { favorite: string };
   submitReady: {};
   disconnecting: {};
}

export interface ServerEvents {
   gameUpdate: GameState;
   gameEnd: {};
   connect: {};
}
