import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../../supabase';
import styles from './ProductDetails.module.scss'; // Juster importen af styles hvis nødvendigt

const ProductDetail = () => {
  const { title } = useParams(); // Hent title fra URL
  const [product, setProduct] = useState(null);
  const [productImageUrl, setProductImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // Fetch product details using title
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('title', title)
          .single();

        if (productError) {
          console.error('Product fetch error:', productError);
          setError('Error fetching product');
          setLoading(false);
          return;
        }

        setProduct(productData);

        // Fetch product image if exists
        if (productData && productData.image_id) {
          const { data: imageData, error: imageError } = await supabase
            .from('images')
            .select('filename')
            .eq('id', productData.image_id)
            .single();

          if (imageError) {
            console.error('Image fetch error:', imageError);
            setError('Error fetching image');
          } else {
            const imageUrl = imageData.filename;
            setProductImageUrl(imageUrl);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [title]);

  const handleBackButtonClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.productDetailPage}>

      <div className={styles.productContent}>
        {productImageUrl ? (
          <img src={productImageUrl} alt={product?.title} />
        ) : (
          <p>No image available</p>
        )}
        <p>{product?.description}</p>
        <button onClick={handleBackButtonClick} className={styles.backButton}>
          Back
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
