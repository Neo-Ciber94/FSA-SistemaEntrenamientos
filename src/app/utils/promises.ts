// tslint:disable-next-line: no-namespace
export namespace Promises {
  export function timeout<T>(
    milliseconds: number,
    callback: () => T
  ): Promise<T> {
    return new Promise<T>((resolve) => {
      setTimeout(() => {
        resolve(callback());
      }, milliseconds);
    });
  }
}
