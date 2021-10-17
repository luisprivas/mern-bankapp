import { useState, useEffect } from 'react';
import { Card, BankFormInput, BankFormButton } from './Cards';
import axios from 'axios';

import { useContext } from 'react';
import UserContext from '../contexts/user-context';

const Deposit = () => {
  const [status, setStatus] = useState('');
  const [deposit, setDeposit] = useState('');

  const userContext = useContext(UserContext);

  useEffect(() => {
    if (userContext.authUser.isAuth) {
      if (deposit) {
        document.getElementById('deposit-btn').disabled = false;
      } else {
        document.getElementById('deposit-btn').disabled = true;
      }
    }
  }, [deposit, userContext.authUser.isAuth]);

  function validate(field) {
    if (isNaN(field)) {
      setStatus('Enter numerical values only');
      return false;
    }

    if (Math.sign(field) <= 0) {
      setStatus('Enter positive values only');
      return false;
    }

    return true;
  }

  async function handleDeposit() {
    setStatus('');

    if (!validate(deposit)) return;

    await axios({
      url: 'http://localhost:4000/graphql',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userContext.authUser.token}`,
      },
      data: {
        query: `
        mutation deposit($amount: Float!){
          deposit(amount: $amount)
        }
        `,
        variables: {
          amount: parseFloat(deposit),
        },
      },
    })
      .then((res) => {
        document.getElementById('deposit-btn').disabled = false;

        if (res.status !== 200 && res.status !== 201) {
          setStatus('Error');
          return;
        }

        return res;
      })
      .then((resData) => {
        if (!resData) return;
        userContext.authUser.balance = resData.data.data.deposit;

        return;
      })
      .catch((err) => {
        setStatus('Error');
        document.getElementById('deposit-btn').disabled = false;
      });

    setStatus('$' + parseFloat(deposit) + ' added to your balance');

    setDeposit('');
  }

  return (
    <Card
      headerbgcolor="success"
      headertxtcolor="white"
      header="Deposit"
      status={status}
      body={
        userContext.authUser.isAuth ? (
          <>
            <p>Balance: ${userContext.authUser.balance}</p>
            <BankFormInput
              title="Deposit Amount"
              id="deposit"
              placeholder="Enter amount"
              value={deposit}
              onChange={(e) => setDeposit(e.currentTarget.value)}
            />
            <BankFormButton id="deposit-btn" bgcolor="success" text="Deposit" onClick={handleDeposit} />
          </>
        ) : (
          <>
            <h5>Login to deposit</h5>
          </>
        )
      }
    />
  );
};

export default Deposit;
