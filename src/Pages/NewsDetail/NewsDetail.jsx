import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../../supabase';
import ErrorComponent from '../../components/ErrorComponent/ErrorComponent';
import { Helmet } from 'react-helmet';

const NewsDetail = () => {
  // Henter ID fra URL-parametre
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null); // State til at gemme nyhedsdata
  const [newsImageUrl, setNewsImageUrl] = useState(null); // State til at gemme nyheds-billede URL
  const [loading, setLoading] = useState(true); // State til at indikere om data bliver hentet
  const [error, setError] = useState(null); // State til at håndtere fejl

  // Effekt der henter nyhedsdata baseret på ID
  useEffect(() => {
    const fetchNewsItem = async () => {
      if (!id) {
        setError('Ugyldigt nyheds-ID.'); // Håndterer tilfælde hvor ID ikke er tilgængeligt
        setLoading(false);
        return;
      }

      try {
        // Henter nyhedsdata fra Supabase
        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select('id, title, teaser, content, image_id, created_at')
          .eq('id', id)
          .single();

        if (newsError) {
          throw newsError; // fejl hvis data ikke kan hentes
        }

        setNewsItem(newsData); // Opdaterer state med nyhedsdata

        // Henter billede for nyheden hvis der er et image_id
        if (newsData && newsData.image_id) {
          const { data: imageData, error: imageError } = await supabase
            .from('images')
            .select('filename')
            .eq('id', newsData.image_id)
            .single();

          if (imageError) {
            console.error('Fejl ved hentning af billede:', imageError);
            setError('Fejl ved hentning af billede'); // Håndterer fejl ved hentning af billede
          } else {
            const imageUrl = imageData.filename;
            setNewsImageUrl(imageUrl); // Opdaterer state med billede URL
          }
        }

      } catch (err) {
        console.error('Fejl ved hentning af data:', err);
        setError(err.message || 'Kunne ikke hente nyheden.'); // Håndterer generelle fejl
      } finally {
        setLoading(false); // Sætter loading til false når data er hentet
      }
    };

    fetchNewsItem(); // Kalder fetchNewsItem funktionen
  }, [id]); // Effekt afhængig af ID

  // Håndterer retry-funktion ved fejl
  const handleRetry = () => {
    setError(null); // Nulstiller fejl
    setLoading(true); // Sætter loading til true for at starte ny hentning
    fetchNewsItem(); // Kalder fetchNewsItem funktionen igen
  };

  if (loading) return <p>Loading...</p>; // Viser loading tekst mens data hentes

  if (error) {
    return <ErrorComponent message={error} onRetry={handleRetry} />; // Viser fejlkomponent ved fejl
  }

  return (
    <div>
      {newsItem ? (
        <>
          <Helmet>
            <title>Bagtanker | {newsItem.title}</title> {/* Sætter titel på siden baseret på nyhedstitel */}
          </Helmet>

          {newsImageUrl ? (
            <img src={newsImageUrl} alt={newsItem?.title} /> // Viser billede hvis tilgængeligt
          ) : (
            <p>Ingen billede tilgængeligt</p> // Viser tekst hvis billede ikke er tilgængeligt
          )}
          <p>{newsItem.content}</p> {/* Viser nyhedsindhold */}
        </>
      ) : (
        <p>Nyheden blev ikke fundet.</p> // Viser tekst hvis nyheden ikke findes
      )}
    </div>
  );
};

export default NewsDetail;
