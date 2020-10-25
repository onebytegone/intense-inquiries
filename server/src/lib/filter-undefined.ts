export default function filterUndefined<T>(o: T | undefined): o is T {
   return o !== undefined;
}
