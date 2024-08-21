import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../../supabase';
import { AuthContext } from '../../context/AuthContext';

const MinSide = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      // Fetch the logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch the list of liked product IDs from favorite_rows
        const { data: favorites, error } = await supabase
          .from('favorite_rows')
          .select('product_id')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching liked products', error);
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
      }
    };

    if (isLoggedIn) {
      fetchLikedProducts();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <p>Please log in to view your liked products.</p>;
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
    </div>
  );
};

export default MinSide;
