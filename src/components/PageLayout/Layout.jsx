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

// Layout-komponent der omslutter og strukturerer hovedindholdet på siden
const Layout = ({ children, onCategoryChange }) => {
  // State til at holde styr på kategorier, den valgte kategori, loading-status, fejlbeskeder og breadcrumb-titler
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breadcrumbTitles, setBreadcrumbTitles] = useState({});
  const location = useLocation(); // React Router hook til at få nuværende URL placering
  const navigate = useNavigate(); // React Router hook til programmatisk navigation
  const { id } = useParams(); // Henter dynamiske parametre fra URL'en (f.eks. nyheds-ID)

  // useEffect til at hente kategorier fra supabase ved komponentens mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, title'); // Henter kategori-id og titler fra 'categories' tabel

        if (error) throw error; // Hvis der opstår en fejl, sig det

        setCategories(data); // Sætter de hentede kategorier i state
        setLoading(false); // Angiver at data er færdig med at loade
      } catch (error) {
        setError('Error fetching categories'); // Hvis der opstår en fejl, sæt fejlbesked i state
        setLoading(false); // Angiver at loading er færdig, selvom der er fejl
      }
    };

    fetchCategories(); // Kalder funktionen til at hente kategorier
  }, []); // Afhængigheder er tomme, så den kører kun ved første render

  // useEffect til at hente breadcrumb-titler baseret på URL parametre
  useEffect(() => {
    const fetchBreadcrumbTitles = async () => {
      const urlParams = new URLSearchParams(location.search); // Henter query parametre fra URL
      const categoryId = urlParams.get('category'); // Henter kategori-ID fra URL'en, hvis tilgængelig
      const titles = {}; // Objekt til at gemme titler

      if (categoryId) {
        const { data, error } = await supabase
          .from('categories')
          .select('title')
          .eq('id', categoryId)
          .single(); // Henter kategorititel baseret på kategori-ID

        if (data) {
          titles['selectedCategory'] = data.title; // Tilføjer kategorititel til titles objektet
        }
      }

      // Hvis vi er på en nyhedsside, skal vi hente nyhedens titel
      if (location.pathname.includes('/nyheder/') && id) {
        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select('title')
          .eq('id', id)
          .single(); // Henter nyhedstitel baseret på nyheds-ID

        if (newsData) {
          titles['newsTitle'] = newsData.title; // Tilføjer nyhedstitel til titles objektet
        }
      }

      setBreadcrumbTitles(titles); // Opdaterer breadcrumb-titler i state
    };

    fetchBreadcrumbTitles(); // Kalder funktionen til at hente breadcrumb-titler
  }, [location.search, location.pathname, id]); // Denne useEffect kører når disse afhængigheder ændrer sig

  // Funktion der håndterer klik på en kategori og navigerer til den valgte kategori
  const handleCategoryClick = (categoryId) => {
    navigate(`/produkter?category=${categoryId}`); // Navigerer til produkt-siden med den valgte kategori
    setSelectedCategory(categoryId); // Sætter den valgte kategori i state
    onCategoryChange(categoryId); // Kalder callback-funktion hvis en kategori ændres
  };

  // Funktion til at generere breadcrumbs baseret på URL path og query parametre
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x); // Splitter URL path og filtrerer tomme elementer
    const breadcrumbs = pathnames.map((path, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`; // Bygger den komplette sti op til dette path segment
      const breadcrumbTitle = breadcrumbTitles[path] || decodeURIComponent(path); // Får breadcrumb titel, eller default til URL segmentet
      return { path: breadcrumbTitle, to, key: `${to}-${index}` }; // Returnerer breadcrumb objekt
    });

    const urlParams = new URLSearchParams(location.search);
    const categoryId = urlParams.get('category');
    if (categoryId && breadcrumbTitles['selectedCategory']) {
      breadcrumbs.push({ path: breadcrumbTitles['selectedCategory'], to: location.pathname, key: `category-${categoryId}` }); // Tilføjer kategori breadcrumb
    }

    // Hvis vi er på en nyhedsside, tilføj nyhedstitlen
    if (location.pathname.includes('/nyheder/') && breadcrumbTitles['newsTitle']) {
      breadcrumbs[breadcrumbs.length - 1].path = breadcrumbTitles['newsTitle']; // Opdaterer sidste breadcrumb til nyhedstitlen
    }

    return breadcrumbs; // Returnerer den komplette liste af breadcrumbs
  };

  const breadcrumbs = getBreadcrumbs(); // Genererer breadcrumbs baseret på nuværende URL

  return (
    <div className={styles.layout}>
      {/* Header-sektion med BurgerMenu, logo og slideshow */}
      <header className={styles.header}>
        <BurgerMenu />
        <Link to="/">
          <img className={styles.logo} src={logo} alt="logo" />
        </Link>
        <Slideshow images={[image1,image2,image3,image4,image5,image6,image7,image8]} showDots={false} />
      </header>
      
      {/* Navigation med kategorier */}
      <nav className={styles.menu}>
        {loading && <p>Loading...</p>} {/* Viser loading-tekst hvis data hentes */}
        {error && <p>{error}</p>} {/* Viser fejlbesked hvis der er en fejl */}
        {!loading && !error && categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={category.id === selectedCategory ? styles.active : ''}
          >
            {category.title} {/* Viser kategoriens titel */}
          </button>
        ))}
      </nav>
      
      {/* Breadcrumbs sektion */}
      <div className={styles.breadcrumbs}>
        <p>Du er her: Home / {breadcrumbs.map((breadcrumb, index) => (
          <Fragment key={breadcrumb.key}>
            <Link to={breadcrumb.to} className={styles.link}>{breadcrumb.path}</Link>
            {index < breadcrumbs.length - 1 && ' / '} {/* Tilføjer '/' mellem breadcrumbs */}
          </Fragment>
        ))}</p>
        <h2>{breadcrumbs[breadcrumbs.length - 1]?.path || 'Home'}</h2> {/* Viser titlen på den aktuelle side */}
      </div>

      {/* Hovedindhold af siden */}
      <main className={styles.main}>
        {children} {/* Indhold, der bliver passet som props fra forælderkomponenten */}
      </main>
      
      {/* Footer sektion */}
      <Footer />
    </div>
  );
};

export default Layout;
