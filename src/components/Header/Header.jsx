import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/">
        <img src="src/assets/images/Logo.png" alt="Bagtanker Logo" className={styles.logo} />
      </Link>
      <button className={styles['navbar-icon']} onClick={toggleSidebar}>☰</button>
    </header>
  );
};

const toggleSidebar = () => {
  document.getElementById('sidebar').classList.toggle('active');
};

export default Header;
