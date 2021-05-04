import { Response } from 'express';

interface RelationValid {
  type: 'valid';
  relations: string[];
}

interface RelationInvalid {
  type: 'invalid';
  error: Response<any>;
}

export type RelationResult = RelationValid | RelationInvalid;

export class Includes {
  constructor(readonly allowedIncludes: string[]) {
    Object.freeze(allowedIncludes);
  }

  getRelations(response: Response, queryParam?: string): RelationResult {
    if (queryParam == null) {
      return { type: 'valid', relations: [] };
    }

    const relations = queryParam.split(',');
    if (this.isValid(relations)) {
      return {
        type: 'valid',
        relations,
      };
    } else {
      return {
        type: 'invalid',
        error: this.badRequest400(response, relations),
      };
    }
  }

  private isValid(includes: string[]) {
    for (const s of includes) {
      if (!this.allowedIncludes.includes(s)) {
        return false;
      }
    }

    return true;
  }

  private badRequest400(response: Response, includes: string[]) {
    console.assert(includes.length > 0);

    let message: string;

    if (includes.length === 1) {
      message = `Invalid includes, expected: '${includes[0]}'`;
    } else {
      message = `Invalid includes, expected one of '${includes.toString()}'`;
    }

    return response.status(400).send(message);
  }
}
