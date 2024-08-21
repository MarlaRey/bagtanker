import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../../supabase';
import { AuthContext } from '../../context/AuthContext';
import styles from './MinSide.module.scss'; // Juster importen af styles hvis nødvendigt

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
      // Fetch the logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch the list of liked product IDs from favorite_rows
        const { data: favorites, error: favoriteError } = await supabase
          .from('favorite_rows')
          .select('product_id')
          .eq('user_id', user.id);

        if (favoriteError) {
          console.error('Error fetching liked products', favoriteError);
          return;
        }

        // If there are liked products, fetch their details from the products table
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

        // Fetch user comments
        const { data: comments, error: commentsError } = await supabase
          .from('user_comments')
          .select('*')
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
        // Refresh user comments
        const { data: comments, error: commentsError } = await supabase
          .from('user_comments')
          .select('*')
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
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const { error } = await supabase
          .from('user_comments')
          .delete()
          .eq('id', commentId);

        if (error) {
          console.error('Error deleting comment:', error);
        } else {
          // Refresh user comments
          const { data: comments, error: commentsError } = await supabase
            .from('user_comments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (commentsError) {
            console.error('Error fetching user comments', commentsError);
          } else {
            setUserComments(comments);
          }
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  if (!isLoggedIn) {
    return <p>Please log in to view your liked products and comments.</p>;
  }

  return (
    <div>
      <h2>My Liked Products</h2>
      {likedProducts.length > 0 ? (
        <ul>
          {likedProducts.map(product => (
            <li key={product.id}>
              <p>{product.title}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't liked any products yet.</p>
      )}

      <h2>My Comments</h2>
      {userComments.length > 0 ? (
        <ul>
          {userComments.map(comment => (
            <li key={comment.id} className={styles.commentItem}>
              <p><strong>Product ID: {comment.product_id}</strong></p>
              <p>{comment.comment}</p>
              <button onClick={() => handleEditClick(comment)}>Edit</button>
              <button onClick={() => handleDeleteClick(comment.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't commented on any products yet.</p>
      )}

      {isEditing && (
        <form onSubmit={handleEditSubmit} className={styles.editForm}>
          <textarea
            value={editedComment}
            onChange={handleEditChange}
            required
          />
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default MinSide;
