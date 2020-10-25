interface Model {
   id: string;
}

export class ModelStore<T extends Model> {

   private _store: Partial<Record<string, T>> = {};

   public constructor(private _keyByProp: keyof T = 'id') {}

   public add(model: T): void {
      this._store[model[this._keyByProp] as any] = model;
   }

   public all(): Readonly<T[]> {
      return Object.keys(this._store)
         .map((id) => {
            return this._store[id];
         })
         .filter((o): o is T => {
            return o !== undefined;
         });
   }

   public withoutProp<K extends keyof T>(prop: K, value: T[K]): Readonly<T[]> {
      return Object.keys(this._store)
         .map((id) => {
            const item = this._store[id];

            if (item && item[prop] !== value) {
               return item;
            }

            return undefined;
         })
         .filter((o): o is T => {
            return o !== undefined;
         });
   }

   public removeByID(id: string): void {
      delete this._store[id];
   }

   public findByID(id: string): T | undefined {
      return this._store[id];
   }

   public findByProp<K extends keyof T>(prop: K, value: T[K]): T | undefined {
      // eslint-disable-next-line no-restricted-syntax
      for (const id in this._store) {
         if (Object.prototype.hasOwnProperty.call(this._store, id)) {
            const item = this._store[id];

            if (item && item[prop] === value) {
               return item;
            }
         }
      }
   }

   public get size(): number {
      return Object.keys(this._store).length;
   }

   public clear(): void {
      this._store = {};
   }

}
