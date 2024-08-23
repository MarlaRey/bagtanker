import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../../supabase';
import styles from './ProductDetails.module.scss';
import LikeButton from '../../components/LikeButton/LikeButton';
import { Helmet } from 'react-helmet';

const ProductDetail = () => {
  const { title } = useParams(); // Hent title fra URL
  const [product, setProduct] = useState(null); // State til at gemme produktdata
  const [productImageUrl, setProductImageUrl] = useState(null); // State til at gemme produktbillede-URL
  const [loading, setLoading] = useState(true); // State til at indikere om data er ved at blive hentet
  const [error, setError] = useState(null); // State til at gemme fejlmeddelelser
  const [comments, setComments] = useState([]); // State til at gemme kommentarer
  const [newComment, setNewComment] = useState(''); // State til ny kommentar
  const [newTitle, setNewTitle] = useState(''); // State til titel på ny kommentar
  const [user, setUser] = useState(null); // State til brugerdata
  const [ingredients, setIngredients] = useState([]); // State til ingredienser
  const navigate = useNavigate(); // Hook til navigation

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // Henter produktdetaljer baseret på title
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('title', title)
          .single();

        if (productError) {
          console.error('Fejl ved hentning af produkt:', productError);
          setError('Fejl ved hentning af produkt');
          setLoading(false);
          return;
        }

        setProduct(productData);

        // Henter produktbillede, hvis det findes
        if (productData && productData.image_id) {
          const { data: imageData, error: imageError } = await supabase
            .from('images')
            .select('filename')
            .eq('id', productData.image_id)
            .single();

          if (imageError) {
            console.error('Fejl ved hentning af billede:', imageError);
            setError('Fejl ved hentning af billede');
          } else {
            const imageUrl = imageData.filename;
            setProductImageUrl(imageUrl);
          }
        }

        // Henter kommentarer til produktet
        const { data: commentsData, error: commentsError } = await supabase
          .from('user_comments')
          .select('*')
          .eq('product_id', productData.id)
          .order('created_at', { ascending: false });

        if (commentsError) {
          console.error('Fejl ved hentning af kommentarer:', commentsError);
          setError('Fejl ved hentning af kommentarer');
        } else {
          setComments(commentsData);
        }

        // Henter ingredienser til produktet
        const { data: ingredientProductData, error: ingredientProductError } = await supabase
          .from('ingredient_product_rel')
          .select('ingredient_id, unit_id, amount')
          .eq('product_id', productData.id);

        if (ingredientProductError) {
          console.error('Fejl ved hentning af ingredienser:', ingredientProductError);
          setError('Fejl ved hentning af ingredienser');
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
            console.error('Fejl ved hentning af ingredienser eller enheder:', ingredientsError || unitsError);
            setError('Fejl ved hentning af ingredienser');
          } else {
            const ingredientList = ingredientProductData.map(rel => {
              const ingredient = ingredientsData.find(ing => ing.id === rel.ingredient_id);
              const unit = unitsData.find(u => u.id === rel.unit_id);
              return {
                name: ingredient ? ingredient.title : 'Ukendt',
                amount: rel.amount,
                unit: unit ? unit.abbreviation : 'Ukendt'
              };
            });
            setIngredients(ingredientList);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Fejl ved hentning af data:', error);
        setError('Fejl ved hentning af data');
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchProductDetails();
    fetchUser();
  }, [title]); // Effekt afhænger af title, som hentes fra URL

  // Håndterer ændringer i kommentarinput
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Håndterer ændringer i titelinput
  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  // Håndterer indsendelse af ny kommentar
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      alert('Du skal være logget ind for at kommentere.');
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
        console.error('Fejl ved tilføjelse af kommentar:', error);
        setError('Fejl ved tilføjelse af kommentar');
      } else {
        setNewComment('');
        setNewTitle('');
        // Hent nye kommentarer efter indsættelse
        const { data: commentsData, error: commentsError } = await supabase
          .from('user_comments')
          .select('*')
          .eq('product_id', productData.id)
          .order('created_at', { ascending: false });
  
        if (commentsError) {
          console.error('Fejl ved hentning af kommentarer:', commentsError);
          setError('Fejl ved hentning af kommentarer');
        } else {
          setComments(commentsData);
        }
      }
    } catch (error) {
      console.error('Fejl ved indsendelse af kommentar:', error);
      setError('Fejl ved indsendelse af kommentar');
    }
  };

  if (loading) return <p>Henter produktdetaljer...</p>; // Viser loading-tekst mens data hentes
  if (error) return <p>{error}</p>; // Viser fejlmeddelelse, hvis der opstod en fejl

  return (
    <div className={styles.productDetailPage}>
      <Helmet>
        <title>{product ? `${product.title}` : 'Loading...'}</title>
      </Helmet>
      <div className={styles.productDescription}>
        <div className={styles.productContent}>
          {productImageUrl ? (
            <img src={productImageUrl} alt={product?.title} />
          ) : (
            <p>Intet billede tilgængeligt</p>
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
              initialLiked={false} // Antager at initial liked status er false
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
