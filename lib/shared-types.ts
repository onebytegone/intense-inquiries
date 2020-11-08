export interface Player {
   id: string;
   name: string;
   isActive: boolean;
}

export interface PlayerWithTask extends Player {
   hasSubmitted: boolean;
}

export interface LeaderboardPlayer extends Player {
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
   player?: PlayerWithTask;
   progress: number;
}

export interface GameStateLobby extends BaseGameState {
   status: GameStatus.Lobby;
   players: PlayerWithTask[];
}

export interface GameStateQuestion extends BaseGameState {
   status: GameStatus.Question;
   question: string;
   players: PlayerWithTask[];
}

export interface AnonymousAnswer {
   id: string;
   text: string;
}

export interface GameStateVote extends BaseGameState {
   status: GameStatus.Vote;
   question: string;
   answers: AnonymousAnswer[];
   players: PlayerWithTask[];
   authors: Player[];
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
   players: PlayerWithTask[];
}

export interface GameStateEnded extends BaseGameState {
   status: GameStatus.Ended;
   players: LeaderboardPlayer[];
}

export type GameState = GameStateLobby | GameStateQuestion | GameStateVote | GameStateReveal | GameStateEnded;

export interface PlayerVote {
   favoriteAnswerID: string;
   attribution: {
      playerID: string;
      answerID: string;
   }[];
}

interface EventError {
   message: string;
}

export interface ClientEvents {
   hostGame: void;
   joinGame: (data: { code: string, name: string }, cb: (err?: EventError, data?: { token: string }) => void) => void;
   rejoinGame: (data: { token: string }, cb: (err?: EventError) => void) => void;
   submitAnswer: (data: { answer: string }) => void;
   submitVote: (data: { vote: PlayerVote; }) => void;
   submitReady: void;
   disconnecting: void;
}

export interface ServerEvents {
   gameUpdate: (state: GameState) => void;
   gameEnd: void;
   connect: void;
   disconnect: (reason: string) => void;
}
