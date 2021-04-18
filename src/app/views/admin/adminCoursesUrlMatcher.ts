import { UrlMatcher, UrlSegment, UrlMatchResult } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { getAppInjector } from 'src/main';

// If the user is an admin allow if to enter to /courses
export const adminCoursesUrlMatcher: UrlMatcher = (
  url: UrlSegment[]
): UrlMatchResult | null => {
  const authService = getAppInjector().get(AuthService);
  if (authService.isAdmin()) {
    return { consumed: url };
  }
  return null;
};
