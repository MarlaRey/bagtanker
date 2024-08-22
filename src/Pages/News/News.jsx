import React from 'react';
import styles from './News.module.scss'; 
import { Helmet } from 'react-helmet';

const News = () => {
  return (
    <div className={styles.news}> 
          <Helmet>
        <title>Bagtanker | Nyheder</title>
      </Helmet>
      <h2>No news is good news</h2>

    </div>
  );
};

export default News;
