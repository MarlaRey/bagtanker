// src/components/Layout/Layout.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Slideshow from '../Slideshow/Slideshow';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import Footer from '../Footer/Footer';  // Importer Footer
import styles from './Layout.module.scss';
import supabase from '../../../supabase';

const Layout = ({ children }) => {
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const location = useLocation();

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('title');

        if (error) throw error;

        setCategories(data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <BurgerMenu />
        <Link to="/">
          <img src="src/assets/images/Logo.png" alt="Bagtanker Logo" className={styles.logo} />
        </Link>
        <Slideshow images={[
          'src/assets/images/bread-full01.jpeg',
          'src/assets/images/bread-full02.jpeg',
          'src/assets/images/bread-full03.jpeg',
          'src/assets/images/bread-full04.jpeg',
          'src/assets/images/bread-full05.jpeg',
          'src/assets/images/bread-full06.jpeg',
          'src/assets/images/bread-full07.jpeg',
          'src/assets/images/bread-full08.jpeg',
          'src/assets/images/bread-full09.jpeg'
        ]} showDots={false} />
      </header>
      <nav className={styles.menu}>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && categories.map((category, index) => (
          <Link
            key={index}
            to={`/${category.title.toLowerCase()}`}
            className={location.pathname === `/${category.title.toLowerCase()}` ? styles.active : ''}
          >
            {category.title}
          </Link>
        ))}
      </nav>
      <main className={styles.main}>
        {children}
      </main>
      <Footer />  {/* Tilføj Footer */}
    </div>
  );
};

export default Layout;
