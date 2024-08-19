import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../../supabase';

const NewsDetail = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        console.log(`Fetching news item with id ${id}...`);
        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select(`
            id, 
            title, 
            content, 
            datetime, 
            author,
            image_id
          `)
          .eq('id', id)
          .single();

        if (newsError) {
          throw newsError;
        }

        console.log('News item data:', newsData);

        // Fetch image details based on image_id
        const { data: imageData, error: imageError } = await supabase
          .from('images')
          .select('filename, author')
          .eq('id', newsData.image_id)
          .single();

        if (imageError) {
          throw imageError;
        }

        console.log('Image data:', imageData);

        // Combine news item with image details
        const newsItemWithImage = {
          ...newsData,
          image: imageData, // Add image details to news item
        };

        setNewsItem(newsItemWithImage);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>{newsItem.title}</h2>
      <h4>Skrevet af {newsItem.author} den {new Date(newsItem.datetime).toLocaleDateString()}</h4>
      {newsItem.image && (
        <div>
          <img src={newsItem.image.filename} alt={newsItem.title} />
          <p>Foto: {newsItem.image.author}</p>
        </div>
      )}
      <p>{newsItem.content}</p>
    </div>
  );
}

export default NewsDetail;
