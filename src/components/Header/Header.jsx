import React from 'react';
import './Header.module.scss';

const Header = () => {
  return (
    <header className="header">
      <img src="src\assets\images\Logo.png" alt="Bagtanker Logo" className="logo" />
      <button className="navbar-icon" onClick={toggleSidebar}>☰</button>
    </header>
  );
};

const toggleSidebar = () => {
  document.getElementById('sidebar').classList.toggle('active');
};

export default Header;
