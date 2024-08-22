import React, { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import Slideshow from '../../components/Slideshow/Slideshow';
import supabase from '../../../supabase';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Home = () => {
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

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    // Function to truncate text
    const truncateText = (text, maxLength) => {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    };

  useEffect(() => {
    const fetchNewsAndImages = async () => {
      try {
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

        const newsWithImages = newsData.map(newsItem => ({
          ...newsItem,
          image_url: newsItem.images ? newsItem.images.filename : null,
        }));

        setNews(newsWithImages);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchNewsAndImages();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.home}>
            <Helmet>
        <title>Bagtanker | Seneste nyt</title>
      </Helmet>
      <Slideshow images={images} showDots={true} fullHeight={true} />
      <header>
        <img src="src/assets/images/Logo.png" alt="Bagtanker Logo" className={styles.logo} />
      </header>

      <h2 className={styles['news-heading']}>Nyheder</h2> {/* Tilføjet h2 her */}

      <div className={styles['news-section']}>
        <div className={styles['news-grid']}>
          {news.map((newsItem) => (
            <div key={newsItem.id} className={styles['news-item']}>
              <div> 
                <img src={newsItem.image_url} alt={newsItem.title} />
              </div>
              <div>
                <p>{new Date(newsItem.created_at).toLocaleDateString()}</p>
                <h3>{newsItem.title}</h3>
                <p>{truncateText(newsItem.teaser, 110)}</p>
                <Link to={`/nyheder/${newsItem.id}`} className={styles['read-more-button']}>
                  Read more
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
