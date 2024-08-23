import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../../supabase';
import styles from './LikeButton.module.scss';
import { AuthContext } from '../../context/AuthContext';

const LikeButton = ({ productId, initialLikesCount, initialLiked, onUpdate }) => {
  // State til at holde styr på antallet af likes og om produktet er liked af brugeren
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [liked, setLiked] = useState(initialLiked);

  // Hent login-status fra AuthContext
  const { isLoggedIn } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn) {
        // Hent brugeroplysninger fra Supabase, hvis brugeren er logget ind
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Tjek om brugeren allerede har liket produktet
          const { data: favorite, error } = await supabase
            .from('favorite_rows')
            .select('*')
            .eq('user_id', user.id)
            .eq('product_id', productId)
            .single();

          if (error) {
            console.error('Fejl ved hentning af favoritstatus', error);
          } else {
            setLiked(!!favorite);
          }
        }
      } else {
        // For brugere der ikke er logget ind, nulstil liked status
        setLiked(false);
      }
    };

    fetchUser();
  }, [isLoggedIn, productId]); // Opdater når login-status eller produkt-id ændres

  const handleLike = async () => {
    if (!isLoggedIn) {
      // Hvis brugeren ikke er logget ind, vis en besked
      alert('Log ind for at like produkter.');
      return;
    }

    try {
      if (liked) {
        // Hvis produktet allerede er liket, fjern like
        const { error } = await supabase
          .from('favorite_rows')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;

        setLikesCount(likesCount - 1);
        setLiked(false);
      } else {
        // Like produktet kun hvis det ikke allerede er liket
        const { data, error } = await supabase
          .from('favorite_rows')
          .insert({ user_id: user.id, product_id: productId });

        if (error) throw error;

        setLikesCount(likesCount + 1);
        setLiked(true);
      }
      // Kald onUpdate funktionen, hvis den er givet som prop
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Fejl ved liking/unliking af produkt', error);
    }
  };

  return (
    <div className={styles.likes}>
      {/* Vis antallet af likes, hvis det er større end 0 */}
      <span>{likesCount > 0 ? likesCount : ''}</span>
      {/* Like-knappen, ændrer stil og ikon afhængigt af liked status */}
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
