import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../../supabase';
import { AuthContext } from '../../context/AuthContext';
import styles from './MinSide.module.scss';
import LikeButton from '../../components/LikeButton/LikeButton';
import { Helmet } from 'react-helmet';

const MinSide = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [user, setUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch liked products
        const { data: favorites, error: favoriteError } = await supabase
          .from('favorite_rows')
          .select('product_id')
          .eq('user_id', user.id);

        if (favoriteError) {
          console.error('Error fetching liked products', favoriteError);
          return;
        }

        if (favorites.length > 0) {
          const productIds = favorites.map(favorite => favorite.product_id);

          const { data: products, error: productError } = await supabase
            .from('products')
            .select('*')
            .in('id', productIds);

          if (productError) {
            console.error('Error fetching products', productError);
          } else {
            setLikedProducts(products);
          }
        }

        // Fetch user comments and join with product titles
        const { data: comments, error: commentsError } = await supabase
          .from('user_comments')
          .select('*, products(title)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (commentsError) {
          console.error('Error fetching user comments', commentsError);
        } else {
          setUserComments(comments);
        }
      }
    };

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const handleUnlike = async () => {
    // Refresh liked products after unlike action
    const { data: favorites, error: favoriteError } = await supabase
      .from('favorite_rows')
      .select('product_id')
      .eq('user_id', user.id);

    if (favoriteError) {
      console.error('Error fetching liked products', favoriteError);
      return;
    }

    if (favorites.length > 0) {
      const productIds = favorites.map(favorite => favorite.product_id);

      const { data: products, error: productError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (productError) {
        console.error('Error fetching products', productError);
      } else {
        setLikedProducts(products);
      }
    } else {
      setLikedProducts([]);
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditedComment(comment.comment);
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    setEditedComment(e.target.value);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('user_comments')
        .update({ comment: editedComment })
        .eq('id', editingCommentId);

      if (error) {
        console.error('Error updating comment:', error);
      } else {
        setIsEditing(false);
        setEditingCommentId(null);
        setEditedComment('');
        const { data: comments, error: commentsError } = await supabase
          .from('user_comments')
          .select('*, products(title)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (commentsError) {
          console.error('Error fetching user comments', commentsError);
        } else {
          setUserComments(comments);
        }
      }
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteClick = async (commentId) => {
    if (window.confirm('Er du sikker på, at du vil slette denne kommentar?')) {
      try {
        const { error } = await supabase
          .from('user_comments')
          .delete()
          .eq('id', commentId);

        if (error) {
          console.error('Error deleting comment:', error);
        } else {
          setUserComments(userComments.filter(comment => comment.id !== commentId));
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
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
