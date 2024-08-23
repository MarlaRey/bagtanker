import React, { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import Slideshow from '../../components/Slideshow/Slideshow';
import supabase from '../../../supabase';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Home = () => {
  // Liste over billeder til slideshow
  const images = [
    'src/assets/images/bread-full02.jpeg',
    'src/assets/images/bread-full03.jpeg',
    'src/assets/images/bread-full04.jpeg',
    'src/assets/images/bread-full05.jpeg',
    'src/assets/images/bread-full06.jpeg',
    'src/assets/images/bread-full07.jpeg',
    'src/assets/images/bread-full08.jpeg',
    'src/assets/images/bread-full09.jpeg'
  ];

  const [news, setNews] = useState([]); // State til at gemme nyheder
  const [loading, setLoading] = useState(true); // State til at indikere om data er ved at blive hentet
  const [error, setError] = useState(null); // State til at gemme fejlmeddelelser

  // Funktion til at forkorte tekst
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  useEffect(() => {
    const fetchNewsAndImages = async () => {
      try {
        // Henter nyheder og tilknyttede billeder fra Supabase
        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select(`
            *,
            images (
              filename
            )
          `);

        if (newsError) {
          throw newsError;
        }

        // Tilføjer billed-URL til hver nyhed
        const newsWithImages = newsData.map(newsItem => ({
          ...newsItem,
          image_url: newsItem.images ? newsItem.images.filename : null,
        }));

        setNews(newsWithImages); // Opdaterer state med nyheder
        setLoading(false); // Data er færdig med at blive hentet
      } catch (error) {
        setError('Fejl ved hentning af data'); // Opdaterer state med fejlmeddelelse
        setLoading(false); // Data er færdig med at blive hentet, trods fejl
      }
    };

    fetchNewsAndImages();
  }, []); // Tom afhængighedsliste betyder, at denne effekt kun kører én gang ved komponentens montering

  if (loading) return <p>Loading...</p>; // Viser loading-tekst mens data hentes
  if (error) return <p>{error}</p>; // Viser fejlmeddelelse, hvis der opstod en fejl

  return (
    <div className={styles.home}>
      <Helmet>
        <title>Bagtanker | Seneste nyt</title>
      </Helmet>
      <Slideshow images={images} showDots={true} fullHeight={true} />
      <header>
        <img src="src/assets/images/Logo.png" alt="Bagtanker Logo" className={styles.logo} />
      </header>

      <h2 className={styles['news-heading']}>Nyheder</h2> {/* Overskrift for nyheder */}

      <div className={styles['news-section']}>
        <div className={styles['news-grid']}>
          {news.map((newsItem) => (
            <div key={newsItem.id} className={styles['news-item']}>
              <div> 
                <img src={newsItem.image_url} alt={newsItem.title} />
              </div>
              <div>
                <p>{new Date(newsItem.created_at).toLocaleDateString()}</p> {/* Viser datoen for nyheden */}
                <h3>{newsItem.title}</h3> {/* Viser nyhedens titel */}
                <p>{truncateText(newsItem.teaser, 110)}</p> {/* Viser en forkortet version af nyhedens teaser */}
                <Link to={`/nyheder/${newsItem.id}`} className={styles['read-more-button']}>
                  Læs mere
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
