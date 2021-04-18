import { UrlMatcher, UrlMatchResult, UrlSegment } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { getAppInjector } from 'src/main';

export const adminCoursesUrlMatcher: UrlMatcher = (
  url: UrlSegment[]
): UrlMatchResult | null => {
  console.log(url);
  const authService = getAppInjector().get(AuthService);
  if (authService.isAdmin() && url.length === 0) {
    return { consumed: url };
  }

  return null;
};
