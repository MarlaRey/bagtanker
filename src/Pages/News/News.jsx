import React from 'react';
import styles from './News.module.scss'; // Import CSS-modulet som et objekt
import NewsDetail from '../NewsDetail/NewsDetail';

const News = () => {
  return (
    <div className={styles.news}> {/* Anvend CSS-moduler */}
      <h2>No news is good news</h2>
      <NewsDetail />
    </div>
  );
};

export default News;
