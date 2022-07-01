import { useIsAuthenticated } from '@azure/msal-react';
import { useContext } from 'react';
import { Button, Col, Row, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { SignInButton } from '../components/login/SignInButton';
import { UserContext, UserDto } from '../context/UserContext';

const userDataSource: UserDto[] = [
  {
    address: 'Address',
    city: 'San Francisco',
    email: 'first@email.com',
    firstName: 'Johnny',
    lastName: 'Devito',
    phone: '1111111111',
    pin: 'Pin',
    state: 'State',
  },
  {
    address: 'Address2',
    city: 'New York',
    email: 'second@email.com',
    firstName: 'Will',
    lastName: 'Smith',
    phone: '1111111112',
    pin: 'Pin',
    state: 'State',
  },
  {
    address: 'Address3',
    city: 'Las Vegas',
    email: 'third@email.com',
    firstName: 'Tom',
    lastName: 'Sawyer',
    phone: '1111111113',
    pin: 'Pin',
    state: 'State',
  },
];

const Login = () => {
  const userContext = useContext(UserContext);
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const setUser = (userEmail: string) => () => {
    const user = userDataSource.find((x) => x.email === userEmail);
    if (user) {
      userContext.setUserContext(user);
      navigate('/product-details');
    }
  };

  return (
    <>
      <Row>
        <Col>
          <h2>Login</h2>
        </Col>
      </Row>
      <Row>
        { isAuthenticated ? <span>Signed In</span> : <SignInButton /> }
      </Row>
      <Row>
        <Col>Select a user:</Col>
      </Row>
      <Stack id="login-buttons" gap={3} className="col-md-3">
        {userDataSource.map((x) => (
          <Button
            key={x.email}
            type="button"
            onClick={setUser(x.email)}
          >{`${x.firstName} ${x.lastName} (${x.email})`}</Button>
        ))}
      </Stack>
    </>
  );
};

export default Login;
