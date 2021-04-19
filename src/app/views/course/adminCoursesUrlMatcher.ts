import { UrlMatcher, UrlMatchResult, UrlSegment } from '@angular/router';
import { Role } from 'src/app/models/Role';
import { AuthService } from 'src/app/services/auth.service';
import { getAppInjector } from 'src/main';

export const adminCoursesUrlMatcher: UrlMatcher = (
  url: UrlSegment[]
): UrlMatchResult | null => {
  const authService = getAppInjector().get(AuthService);
  if (authService.userRole === Role.Admin && url.length === 0) {
    return { consumed: url };
  }

  return null;
};
