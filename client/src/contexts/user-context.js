import { createContext } from 'react';

export default createContext({
  authUser: {
    userId: null,
    name: null,
    balance: null,
    token: null,
    tokenExpiration: null,
    isAuth: false,
  },
  setAuthUser: (user) => {},
});
