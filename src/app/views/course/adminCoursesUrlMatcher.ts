import { UrlMatcher, UrlMatchResult, UrlSegment } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { getAppInjector } from 'src/main';
import { RoleName } from 'src/shared';

export const adminCoursesUrlMatcher: UrlMatcher = (
  url: UrlSegment[]
): UrlMatchResult | null => {
  const authService = getAppInjector().get(AuthService);
  if (
    authService.getCurrentUser()?.role === RoleName.Admin &&
    url.length === 0
  ) {
    return { consumed: url };
  }

  return null;
};
