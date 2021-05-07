// Minimun length of the password
export const MIN_PASSWORD_LENGTH = 6;

/**
 * Checks whether a route needs authentification.
 * @param apiUrl Url of the api
 * @param url url to check
 * @returns `true` if the route requires authentification otherwise false.
 */
export function needsAuthentication(apiUrl: string, url: string) {
  const authUrl = `${apiUrl}/auth`;

  if (url.startsWith(authUrl)) {
    // Split the string removing any query params
    const urlRest = url.slice(authUrl.length).split('?')[0];

    switch (urlRest) {
      case '/signup':
      case '/login':
      case '/token':
      case '/user':
      case '/checkemail':
        return false;
    }
  }

  return true;
}
