import React, { useState } from 'react';
import './ProductList.module.scss';

const ProductList = () => {
  const [sortOrder, setSortOrder] = useState('alphabetical');

  const products = [
    { title: 'Surdejsbrød', teaser: 'Lækkert surdejsbrød', likes: 15 },
    { title: 'Kanelboller', teaser: 'Lækre kanelboller', likes: 30 }
  ];

  const sortedProducts = products.sort((a, b) => {
    if (sortOrder === 'alphabetical') return a.title.localeCompare(b.title);
    if (sortOrder === 'popularity') return b.likes - a.likes;
    return 0;
  });

  return (
    <div className="product-list">
      <select onChange={(e) => setSortOrder(e.target.value)}>
        <option value="alphabetical">Alfabetisk</option>
        <option value="popularity">Popularitet</option>
      </select>
      <div className="product-grid">
        {sortedProducts.map((product, index) => (
          <div key={index} className="product-item">
            <img src={`/images/${product.title}.jpg`} alt={product.title} className="product-image" />
            <h3>{product.title}</h3>
            <p>{product.teaser}</p>
            <button>Læs mere</button>
            <span>{product.likes} likes</span>
            <button>❤️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
