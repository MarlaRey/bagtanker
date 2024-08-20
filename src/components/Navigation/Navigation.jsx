import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.scss';

const Navigation = () => {
  return (
    <nav className={styles.navigation}>
      <NavLink exact to="/" activeClassName={styles.active}>Forside</NavLink>
      <NavLink to="/produkter" activeClassName={styles.active}>Produkter</NavLink>
      <NavLink to="/nyheder" activeClassName={styles.active}>Nyheder</NavLink>
      <NavLink to="/kontakt" activeClassName={styles.active}>Kontakt</NavLink>
      <NavLink to="/login" activeClassName={styles.active}>Login</NavLink>
    </nav>
  );
};

export default Navigation;
