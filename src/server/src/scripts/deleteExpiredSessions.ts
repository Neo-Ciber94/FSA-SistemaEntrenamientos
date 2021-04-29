import { DELETE_USER_SESSION_TIME } from '../config/config';
import { UserSession } from '../entities/UserSession';
import { LOGGER } from '../utils/Logger';

export async function deleteExpiredSessions() {
  const deleteResult = await UserSession.createQueryBuilder()
    .delete()
    .where(':now > tokenExpiration', { now: new Date() })
    .execute();

  if (deleteResult && deleteResult.affected && deleteResult.affected > 0) {
    LOGGER.info(`Deleted ${deleteResult.affected} expired user sessions`);
  }
}

export function startDeleteExpiredSessionsRoutine() {
  LOGGER.info('Starting routine to delete expired user sessions');
  setInterval(deleteExpiredSessions, DELETE_USER_SESSION_TIME);
}
