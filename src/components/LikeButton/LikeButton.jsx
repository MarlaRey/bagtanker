import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../../supabase';
import styles from './LikeButton.module.scss';
import { AuthContext } from '../../context/AuthContext';

const LikeButton = ({ productId, initialLikesCount, initialLiked, onUpdate }) => {
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [liked, setLiked] = useState(initialLiked);
  const { isLoggedIn } = useContext(AuthContext); // Get login status from AuthContext
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn) {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Check if user has already liked the product
          const { data: favorite, error } = await supabase
            .from('favorite_rows')
            .select('*')
            .eq('user_id', user.id)
            .eq('product_id', productId)
            .single();

          if (error) {
            console.error('Error fetching favorite status', error);
          } else {
            setLiked(!!favorite);
          }
        }
      } else {
        // For non-logged-in users, reset the liked status
        setLiked(false);
      }
    };

    fetchUser();
  }, [isLoggedIn, productId]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert('Please log in to like products.');
      return;
    }

    try {
      if (liked) {
        // Unlike the product
        const { error } = await supabase
          .from('favorite_rows')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;

        setLikesCount(likesCount - 1);
        setLiked(false);
      } else {
        // Like the product only if not already liked
        const { data, error } = await supabase
          .from('favorite_rows')
          .insert({ user_id: user.id, product_id: productId });

        if (error) throw error;

        setLikesCount(likesCount + 1);
        setLiked(true);
      }
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error liking/unliking product', error);
    }
  };

  return (
    <div className={styles.likes}>
      <span>{likesCount > 0 ? likesCount : ''}</span>
      <button
        onClick={handleLike}
        className={`${styles.likeButton} ${liked ? styles.liked : ''}`}
      >
        {liked ? '❤️' : '🤍'}
      </button>
    </div>
  );
};

export default LikeButton;
