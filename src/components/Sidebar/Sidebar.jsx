import React from 'react';
import styles from './Sidebar.module.scss';
import Navigation from '../Navigation/Navigation';

const Sidebar = () => {
  return (
    <div id="sidebar" className={styles.sidebar}>
      <button className={styles['close-icon']} onClick={toggleSidebar}>×</button>
      <Navigation />
    </div>
  );
};

const toggleSidebar = () => {
  document.getElementById('sidebar').classList.toggle(styles.active);
};

export default Sidebar;
