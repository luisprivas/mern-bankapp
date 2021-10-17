import { Container, Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import UserContext from '../contexts/user-context';

const NavBar = () => {
  const userContext = useContext(UserContext);
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>Bank App</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" defaultActiveKey="#home">
            <LinkContainer to="/home">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            {!userContext.authUser.isAuth && (
              <LinkContainer to="/createaccount">
                <Nav.Link>Create Account</Nav.Link>
              </LinkContainer>
            )}
            {userContext.authUser.isAuth && (
              <LinkContainer to="/deposit">
                <Nav.Link>Deposit</Nav.Link>
              </LinkContainer>
            )}
            {userContext.authUser.isAuth && (
              <LinkContainer to="/withdraw">
                <Nav.Link>Withdraw</Nav.Link>
              </LinkContainer>
            )}
            {!userContext.authUser.isAuth ? (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>Logout</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
