import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../../supabase';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                if (!id) return; // Ensures id is valid

                const { data: productData, error: productError } = await supabase
                    .from('products')
                    .select('id, title, description, image_id')
                    .eq('id', id)
                    .single();

                if (productError) throw productError;

                setProduct(productData);

    
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProductDetails();
    }, [id]);

    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>Loading...</div>;

    return (
        <div>
            <h1>{product.title}</h1>
            <p>{product.description}</p>

        </div>
    );
};

export default ProductDetails;
