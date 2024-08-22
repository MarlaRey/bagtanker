import { useState, useEffect, Fragment } from 'react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Slideshow from '../Slideshow/Slideshow';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import Footer from '../Footer/Footer'; 
import styles from './Layout.module.scss';
import supabase from '../../../supabase';
import image1 from '../../assets/images/bread-full01.jpeg'; // Import banner image
import image2 from '../../assets/images/bread-full02.jpeg'; // Import banner image
import image3 from '../../assets/images/bread-full03.jpeg'; // Import banner image
import image4 from '../../assets/images/bread-full04.jpeg'; // Import banner image
import image5 from '../../assets/images/bread-full05.jpeg'; // Import banner image
import image6 from '../../assets/images/bread-full06.jpeg'; // Import banner image
import image7 from '../../assets/images/bread-full07.jpeg'; // Import banner image
import image8 from '../../assets/images/bread-full08.jpeg'; // Import banner image

const Layout = ({ children, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breadcrumbTitles, setBreadcrumbTitles] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
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

  useEffect(() => {
    // Function to generate breadcrumb titles
    const fetchBreadcrumbTitles = async () => {
      const pathnames = location.pathname.split('/').filter((x) => x);
      const titles = {};

      for (let i = 0; i < pathnames.length; i++) {
        const path = pathnames[i];
        // Assuming path is the category ID or something you can lookup
        if (path !== 'produkter') {
          const { data, error } = await supabase
            .from('categories')
            .select('title')
            .eq('id', path)
            .single();

          if (data) {
            titles[path] = data.title;
          }
        }
      }

      setBreadcrumbTitles(titles);
    };

    fetchBreadcrumbTitles();
  }, [location.pathname]);

  const handleCategoryClick = (categoryId) => {
    if (location.pathname !== '/produkter') {
      // Hvis vi ikke er på /produkter, naviger til /produkter med valgt kategori
      navigate(`/produkter?${categoryId}`);
      setSelectedCategory(categoryId);
    } else {
      // Hvis vi allerede er på /produkter, opdater valgt kategori
      setSelectedCategory(categoryId);
      onCategoryChange(categoryId); // Send valgte kategori til ProductList
    }
  };

  // Function to generate breadcrumb links
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = pathnames.map((path, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      return { path: breadcrumbTitles[path] || decodeURIComponent(path), to }; // Use title if available, otherwise decode path
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <BurgerMenu />
        <Link to="/">
          <img src="src/assets/images/Logo.png" alt="Bagtanker Logo" className={styles.logo} />
        </Link>
        <Slideshow images={[image1,image2,image3,image4,image5,image6,image7,image8]} showDots={false} />
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
      <div className={styles.breadcrumbs}>
        <p>Du er her: Home / {breadcrumbs.map((breadcrumb, index) => (
          <Fragment key={breadcrumb.to}>
            <Link to={breadcrumb.to} className={styles.link}>{breadcrumb.path}</Link>
            {index < breadcrumbs.length - 1 && ' / '}
          </Fragment>
        ))}</p>
        <h2>{breadcrumbs[breadcrumbs.length - 1]?.path || 'Home'}</h2>
      </div>
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
