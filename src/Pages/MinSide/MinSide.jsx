import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../../supabase';
import { AuthContext } from '../../context/AuthContext';
import styles from './MinSide.module.scss';
import LikeButton from '../../components/LikeButton/LikeButton';
import { Helmet } from 'react-helmet';

const MinSide = () => {
  const [likedProducts, setLikedProducts] = useState([]); // State til at gemme brugerens favoritter
  const [userComments, setUserComments] = useState([]); // State til at gemme brugerens kommentarer
  const [user, setUser] = useState(null); // State til at gemme den autentificerede bruger
  const [editingCommentId, setEditingCommentId] = useState(null); // State til at holde styr på, hvilken kommentar der redigeres
  const [editedComment, setEditedComment] = useState(''); // State til at holde den redigerede kommentar
  const [isEditing, setIsEditing] = useState(false); // State til at indikere om der er en kommentar i redigering
  const { isLoggedIn } = useContext(AuthContext); // Henter login-status fra AuthContext

  useEffect(() => {
    const fetchUserData = async () => {
      // Henter den autentificerede bruger
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Henter brugerens favoritter
        const { data: favorites, error: favoriteError } = await supabase
          .from('favorite_rows')
          .select('product_id')
          .eq('user_id', user.id);

        if (favoriteError) {
          console.error('Fejl ved hentning af favoritter', favoriteError);
          return;
        }

        if (favorites.length > 0) {
          const productIds = favorites.map(favorite => favorite.product_id);

          // Henter produkter baseret på ID'er fra favoritter
          const { data: products, error: productError } = await supabase
            .from('products')
            .select('*')
            .in('id', productIds);

          if (productError) {
            console.error('Fejl ved hentning af produkter', productError);
          } else {
            setLikedProducts(products); // Opdaterer state med favoritter
          }
        }

        // Henter brugerens kommentarer og tilknytter produkt-titler
        const { data: comments, error: commentsError } = await supabase
          .from('user_comments')
          .select('*, products(title)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (commentsError) {
          console.error('Fejl ved hentning af brugerkommentarer', commentsError);
        } else {
          setUserComments(comments); // Opdaterer state med kommentarer
        }
      }
    };

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const handleUnlike = async () => {
    // Opdaterer listen over favoritter efter fjernelse
    const { data: favorites, error: favoriteError } = await supabase
      .from('favorite_rows')
      .select('product_id')
      .eq('user_id', user.id);

    if (favoriteError) {
      console.error('Fejl ved hentning af favoritter', favoriteError);
      return;
    }

    if (favorites.length > 0) {
      const productIds = favorites.map(favorite => favorite.product_id);

      // Henter produkter baseret på opdaterede favoritter
      const { data: products, error: productError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (productError) {
        console.error('Fejl ved hentning af produkter', productError);
      } else {
        setLikedProducts(products); // Opdaterer state med opdaterede favoritter
      }
    } else {
      setLikedProducts([]); // Ingen favoritter tilbage
    }
  };

  const handleEditClick = (comment) => {
    // Starter redigeringsmodus for den valgte kommentar
    setEditingCommentId(comment.id);
    setEditedComment(comment.comment);
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    setEditedComment(e.target.value); // Opdaterer den redigerede kommentar
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Opdaterer kommentar i databasen
      const { error } = await supabase
        .from('user_comments')
        .update({ comment: editedComment })
        .eq('id', editingCommentId);

      if (error) {
        console.error('Fejl ved opdatering af kommentar:', error);
      } else {
        setIsEditing(false);
        setEditingCommentId(null);
        setEditedComment('');
        // Henter opdaterede kommentarer
        const { data: comments, error: commentsError } = await supabase
          .from('user_comments')
          .select('*, products(title)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (commentsError) {
          console.error('Fejl ved hentning af brugerkommentarer', commentsError);
        } else {
          setUserComments(comments); // Opdaterer state med opdaterede kommentarer
        }
      }
    } catch (error) {
      console.error('Fejl ved redigering af kommentar:', error);
    }
  };

  const handleDeleteClick = async (commentId) => {
    if (window.confirm('Er du sikker på, at du vil slette denne kommentar?')) {
      try {
        // Sletter kommentar fra databasen
        const { error } = await supabase
          .from('user_comments')
          .delete()
          .eq('id', commentId);

        if (error) {
          console.error('Fejl ved sletning af kommentar:', error);
        } else {
          setUserComments(userComments.filter(comment => comment.id !== commentId)); // Opdaterer state med slettede kommentarer
        }
      } catch (error) {
        console.error('Fejl ved sletning af kommentar:', error);
      }
    }
  };

  if (!isLoggedIn) {
    return <p>Log venligst ind for at se dine favoritter og kommentarer.</p>;
  }

  return (
    <div className={styles.mainContainer}>
      <Helmet>
        <title>Bagtanker | Min side</title>
      </Helmet>
      <div className={styles.commentsList}>
        <h3>Mine favoritter</h3>
        {likedProducts.length > 0 ? (
          <ul>
            {likedProducts.map(product => (
              <li key={product.id} className={styles.likeList}>
                <div className={styles.favoriteButton}>
                  <LikeButton
                    className={styles.likeButton}
                    productId={product.id}
                    initialLiked={true}
                    onUpdate={handleUnlike} // Opdaterer favoritterne, når produktet fjernes
                  />
                </div>
                <div>
                  <Link to={`/product/${encodeURIComponent(product.title)}`}>
                    {product.title}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Du har ingen favoritter endnu.</p>
        )}
      </div>
      <div className={styles.commentsList}>
        <h3>Mine kommentarer</h3>
        {userComments.length > 0 ? (
          <ul>
            {userComments.map(comment => (
              <li key={comment.id} className={styles.commentItem}>
                <p>
                  <strong>Produkt: </strong>
                  <Link to={`/product/${encodeURIComponent(comment.products.title)}`} className={styles.comment}>
                    {comment.products.title}
                  </Link>
                </p>
                <p className={styles.comment}>{comment.comment}</p>
                <div className={styles.buttons}>
                  <button onClick={() => handleEditClick(comment)} className={styles.button}>Rediger</button>
                  <button onClick={() => handleDeleteClick(comment.id)} className={styles.button}>Slet</button>
                </div>

                {/* Redigeringsformular vises kun for den aktuelle kommentar */}
                {isEditing && editingCommentId === comment.id && (
                  <form onSubmit={handleEditSubmit} className={styles.editForm}>
                    <textarea
                      value={editedComment}
                      onChange={handleEditChange}
                      required
                    />
                    <button type="submit">Gem ændringer</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Annuller</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Du har ingen kommentarer endnu.</p>
        )}
      </div>
    </div>
  );
};

export default MinSide;
