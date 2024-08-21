import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../../supabase';
import styles from './ProductDetails.module.scss';

const ProductDetail = () => {
  const { title } = useParams(); // Hent title fra URL
  const [product, setProduct] = useState(null);
  const [productImageUrl, setProductImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [user, setUser] = useState(null); // User state for authentication
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

        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('user_comments')
          .select('*')
          .eq('product_id', productData.id) // Filter by product_id
          .order('created_at', { ascending: false });

        if (commentsError) {
          console.error('Comments fetch error:', commentsError);
          setError('Error fetching comments');
        } else {
          setComments(commentsData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchProductDetails();
    fetchUser();
  }, [title]);

  const handleBackButtonClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      alert('You must be logged in to comment.');
      return;
    }
  
    try {
      const { data: productData } = await supabase
        .from('products')
        .select('id')
        .eq('title', title)
        .single();

      const { error } = await supabase
        .from('user_comments')
        .insert([
          {
            title: newTitle, // Use newTitle for the name field
            comment: newComment,
            user_id: user.id, // Use user's ID
            product_id: productData.id, // Use the product's ID
            created_at: new Date().toISOString()
          }
        ]);
  
      if (error) {
        console.error('Error adding comment:', error);
        setError('Error adding comment');
      } else {
        setNewComment('');
        setNewTitle('');
        // Fetch new comments after submission
        const { data: commentsData, error: commentsError } = await supabase
          .from('user_comments')
          .select('*')
          .eq('product_id', productData.id)
          .order('created_at', { ascending: false });
  
        if (commentsError) {
          console.error('Comments fetch error:', commentsError);
          setError('Error fetching comments');
        } else {
          setComments(commentsData);
        }
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Error submitting comment');
    }
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

      <div className={styles.commentsSection}>
        <h3>Kommentarer</h3>
        <div className={styles.commentsList}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <p><strong>{comment.title}</strong> <em>({new Date(comment.created_at).toLocaleDateString()})</em></p>
              <p>{comment.comment}</p>
              <hr className={styles.commentSeparator} />
            </div>
          ))}
        </div>
        
        <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
          <input
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            placeholder="Your Name"
            required
          />
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Write your comment here..."
            required
          />
          <button type="submit">Submit Comment</button>
        </form>
      </div>
    </div>
  );
}

export default ProductDetail;
