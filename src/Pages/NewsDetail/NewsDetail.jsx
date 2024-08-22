import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../../supabase';
import ErrorComponent from '../../components/ErrorComponent/ErrorComponent';

const NewsDetail = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      if (!id) {
        setError('Invalid news item ID.');
        setLoading(false);
        return;
      }

      try {
        // Fetch the news item data
        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select('id, title, teaser, content, image_id, created_at')
          .eq('id', id)
          .single();

        if (newsError) {
          throw newsError;
        }

        setNewsItem(newsData);

        // Fetch the image filename using the image_id from the news item
        const { data: imageData, error: imageError } = await supabase
          .from('images')
          .select('filename')
          .eq('id', newsData.image_id)
          .single();

        if (imageError) {
          throw imageError;
        }

        // Assuming the images are stored in a public directory, construct the URL
        const imageUrl = `https://your-storage-bucket-url/${imageData.filename}`;
        setImageUrl(imageUrl);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch the news item.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchNewsItem();
  };

  if (loading) return <p>Loading...</p>;

  if (error) {
    return <ErrorComponent message={error} onRetry={handleRetry} />;
  }

  return (
    <div>
      {newsItem ? (
        <>
          <h1>{newsItem.title}</h1>
          <p>{newsItem.content}</p>
          {imageUrl && <img src={imageUrl} alt={newsItem.title} />}
          {/* Render other news item details */}
        </>
      ) : (
        <p>News item not found.</p>
      )}
    </div>
  );
};

export default NewsDetail;
