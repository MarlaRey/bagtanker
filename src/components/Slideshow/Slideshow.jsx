import React, { useState, useEffect } from 'react';
import styles from './Slideshow.module.scss';

const Slideshow = ({ images, showDots = true, fullHeight = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={`${styles.slideshow} ${fullHeight ? styles.fullHeight : ''}`}>
      <img src={images[currentImageIndex]} alt="Slideshow" className={styles['slideshow-image']} />
      {showDots && (
        <div className={styles['slideshow-dots']}>
          {images.map((_, index) => (
            <span
              key={index}
              className={index === currentImageIndex ? styles.active : ''}
              onClick={() => setCurrentImageIndex(index)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Slideshow;
