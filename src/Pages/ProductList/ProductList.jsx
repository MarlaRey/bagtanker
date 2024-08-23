import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../../../supabase';
import styles from './ProductList.module.scss';
import LikeButton from '../../components/LikeButton/LikeButton';
import { Helmet } from 'react-helmet';

const ProductList = ({ selectedCategory }) => {
  // State til at gemme produkterne, loading-status og sorteringstype
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('alphabetical');
  const location = useLocation(); // Henter URL-placering
  const navigate = useNavigate(); // Håndterer navigation

  // Funktion til at forkorte tekst
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...'; // Forkorter teksten og tilføjer '...'
    }
    return text;
  };

  // Henter produkter baseret på valgt kategori og inkluderer billeder
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Sætter loading til true før hentning

      try {
        // Henter URL-parametre for at finde den aktuelle kategori
        const urlParams = new URLSearchParams(location.search);
        const category = urlParams.get('category') || selectedCategory;

        if (category) {
          // Henter produkter og billeder fra supabase baseret på kategori
          const { data: productsData, error: productsError } = await supabase
            .from('category_product_rel')
            .select(`
              product_id,
              products (
                id,
                title,
                teaser,
                images (
                  filename
                )
              )
            `)
            .eq('category_id', category);

          if (productsError) throw productsError;

          // Henter antal likes for hvert produkt
          const { data: likesData, error: likesError } = await supabase
            .from('favorite_rows')
            .select('product_id');

          if (likesError) throw likesError;

          // Tæller antal likes for hvert produkt
          const likesCount = likesData.reduce((acc, { product_id }) => {
            acc[product_id] = (acc[product_id] || 0) + 1;
            return acc;
          }, {});

          // Samler produktdata med billeder og antal likes
          const productsWithImagesAndLikes = productsData.map(item => ({
            ...item.products,
            image_url: item.products.images ? item.products.images.filename : null,
            likes_count: likesCount[item.products.id] || 0,
          }));

          // Sorterer produkterne baseret på sorteringstype
          sortProducts(productsWithImagesAndLikes);
        }
      } catch (error) {
        console.error('Fejl ved hentning af produkter eller likes', error);
      } finally {
        setLoading(false); // Sætter loading til false efter hentning
      }
    };

    fetchProducts();
  }, [selectedCategory, sortType, location.search]);

  // Funktion til at sortere produkterne baseret på valgt sorteringstype
  const sortProducts = (productsList) => {
    if (sortType === 'alphabetical') {
      productsList.sort((a, b) => a.title.localeCompare(b.title)); // Sorter alfabetisk
    } else if (sortType === 'popularity') {
      productsList.sort((a, b) => b.likes_count - a.likes_count); // Sorter efter popularitet
    }
    setProducts(productsList); // Opdaterer produkterne
  };

  // Håndterer ændring af sorteringstype
  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };

  // Håndterer klik på 'Læs mere' knappen
  const handleReadMore = async (productId) => {
    try {
      const selectedProduct = products.find(item => item.id === productId);

      if (!selectedProduct) {
        throw new Error('Valgt produkt ikke fundet');
      }

      // Henter billeddata fra supabase
      const { data: imageData, error: imageError } = await supabase
        .from('images')
        .select('*');

      if (imageError) {
        throw imageError;
      }

      // Navigerer til produktdetaljesiden
      navigate(`/product/${encodeURIComponent(selectedProduct.title)}`);
    } catch (error) {
      console.error('Fejl ved håndtering af "Læs mere" klik:', error);
    }
  };

  return (
    <div className={styles.productList}>
      <Helmet>
        <title>Bagtanker | Produkter</title>
      </Helmet>
      <div className={styles.sortOptions}>
        <select value={sortType} onChange={handleSortChange}>
          <option value="alphabetical">Sortér alfabetisk</option>
          <option value="popularity">Sortér efter popularitet</option>
        </select>
      </div>

      {loading ? (
        <p>Henter produkter...</p>
      ) : (
        <div className={styles.productsGrid}>
          {products.map(product => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImage}>
                <img src={product.image_url} alt={product.title} />
              </div>
              <div>
                <h3>{product.title}</h3>
                <p>{truncateText(product.teaser, 110)}</p>
                <div className={styles.productActions}>
                  <button 
                    onClick={() => handleReadMore(product.id)} 
                    className={styles.readMore}
                  >
                    Læs mere
                  </button>
                  <LikeButton
                    productId={product.id}
                    initialLikesCount={product.likes_count}
                    initialLiked={false} // Antager at initial liked status er false
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
