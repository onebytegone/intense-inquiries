import { v4 as uuid } from 'uuid';
import { AnonymousAnswer } from '../../../lib/shared-types';

export class AnswerModel {

   public readonly id: string;
   public readonly authorID: string;
   public readonly text: string;

   public constructor(authorID: string, text: string) {
      this.id = uuid();
      this.authorID = authorID;
      this.text = text;
   }

   public renderAnonymousAnswer(): AnonymousAnswer {
      return {
         id: this.id,
         text: this.text,
      };
   }

}
