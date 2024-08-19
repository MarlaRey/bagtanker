import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BurgerMenu.module.scss'; 

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="burger-icon" onClick={toggleMenu}>
        <div className={isOpen ? 'line line1 open' : 'line line1'}></div>
        <div className={isOpen ? 'line line2 open' : 'line line2'}></div>
        <div className={isOpen ? 'line line3 open' : 'line line3'}></div>
      </div>

      <div className={isOpen ? 'menu open' : 'menu'}>
        <nav>
          <ul>
            <li>
              <Link to="/" onClick={toggleMenu}>Forside</Link>
            </li>
            <li>
              <Link to="/produkter" onClick={toggleMenu}>Produkter</Link>
            </li>
            <li>
              <Link to="/nyheder" onClick={toggleMenu}>Nyheder</Link>
            </li>
            <li>
              <Link to="/kontakt" onClick={toggleMenu}>Kontakt</Link>
            </li>
            <li>
              <Link to="/login" onClick={toggleMenu}>Login</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default BurgerMenu;
