import { useContext } from 'react';
import UserContext from '../contexts/user-context';
import { Card } from './Cards';

const Home = () => {
  const userContext = useContext(UserContext);
  return (
    <Card
      headerbgcolor="secondary"
      headertxtcolor="white"
      header="Bank App Home Page"
      title={userContext.authUser.isAuth ? `Welcome to the bank, ${userContext.authUser.name}!` : 'Welcome to the bank'}
      text={
        userContext.authUser.isAuth
          ? 'Navigate to the deposit or withdraw pages.'
          : 'Begin by creating an account or logging in.'
      }
      body={<img src="bank.png" className="img-fluid" alt="Bank"></img>}
    />
  );
};

export default Home;
