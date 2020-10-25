import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import shuffle from 'lodash.shuffle';

const FILE = path.join(__dirname, '..', 'data', 'question-list.json'),
      fsReadFile = promisify(fs.readFile);

export default async function getQuestionList(count: number): Promise<string[]> {
   const contents = JSON.parse(await fsReadFile(FILE, 'utf8'));

   return shuffle(contents).slice(0, count);
}
