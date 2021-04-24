const NEXT_ID_OBJECT: any = {};
let NEXT_ID = 0;

export function getNextId(key?: string) {
  if (key) {
    if (NEXT_ID_OBJECT[key] == null) {
      NEXT_ID_OBJECT[key] = 0;
    }

    return ++NEXT_ID_OBJECT[key];
  }

  return ++NEXT_ID;
}
