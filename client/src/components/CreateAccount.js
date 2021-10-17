import { useState, useEffect } from 'react';
import { Card, BankFormInput, BankFormButton } from './Cards';
import axios from 'axios';

const CreateAccount = () => {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user.name && user.email && user.password) {
      document.getElementById('create-btn').disabled = false;
    } else {
      document.getElementById('create-btn').disabled = true;
    }
    if (!user.name) setStatus('Missing name');
    else if (!user.email) setStatus('Missing email');
    else if (!user.password) setStatus('Missing password');
    else setStatus('');
  }, [user.name, user.email, user.password]);

  function validate(email, password) {
    const validEmailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!validEmailRegex.test(email)) {
      setStatus('Invalid email, try: example@example.com');
      return false;
    }
    if (password.length < 8) {
      setStatus('Password too short');
      return false;
    }
    return true;
  }

  function clearForm() {
    setUser({
      name: '',
      email: '',
      password: '',
    });
    setShow(true);
  }

  async function handleCreate() {
    setStatus('');

    if (!validate(user.email, user.password)) return;

    document.getElementById('create-btn').disabled = true;

    await axios({
      url: '/graphql',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: `
        mutation createUser($name: String!, $email: String!, $password: String!) {
          createUser(input:{
            name: $name
            email: $email
            password: $password
          }) {
            _id
          }
        }
        `,
        variables: {
          name: user.name,
          email: user.email,
          password: user.password,
        },
      },
    })
      .then((res) => {
        document.getElementById('create-btn').disabled = false;

        if (res.status !== 200 && res.status !== 201) {
          setStatus('Error');
          return;
        }

        return res;
      })
      .then((resData) => {
        if (!resData) return;

        if (resData.data.errors) {
          resData.data.errors.forEach((error) => {
            if (error.message.includes('E11000')) {
              setStatus('Email already in use');
            }
          });
          return;
        }

        setShow(false);
      })
      .catch((err) => {
        setStatus('Error');
        document.getElementById('create-btn').disabled = false;
      });
  }

  return (
    <Card
      headerbgcolor="primary"
      headertxtcolor="white"
      header="Create Account"
      status={status}
      body={
        show ? (
          <>
            <BankFormInput
              title="Name"
              id="name"
              placeholder="Enter name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.currentTarget.value.trim() })}
            />
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
            <BankFormButton id="create-btn" bgcolor="primary" text="Create Account" onClick={handleCreate} />
          </>
        ) : (
          <>
            <h5>Success! Account created</h5>
            <BankFormButton bgcolor="primary" text="Add Another Account" onClick={clearForm} />
          </>
        )
      }
    />
  );
};

export default CreateAccount;
