import { LogLevel } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: 'be6bf4e2-07c9-46a2-aa76-f3d0616593fd',
    authority:
      'https://login.microsoftonline.com/8aac3eeb-5127-45ea-b1ef-454856977e68',
    postLogoutRedirectUri: '/',
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: any, message: any, containsPii: any) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: []
};

export const protectedResources = {
  auctionApi: {
      scopes: ["api://4cf5e3ec-36af-4ca9-ae93-218de8f39656/access_as_user"], // e.g. api://xxxxxx/access_as_user
  },
}