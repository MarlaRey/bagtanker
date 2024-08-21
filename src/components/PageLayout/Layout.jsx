// src/components/Layout/Layout.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Slideshow from '../Slideshow/Slideshow';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import Footer from '../Footer/Footer'; 
import styles from './Layout.module.scss';
import supabase from '../../../supabase';

const Layout = ({ children, onCategoryChange }) => {
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, title');

        if (error) throw error;

        setCategories(data);
        setSelectedCategory(data[0]?.id); // Vælg første kategori som standard
        onCategoryChange(data[0]?.id); // Send første kategori til ProductList
        setLoading(false);
      } catch (error) {
        setError('Error fetching categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    if (location.pathname !== '/produkter') {
      // Hvis vi ikke er på /produkter, naviger til /produkter med valgt kategori
      navigate(`/produkter?${categoryId}`);
      setSelectedCategory(categoryId);
      onCategoryChange(categoryId); // Send valgte kategori til ProductList
    } else {
      // Hvis vi allerede er på /produkter, opdater valgt kategori
      setSelectedCategory(categoryId);
      onCategoryChange(categoryId); // Send valgte kategori til ProductList
    }
  };

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
        {!loading && !error && categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={category.id === selectedCategory ? styles.active : ''}
          >
            {category.title}
          </button>
        ))}
      </nav>
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
