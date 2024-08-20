// src/components/LikeButton/LikeButton.js
import React, { useState, useEffect } from 'react';
import supabase from '../../../supabase';
import styles from './LikeButton.module.scss';

const LikeButton = ({ productId, initialLikesCount, initialLiked, onUpdate }) => {
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [liked, setLiked] = useState(initialLiked);
  const [user, setUser] = useState(null); // For user authentication

  // Fetch the current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // Handle like/unlike functionality
  const handleLike = async () => {
    if (!user) {
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
      } else {
        // Like the product
        const { error } = await supabase
          .from('favorite_rows')
          .insert({ user_id: user.id, product_id: productId });

        if (error) throw error;

        setLikesCount(likesCount + 1);
      }
      setLiked(!liked);
      if (onUpdate) onUpdate(); // Notify parent component of update
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
