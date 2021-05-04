export function ifEmpty<T>(value: string, valueIfEmpty?: T) {
  return value.trim().length === 0 ? valueIfEmpty : value;
}
