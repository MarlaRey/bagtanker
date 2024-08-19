import React from 'react';
import './ProductDetails.module.scss';

const ProductDetails = () => {
  const product = {
    title: 'Surdejsbrød',
    description: 'Dette er en detaljeret beskrivelse af surdejsbrødet.',
    recipe: '500g mel, 300g vand, 100g surdej...'
  };

  return (
    <div className="product-details">
      <h2>{product.title}</h2>
      <img src="/images/surdejsbrod.jpg" alt={product.title} />
      <p>{product.description}</p>
      <div className="recipe-box">
        <h3>Opskrift</h3>
        <p>{product.recipe}</p>
        <button>❤️ Like</button>
      </div>
      <CommentsSection />
    </div>
  );
};

const CommentsSection = () => {
  const comments = [
    { user: 'Bruger1', comment: 'Dette brød er fantastisk!' },
    { user: 'Bruger2', comment: 'Jeg vil prøve opskriften i weekenden.' }
  ];

  return (
    <div className="comments-section">
      <h3>Kommentarer</h3>
      {comments.map((comment, index) => (
        <div key={index} className="comment">
          <p><strong>{comment.user}</strong>: {comment.comment}</p>
        </div>
      ))}
      <form>
        <textarea placeholder="Skriv en kommentar..." required></textarea>
        <button type="submit">Tilføj kommentar</button>
      </form>
    </div>
  );
};

export default ProductDetails;
