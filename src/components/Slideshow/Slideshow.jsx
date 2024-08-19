import React, { useEffect, useState } from 'react';
import './Slideshow.module.scss';

const Slideshow = ({ images }) => {
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
    <div className="slideshow">
      <img src={images[currentImageIndex]} alt="Slideshow" className="slideshow-image" />
      <div className="slideshow-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={index === currentImageIndex ? 'active' : ''}
            onClick={() => setCurrentImageIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
