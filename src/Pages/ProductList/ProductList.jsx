import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../../../supabase';
import styles from './ProductList.module.scss';
import LikeButton from '../../components/LikeButton/LikeButton';
import { Helmet } from 'react-helmet';

const ProductList = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('alphabetical');
  const location = useLocation();
  const navigate = useNavigate();

  // Function to truncate text
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  // Fetch products based on selected category and include images
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const urlParams = new URLSearchParams(location.search);
        const category = urlParams.get('category') || selectedCategory;

        if (category) {
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

          const { data: likesData, error: likesError } = await supabase
            .from('favorite_rows')
            .select('product_id');

          if (likesError) throw likesError;

          const likesCount = likesData.reduce((acc, { product_id }) => {
            acc[product_id] = (acc[product_id] || 0) + 1;
            return acc;
          }, {});

          const productsWithImagesAndLikes = productsData.map(item => ({
            ...item.products,
            image_url: item.products.images ? item.products.images.filename : null,
            likes_count: likesCount[item.products.id] || 0,
          }));

          sortProducts(productsWithImagesAndLikes);
        }
      } catch (error) {
        console.error('Error fetching products or likes', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, sortType, location.search]);

  // Function to sort the products based on the selected sort type
  const sortProducts = (productsList) => {
    if (sortType === 'alphabetical') {
      productsList.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === 'popularity') {
      productsList.sort((a, b) => b.likes_count - a.likes_count);
    }
    setProducts(productsList);
  };

  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };

  const handleReadMore = async (productId) => {
    try {
      const selectedProduct = products.find(item => item.id === productId);

      if (!selectedProduct) {
        throw new Error('Selected product not found');
      }

      const { data: imageData, error: imageError } = await supabase
        .from('images')
        .select('*');

      if (imageError) {
        throw imageError;
      }

      navigate(`/product/${encodeURIComponent(selectedProduct.title)}`);
    } catch (error) {
      console.error('Error handling "Read more" click:', error);
    }
  };

  return (
    <div className={styles.productList}>
      <Helmet>
        <title>Bagtanker | Produkter</title>
      </Helmet>
      <div className={styles.sortOptions}>
        <select value={sortType} onChange={handleSortChange}>
          <option value="alphabetical">Sort by Alphabetical</option>
          <option value="popularity">Sort by Popularity</option>
        </select>
      </div>

      {loading ? (
        <p>Loading products...</p>
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
                    Read more
                  </button>
                  <LikeButton
                    productId={product.id}
                    initialLikesCount={product.likes_count}
                    initialLiked={false} // Assuming initial liked status is false
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
