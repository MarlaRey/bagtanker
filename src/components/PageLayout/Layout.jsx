import { useState, useEffect, Fragment } from 'react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Slideshow from '../Slideshow/Slideshow';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import Footer from '../Footer/Footer'; 
import styles from './Layout.module.scss';
import supabase from '../../../supabase';
import image1 from '../../assets/images/bread-full01.jpeg';
import image2 from '../../assets/images/bread-full02.jpeg';
import image3 from '../../assets/images/bread-full03.jpeg';
import image4 from '../../assets/images/bread-full04.jpeg';
import image5 from '../../assets/images/bread-full05.jpeg';
import image6 from '../../assets/images/bread-full06.jpeg';
import image7 from '../../assets/images/bread-full07.jpeg';
import image8 from '../../assets/images/bread-full08.jpeg';
import logo from '../../assets/images/Logo.png'; 

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
        setLoading(false);
      } catch (error) {
        setError('Error fetching categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBreadcrumbTitles = async () => {
      const urlParams = new URLSearchParams(location.search);
      const categoryId = urlParams.get('category');
      const titles = {};

      if (categoryId) {
        const { data, error } = await supabase
          .from('categories')
          .select('title')
          .eq('id', categoryId)
          .single();

        if (data) {
          titles['selectedCategory'] = data.title;
        }
      }

      setBreadcrumbTitles(titles);
    };

    fetchBreadcrumbTitles();
  }, [location.search]);

  const handleCategoryClick = (categoryId) => {
    // Naviger til /produkter med valgt kategori som query-parameter
    navigate(`/Produkter?category=${categoryId}`);
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
  };

  // Function to generate breadcrumb links
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = pathnames.map((path, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      return { path: breadcrumbTitles[path] || decodeURIComponent(path), to };
    });

    // Tilføj den valgte kategori til breadcrumbs, hvis den findes
    const urlParams = new URLSearchParams(location.search);
    const categoryId = urlParams.get('category');
    if (categoryId && breadcrumbTitles['selectedCategory']) {
      breadcrumbs.push({ path: breadcrumbTitles['selectedCategory'], to: location.pathname });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <BurgerMenu />
        <Link to="/">
          <img className={styles.logo} src={logo} alt="logo" />
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
