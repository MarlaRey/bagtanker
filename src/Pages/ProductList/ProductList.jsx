// src/components/ProductList/ProductList.jsx
import React, { useState, useEffect } from 'react';
import supabase from '../../../supabase';
import styles from './ProductList.module.scss';
import LikeButton from '../../components/LikeButton/LikeButton';

const ProductList = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('alphabetical');

  // Fetch products based on selected category and include images
  useEffect(() => {
    if (selectedCategory) {
      const fetchProducts = async () => {
        setLoading(true);

        try {
          // Fetch products with images
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
            .eq('category_id', selectedCategory);

          if (productsError) throw productsError;

          // Fetch all likes
          const { data: likesData, error: likesError } = await supabase
            .from('favorite_rows')
            .select('product_id');

          if (likesError) throw likesError;

          // Calculate likes count per product
          const likesCount = likesData.reduce((acc, { product_id }) => {
            acc[product_id] = (acc[product_id] || 0) + 1;
            return acc;
          }, {});

          // Combine products data with likes count
          const productsWithImagesAndLikes = productsData.map(item => ({
            ...item.products,
            image_url: item.products.images ? item.products.images.filename : null,
            likes_count: likesCount[item.products.id] || 0,
          }));

          sortProducts(productsWithImagesAndLikes);
        } catch (error) {
          console.error('Error fetching products or likes', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [selectedCategory, sortType]);

  // Function to sort the products based on the selected sort type
  const sortProducts = (productsList) => {
    if (sortType === 'alphabetical') {
      productsList.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === 'popularity') {
      productsList.sort((a, b) => b.likes_count - a.likes_count);
    }
    setProducts(productsList);
  };

  // Handle sort type change
  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };

  return (
    <div className={styles.productList}>
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
              <div> 
                <img src={product.image_url} alt={product.title} />
              </div>
              <h3>{product.title}</h3>
              <p>{product.teaser}</p>
              <div className={styles.productActions}>
                <button className={styles.readMore}>Read More</button>
                <LikeButton
                  productId={product.id}
                  initialLikesCount={product.likes_count}
                  initialLiked={false} // Assuming initial liked status is false
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
