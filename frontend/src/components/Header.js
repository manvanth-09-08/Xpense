

import React, { useCallback, useEffect, useState } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import './style.css';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const Header = (props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  const handleShowLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      setUser(user);
    }
  }, []);

  const handleShowLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // particles loaded
  }, []);

  return (
    <>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: '#000',
              },
            },
            fpsLimit: 60,
            particles: {
              number: {
                value: 200,
                density: {
                  enable: true,
                  value_area: 800,
                },
              },
              color: {
                value: '#ffcc00',
              },
              shape: {
                type: 'circle',
              },
              opacity: {
                value: 0.5,
                random: true,
              },
              size: {
                value: 3,
                random: { enable: true, minimumValue: 1 },
              },
              links: {
                enable: false,
              },
              move: {
                enable: true,
                speed: 2,
              },
              life: {
                duration: {
                  sync: false,
                  value: 3,
                },
                count: 0,
                delay: {
                  random: {
                    enable: true,
                    minimumValue: 0.5,
                  },
                  value: 1,
                },
              },
            },
            detectRetina: true,
          }}
          style={{
            position: 'absolute',
            zIndex: -1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
       

<Navbar
  className="navbarCSS"
  collapseOnSelect
  expand="lg"
  style={{ position: 'relative', zIndex: '2' }}
>
  <Container>
    <Navbar.Brand href="/" className="text-white navTitle">
      XPENS
    </Navbar.Brand>



    {/* Show Logout button instead of Navbar.Toggle on mobile */}
    <Nav> 
    <Button
      variant="danger"
      onClick={handleShowLogout}
      className=" d-lg-none"
      // style={{ height:"40px" }}
    >
      <i className="fas fa-sign-out-alt"></i> <small>Logout</small>
    </Button>
    </Nav>

    <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
      {user ? (
        <>
          <Nav>
            <Button
              variant="outline-light"
              onClick={() => props.setBankShow(true)}
              className="mx-1 navButton"
            >
              <i className="fas fa-university"></i> <small>Bank</small>
            </Button>
          </Nav>
          <Nav>
            <Button
              variant="outline-light"
              onClick={() => props.setCategoryShow(true)}
              className="mx-1 navButton"
            >
              <i className="fas fa-list-alt"></i> <small>Category</small>
            </Button>
          </Nav>
          
          <Nav>
            <Button
              variant="danger"
              onClick={handleShowLogout}
              className="mx-1 navButton d-none d-lg-block"
            >
              <i className="fas fa-sign-out-alt"></i> <small>Logout</small>
            </Button>
          </Nav>
        </>
      ) : (
        <Nav>
          <Button
            variant="primary"
            onClick={handleShowLogin}
            className="mx-1 navButton"
          >
            Login
          </Button>
        </Nav>
      )}
    </Navbar.Collapse>
  </Container>

  {/* Mobile Bottom Navbar */}
  {user && (
    <div className="navButtons-bottom d-lg-none">
      <Button
        variant="outline-light"
        onClick={() => props.setBankShow(true)}
        className="mx-1 navButton"
      >
        <i className="fas fa-university"></i> <small>Bank</small>
      </Button>
      <Button
        variant="outline-light"
        onClick={() => props.setCategoryShow(true)}
        className="mx-1 navButton"
      >
        <i className="fas fa-list-alt"></i> <small>Category</small>
      </Button>
      <Button
        variant="outline-light"
        onClick={()=>props.handleAddIncome()}
        className="mx-1 navButton"
      >
        <i className="fas fa-plus-circle"></i> <small>Income</small>
      </Button>
      <Button
        variant="outline-light"
        onClick={props.handleAddExpense}
        className="mx-1 navButton"
      >
        <i className="fas fa-minus-circle"></i> <small>Expense</small>
      </Button>
    </div>
  )}
</Navbar>
      </div>
    </>
  );
};

export default Header;
