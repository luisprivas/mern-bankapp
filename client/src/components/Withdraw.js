import { useState, useEffect } from 'react';
import { Card, BankFormInput, BankFormButton } from './Cards';
import axios from 'axios';

import { useContext } from 'react';
import UserContext from '../contexts/user-context';

const Withdraw = () => {
  const [status, setStatus] = useState('');
  const [withdraw, setWithdraw] = useState('');

  const userContext = useContext(UserContext);

  useEffect(() => {
    if (userContext.authUser.isAuth) {
      if (withdraw) {
        document.getElementById('withdraw-btn').disabled = false;
      } else {
        document.getElementById('withdraw-btn').disabled = true;
      }
    }
  }, [withdraw, userContext.authUser.isAuth]);

  function validate(field) {
    if (isNaN(field)) {
      setStatus('Enter numerical values only');
      return false;
    }

    if (Math.sign(field) <= 0) {
      setStatus('Enter positive values only');
      return false;
    }

    if (parseFloat(withdraw) > userContext.authUser.balance) {
      setStatus('Not enough funds');
      return false;
    }

    return true;
  }

  async function handleWithdraw() {
    setStatus('');

    if (!validate(withdraw)) return;

    await axios({
      url: '/graphql',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userContext.authUser.token}`,
      },
      data: {
        query: `
        mutation withdraw($amount: Float!){
          withdraw(amount: $amount)
        }
        `,
        variables: {
          amount: parseFloat(withdraw),
        },
      },
    })
      .then((res) => {
        document.getElementById('withdraw-btn').disabled = false;

        if (res.status !== 200 && res.status !== 201) {
          setStatus('Error');
          return;
        }

        return res;
      })
      .then((resData) => {
        if (!resData) return;
        userContext.authUser.balance = resData.data.data.withdraw;

        return;
      })
      .catch((err) => {
        setStatus('Error');
        document.getElementById('withdraw-btn').disabled = false;
      });

    setStatus('$' + parseFloat(withdraw) + ' withdrawed from your balance');

    setWithdraw('');
  }

  return (
    <Card
      headerbgcolor="danger"
      headertxtcolor="white"
      header="Withdraw"
      status={status}
      body={
        userContext.authUser.isAuth ? (
          <>
            <p>Balance: ${userContext.authUser.balance}</p>
            <BankFormInput
              title="Withdraw Amount"
              id="withdraw"
              placeholder="Enter amount"
              value={withdraw}
              onChange={(e) => setWithdraw(e.currentTarget.value)}
            />
            <BankFormButton id="withdraw-btn" bgcolor="danger" text="Withdraw" onClick={handleWithdraw} />
          </>
        ) : (
          <>
            <h5>Login to withdraw</h5>
          </>
        )
      }
    />
  );
};

export default Withdraw;
