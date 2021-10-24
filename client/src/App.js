import { Route, Redirect, Switch } from 'react-router-dom';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from './components/NavBar';
import Home from './components/Home';
import CreateAccount from './components/CreateAccount';
import Login from './components/Login';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';
import NotFound from './components/NotFound';

import UserContext from './contexts/user-context';

import './styles/styles.css';

const App = () => {
  const [authUser, setAuthUser] = useState({
    userId: null,
    name: null,
    toke: null,
    tokenExpiration: null,
  });

  return (
    <>
      <UserContext.Provider value={{ authUser, setAuthUser }}>
        <NavBar />
        <Switch>
          <Redirect from="/" to="/home" exact />
          <Route path="/home" component={Home} exact />
          <Route path="/createaccount" component={CreateAccount} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/deposit" component={Deposit} exact />
          <Route path="/withdraw" component={Withdraw} exact />
          <Route component={NotFound} />
        </Switch>
      </UserContext.Provider>
    </>
  );
};

export default App;
