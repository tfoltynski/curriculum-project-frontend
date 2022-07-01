import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import UserContextComponent from './context/UserContext';
import Main from './Main';
import { MsalAuthenticationTemplate, MsalProvider } from '@azure/msal-react';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { loginRequest, msalConfig } from './auth/authConfig';

export const msalInstance = new PublicClientApplication(msalConfig);

// Account selection logic is app dependent. Adjust as needed for different use cases.
const accounts = msalInstance.getAllAccounts();

if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

function App() {
  const authRequest = {
    ...loginRequest,
  };
  return (
    <BrowserRouter>
      <MsalProvider instance={msalInstance}>
        {/* <MsalAuthenticationTemplate
          interactionType={InteractionType.Redirect}
          authenticationRequest={authRequest}
        > */}
          <UserContextComponent>
            <Main />
          </UserContextComponent>
        {/* </MsalAuthenticationTemplate> */}
      </MsalProvider>
    </BrowserRouter>
  );
}

export default App;
