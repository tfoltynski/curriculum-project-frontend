import { useContext } from 'react';
import logo from './logo.svg';
import { Button, Container, Stack } from 'react-bootstrap';
import ProductDetails from './features/product/ProductDetails';
import { ToastContainer } from 'react-toastify';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { UserContext } from './features/login/UserContext';
import Login from './features/login/Login';

const Main = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const logout = () => {
    navigate('/');
    userContext.setUserContext(null);
  };
  return (
    <Container>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        closeOnClick
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
      />
      <Stack direction="horizontal">
        <img src={logo} className="App-logo" alt="logo" />
        {userContext.user && (
          <Button
            variant="link"
            className="ms-auto"
            onClick={logout}
          >{`Log out (${userContext.user?.firstName} ${userContext.user?.lastName})`}</Button>
        )}
      </Stack>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/product-details" element={<ProductDetails />} />
      </Routes>
    </Container>
  );
};

export default Main;
