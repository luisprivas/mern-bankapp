import axios from 'axios';
import { useContext, useState } from 'react';
import { Card, BankFormInput, BankFormButton } from './Cards';
import UserContext from '../contexts/user-context';

const Login = () => {
  const [status, setStatus] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { setAuthUser } = useContext(UserContext);
  const userContext = useContext(UserContext);

  async function handleLogin() {
    setStatus('');

    document.getElementById('login-btn').disabled = true;

    await axios({
      url: '/graphql',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: `
        query login($email: String!, $password: String!) {
          login (
            email: $email
            password: $password
          ) {
            ... on InvalidCredentials {
              message
            }
            ... on AuthData {
              userId
              name
              balance
              token
              tokenExpiration
            }
          }
        }
        `,
        variables: {
          email: user.email,
          password: user.password,
        },
      },
    })
      .then((res) => {
        document.getElementById('login-btn').disabled = false;

        if (res.status !== 200 && res.status !== 201) {
          setStatus('Error');
          return;
        }

        return res;
      })
      .then((resData) => {
        if (!resData) return;

        if (resData.data.data.login.message) {
          setStatus('Invalid credentials');
          return;
        }

        if (resData.data.data.login.name) {
          setUser({ ...user, name: resData.data.data.login.name });
          setAuthUser({
            userId: resData.data.data.login.userId,
            name: resData.data.data.login.name,
            balance: resData.data.data.login.balance,
            token: resData.data.data.login.token,
            tokenExpiration: resData.data.data.login.tokenExpiration,
            isAuth: true,
          });
        }
      })
      .catch((err) => {
        setStatus('Error');
        document.getElementById('login-btn').disabled = false;
      });
  }

  function handleLogout() {
    setUser({
      name: '',
      email: '',
      password: '',
    });

    setAuthUser({
      userId: null,
      name: null,
      token: null,
      tokenExpiration: null,
      isAuth: false,
    });
  }

  return (
    <Card
      headerbgcolor="warning"
      header={!userContext.authUser.isAuth ? 'Login' : 'Logout'}
      status={status}
      body={
        !userContext.authUser.isAuth ? (
          <>
            <BankFormInput
              title="Email"
              id="email"
              placeholder="Enter email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.currentTarget.value })}
            />
            <BankFormInput
              title="Password"
              id="password"
              placeholder="Enter password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.currentTarget.value })}
            />
            <BankFormButton id="login-btn" bgcolor="warning" text="Login" onClick={handleLogin} />
          </>
        ) : (
          <>
            <h5>Refresh the page or click the button to logout</h5>
            <BankFormButton bgcolor="warning" text="Logout" onClick={handleLogout} />
          </>
        )
      }
    />
  );
};

export default Login;
