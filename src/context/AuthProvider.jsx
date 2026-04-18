// Auth0 configuration for React frontend
// Install: npm install @auth0/auth0-react
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

export const AuthProvider = ({ children }) => (
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience,
    }}
    cacheLocation="localstorage"
  >
    {children}
  </Auth0Provider>
);
