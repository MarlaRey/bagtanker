import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../../supabase';
import styles from './ProductDetails.module.scss';
import LikeButton from '../../components/LikeButton/LikeButton';


const ProductDetail = () => {
  const { title } = useParams(); // Hent title fra URL
  const [product, setProduct] = useState(null);
  const [productImageUrl, setProductImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [user, setUser] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const navigate = useNavigate();

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
          .eq('product_id', productData.id)
          .order('created_at', { ascending: false });

        if (commentsError) {
          console.error('Comments fetch error:', commentsError);
          setError('Error fetching comments');
        } else {
          setComments(commentsData);
        }

        // Fetch ingredients
        const { data: ingredientProductData, error: ingredientProductError } = await supabase
          .from('ingredient_product_rel')
          .select('ingredient_id, unit_id, amount')
          .eq('product_id', productData.id);

        if (ingredientProductError) {
          console.error('Ingredient product fetch error:', ingredientProductError);
          setError('Error fetching ingredients');
        } else {
          const ingredientIds = ingredientProductData.map(rel => rel.ingredient_id);
          const unitIds = ingredientProductData.map(rel => rel.unit_id);

          const { data: ingredientsData, error: ingredientsError } = await supabase
            .from('ingredients')
            .select('id, title')
            .in('id', ingredientIds);

          const { data: unitsData, error: unitsError } = await supabase
            .from('units')
            .select('id, abbreviation')
            .in('id', unitIds);

          if (ingredientsError || unitsError) {
            console.error('Error fetching ingredients or units:', ingredientsError || unitsError);
            setError('Error fetching ingredients');
          } else {
            const ingredientList = ingredientProductData.map(rel => {
              const ingredient = ingredientsData.find(ing => ing.id === rel.ingredient_id);
              const unit = unitsData.find(u => u.id === rel.unit_id);
              return {
                name: ingredient ? ingredient.title : 'Unknown',
                amount: rel.amount,
                unit: unit ? unit.abbreviation : 'Unknown'
              };
            });
            setIngredients(ingredientList);
          }
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
            title: newTitle,
            comment: newComment,
            user_id: user.id,
            product_id: productData.id,
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
      <div className={styles.productDescription}>
        <div className={styles.productContent}>
          {productImageUrl ? (
            <img src={productImageUrl} alt={product?.title} />
          ) : (
            <p>No image available</p>
          )}
          <p className={styles.teaser}>{product?.teaser}</p>
          <p className={styles.description}>{product?.description}</p>
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.detailsHeader}>
            <h4>Opskrift</h4>
            <LikeButton
                    productId={product.id}
                    initialLikesCount={product.likes_count}
                    initialLiked={false} // Assuming initial liked status is false
                  />
          </div>
          <div className={styles.detailsBox}>
            <p><strong>Varighed:</strong> {product?.duration} minutter</p>
            <p><strong>Antal:</strong> {product?.amount}</p>
            <ul>
              <p><strong>Ingredienser:</strong></p>
              {ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient.name} - {ingredient.amount} {ingredient.unit}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>



      <div className={styles.commentsSection}>
        <h2>Kommentarer</h2>
        <div className={styles.commentsList}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <h4><strong>{comment.title}</strong></h4>
              <p className={styles.commentDate}>{new Date(comment.created_at).toLocaleDateString()}</p>
              <p>{comment.comment}</p>
              <hr className={styles.commentSeparator} />
            </div>
          ))}
        </div>
        
        <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
          <h4>Skriv en kommentar</h4>
          <input
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            placeholder="Dit navn"
            required
          />
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Skriv din kommentar her..."
            required
          />
          <button type="submit">Tilføj kommentar til produktet</button>
        </form>
      </div>
    </div>
  );
}

export default ProductDetail;
