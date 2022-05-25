import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import UserContextComponent from './features/login/UserContext';
import Main from './Main';

function App() {

  return (
    <BrowserRouter>
      <UserContextComponent>
        <Main />
      </UserContextComponent>
    </BrowserRouter>
  );
}

export default App;
