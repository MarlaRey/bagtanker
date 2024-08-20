import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './BurgerMenu.module.scss';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
     <div className={styles['burger-icon']} onClick={toggleMenu}>
  <div className={isOpen ? `${styles.line} ${styles.line1} ${styles.open}` : `${styles.line} ${styles.line1}`}></div>
  <div className={isOpen ? `${styles.line} ${styles.line2} ${styles.open}` : `${styles.line} ${styles.line2}`}></div>
  <div className={isOpen ? `${styles.line} ${styles.line3} ${styles.open}` : `${styles.line} ${styles.line3}`}></div>
</div>

<div className={isOpen ? `${styles.menu} ${styles.open}` : styles.menu}>
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
