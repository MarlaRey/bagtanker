import React from 'react';
import './Sidebar.module.scss';
import Navigation from '../Navigation/Navigation';

const Sidebar = () => {
  return (
    <div id="sidebar" className="sidebar">
      <button className="close-icon" onClick={toggleSidebar}>×</button>
      <Navigation />
    </div>
  );
};

const toggleSidebar = () => {
  document.getElementById('sidebar').classList.toggle('active');
};

export default Sidebar;
