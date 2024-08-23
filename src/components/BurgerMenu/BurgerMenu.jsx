import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './BurgerMenu.module.scss';
import { AuthContext } from '../../context/AuthContext';

const BurgerMenu = () => {
  // State til at styre om burger-menuen er åben eller lukket
  const [isOpen, setIsOpen] = useState(false);

  // Hent isLoggedIn og logout funktioner fra AuthContext
  const { isLoggedIn, logout } = useContext(AuthContext);

  // Funktion til at skifte mellem åben og lukket tilstand af menuen
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Burger-ikonet, der bruges til at åbne og lukke menuen */}
      <div className={styles['burger-icon']} onClick={toggleMenu}>
        {/* De tre linjer i burger-ikonet, der ændrer stil når menuen er åben */}
        <div className={isOpen ? `${styles.line} ${styles.line1} ${styles.open}` : `${styles.line} ${styles.line1}`}></div>
        <div className={isOpen ? `${styles.line} ${styles.line2} ${styles.open}` : `${styles.line} ${styles.line2}`}></div>
        <div className={isOpen ? `${styles.line} ${styles.line3} ${styles.open}` : `${styles.line} ${styles.line3}`}></div>
      </div>

      {/* Menuen der vises eller skjules afhængigt af isOpen state */}
      <div className={isOpen ? `${styles.menu} ${styles.open}` : styles.menu}>
        <nav>
          <ul>
            {/* Navigation links til forskellige sektioner på websitet */}
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
            {/* Vise ekstra links og knapper baseret på login-status */}
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/minside" onClick={toggleMenu}>Min Side</Link>
                </li>
                <li>
                  {/* Knappen til at logge ud og lukke menuen */}
                  <button onClick={() => { logout(); toggleMenu(); }} className={styles.logoutButton}>Log ud</button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" onClick={toggleMenu}>Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default BurgerMenu;
