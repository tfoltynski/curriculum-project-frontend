import { createContext, ReactElement, useState } from 'react';

type UserContextState = {
  user: UserDto | null;
  setUserContext: (user: UserDto | null) => void;
};

type UserContextProps = {
  children: ReactElement;
};

export type UserDto = {
  address: string;
  city: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  pin: string;
  state: string;
};

export const UserContext = createContext<UserContextState>({
  user: null,
  setUserContext: (user) => {},
});

const UserContextComponent = (props: UserContextProps) => {
  const [userState, setUserState] = useState<UserDto | null>(null);
  const setUserContext = (user: UserDto | null) => {
    setUserState(user);
  };

  return (
    <UserContext.Provider
      value={{ user: userState, setUserContext: setUserContext }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextComponent;
