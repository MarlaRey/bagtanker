import { useState, useEffect, Fragment } from 'react'; 
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
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
  const { id } = useParams(); // Capture dynamic segment like news ID

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

      // Hvis vi er på en nyhedsside, skal vi hente nyhedens titel
      if (location.pathname.includes('/nyheder/') && id) {
        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select('title')
          .eq('id', id)
          .single();

        if (newsData) {
          titles['newsTitle'] = newsData.title;
        }
      }

      setBreadcrumbTitles(titles);
    };

    fetchBreadcrumbTitles();
  }, [location.search, location.pathname, id]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/produkter?category=${categoryId}`);
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
  };

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = pathnames.map((path, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      const breadcrumbTitle = breadcrumbTitles[path] || decodeURIComponent(path);
      return { path: breadcrumbTitle, to, key: `${to}-${index}` }; // Ensure unique key
    });

    const urlParams = new URLSearchParams(location.search);
    const categoryId = urlParams.get('category');
    if (categoryId && breadcrumbTitles['selectedCategory']) {
      breadcrumbs.push({ path: breadcrumbTitles['selectedCategory'], to: location.pathname, key: `category-${categoryId}` });
    }

    // Hvis vi er på en nyhedsside, tilføj nyhedstitlen
    if (location.pathname.includes('/nyheder/') && breadcrumbTitles['newsTitle']) {
      breadcrumbs[breadcrumbs.length - 1].path = breadcrumbTitles['newsTitle'];
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
          <Fragment key={breadcrumb.key}>
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
