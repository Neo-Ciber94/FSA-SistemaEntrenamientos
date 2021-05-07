import { ROUTINE_INTERVAL } from '../config';
import { User } from '../entities/User';
import { LOGGER } from '../utils';

export async function purgueDeletedUsers() {
  const deleteResult = await User.createQueryBuilder()
    .delete()
    .where('canDelete AND isDeleted AND :now > deleteAt', { now: new Date() })
    .execute();

  if (deleteResult && deleteResult.affected && deleteResult.affected > 0) {
    LOGGER.info(`Purgued ${deleteResult.affected} users`);
  }
}

export function startPurgueDeletedUsersRoutine() {
  LOGGER.info('Starting routine to purgue deleted users');
  setInterval(purgueDeletedUsers, ROUTINE_INTERVAL);
}
