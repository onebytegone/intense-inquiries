import { v4 as uuid } from 'uuid';
import { LeaderboardPlayer, Player } from '../../../lib/shared-types';

export class PlayerModel {

   public readonly id: string;
   public readonly name: string
   public socketID?: string;
   private _score: number = 0;

   public constructor(socketID: string, name: string) {
      this.id = uuid();
      this.socketID = socketID;
      this.name = name.toUpperCase().replace(/[^A-Z0-9]+/gu, '');
   }

   // eslint-disable-next-line camelcase
   public static is_valid_name(name: string): boolean {
      return /^[A-Z0-9]+$/g.test(name.toUpperCase());
   }

   public get score(): number {
      return this._score;
   }

   public awardPointsForFavorites(favorited: number): void {
      this._score += favorited;
   }

   public awardPointsForCorrectAttributions(correctAttributions: number): void {
      this._score += correctAttributions * 2;
   }

   public renderPlayerData(): Player {
      return {
         id: this.id,
         name: this.name,
         isActive: !!this.socketID,
      };
   }

   public renderLeaderboardData(): LeaderboardPlayer {
      return Object.assign(this.renderPlayerData(), {
         score: this._score,
      });
   }

}
