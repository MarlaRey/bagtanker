import React, { useState, useEffect } from 'react';
import styles from './Slideshow.module.scss';

// Slideshow-komponent, der viser en række billeder i et slideshow
const Slideshow = ({ images, showDots = true, fullHeight = false }) => {
  // State til at holde styr på det aktuelle billede, der vises
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Sætter et interval til automatisk at skifte billede hvert 10. sekund
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    // Rydder intervallet, når komponenten unmountes
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={`${styles.slideshow} ${fullHeight ? styles.fullHeight : ''}`}>
      {/* Viser det aktuelle billede */}
      <img src={images[currentImageIndex]} alt="Slideshow" className={styles['slideshow-image']} />
      
      {showDots && (
        <div className={styles['slideshow-dots']}>
          {/* Viser dot-navigation, der indikerer det aktuelle billede */}
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
