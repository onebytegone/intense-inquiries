import { v4 as uuid } from 'uuid';
import { AnonymousAnswer, PlayerAnswerResult } from '../../../lib/shared-types';
import filterUndefined from '../lib/filter-undefined';
import { ModelStore } from './ModelStore';
import { PlayerModel } from './PlayerModel';

export class AnswerModel {

   public readonly id: string;
   public readonly authorID: string;
   public readonly text: string;
   protected _favoritedBy = new Set<string>();

   public constructor(authorID: string, text: string) {
      this.id = uuid();
      this.authorID = authorID;
      this.text = text.toUpperCase();
   }

   public addFavoriteFrom(playerID: string): void {
      this._favoritedBy.add(playerID);
   }

   public get favorited(): number {
      return this._favoritedBy.size;
   }

   public renderAnonymousAnswer(): AnonymousAnswer {
      return {
         id: this.id,
         text: this.text,
      };
   }

   public renderPlayerAnswerResult(playerStore: ModelStore<PlayerModel>): PlayerAnswerResult | undefined {
      const author = playerStore.findByID(this.authorID);

      if (!author) {
         return undefined;
      }

      return {
         id: this.id,
         text: this.text,
         author: author.renderPlayerData(),
         favoriteOf: [ ...this._favoritedBy ]
            .map((playerID) => {
               const player = playerStore.findByID(playerID);

               if (player) {
                  return player.renderPlayerData();
               }

               return undefined;
            })
            .filter(filterUndefined),
         guessedBy: [],
      };
   }

}
