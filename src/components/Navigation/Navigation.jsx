import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.module.scss';

const Navigation = () => {
  return (
    <nav className="navigation">
      <NavLink exact to="/" activeClassName="active">Forside</NavLink>
      <NavLink to="/produkter" activeClassName="active">Produkter</NavLink>
      <NavLink to="/nyheder" activeClassName="active">Nyheder</NavLink>
      <NavLink to="/kontakt" activeClassName="active">Kontakt</NavLink>
      <NavLink to="/login" activeClassName="active">Login</NavLink>
    </nav>
  );
};

export default Navigation;
