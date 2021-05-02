export enum RoleName {
  Student = 'student',
  Teacher = 'teacher',
  Admin = 'admin',
}

// tslint:disable-next-line: no-namespace
export namespace RoleName {
  export function values() {
    const keys = Object.keys(RoleName);
    const array: string[] = [];

    for (const k of keys) {
      const val = (RoleName as any)[k];
      array.push(val);
    }

    return array;
  }
}
