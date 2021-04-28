import { UrlMatcher, UrlMatchResult, UrlSegment } from '@angular/router';
import { RoleName } from 'src/app/models/RoleName';
import { AuthService } from 'src/app/services/auth.service';
import { getAppInjector } from 'src/main';

export const adminCoursesUrlMatcher: UrlMatcher = (
  url: UrlSegment[]
): UrlMatchResult | null => {
  const authService = getAppInjector().get(AuthService);
  if (authService.userRole === RoleName.Admin && url.length === 0) {
    return { consumed: url };
  }

  return null;
};
