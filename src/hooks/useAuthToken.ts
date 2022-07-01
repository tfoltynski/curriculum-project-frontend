import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from '@azure/msal-browser';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import { protectedResources } from '../auth/authConfig';

export const useAuthToken = () => {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && inProgress === InteractionStatus.None) {
      instance
        .acquireTokenSilent({
          account: accounts[0],
          ...protectedResources.auctionApi,
        })
        .then((response) => {
          setToken(response.accessToken);
        })
        .catch((error) => {
          // in case if silent token acquisition fails, fallback to an interactive method
          if (error instanceof InteractionRequiredAuthError) {
            if (isAuthenticated && inProgress === InteractionStatus.None) {
              instance
                .acquireTokenPopup({ ...protectedResources.auctionApi })
                .catch((error) => console.log(error));
            }
          }
        });
    }
  }, [inProgress, isAuthenticated, accounts, instance]);

  return token;
};
