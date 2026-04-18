// Custom hook that wraps Auth0's useAuth0 for convenience
import { useAuth0 } from '@auth0/auth0-react';

export function useAuth() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  // Gets a fresh access token to attach to API requests
  async function getToken() {
    try {
      return await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      });
    } catch {
      return null;
    }
  }

  const login = (options = {}) =>
    loginWithRedirect({
      authorizationParams: {
        prompt: 'login',
        ...options.authorizationParams,
      },
      ...options,
    });

  return { isAuthenticated, isLoading, user, loginWithRedirect: login, logout, getToken };
}
