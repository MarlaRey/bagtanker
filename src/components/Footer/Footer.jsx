// src/components/Footer/Footer.js
import React, { useState } from 'react';
import styles from './Footer.module.scss';
import supabase from '../../../supabase';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const { error } = await supabase
        .from('newsletter_emails')
        .insert([{ email }]);

      if (error) throw error;

      setSuccess('You have successfully subscribed to the newsletter!');
      setEmail('');
      setError('');
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.leftSide}>
        <img src="src/assets/images/logo2.png" alt="Logo" className={styles.logo} />
        <address>
          Øster Uttrupvej 1<br />
          9000 Aalborg<br />
          Tlf: 12345678<br />
          Email: <a href="mailto:info@bagtanker.dk">info@bagtanker.dk</a>
        </address>
      </div>
      <div className={styles.rightSide}>
        <h2>Tilmeld dig Bagtankers nyhedsbrev</h2>
        <p>Få vores nyheder direkte i din indbakke</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Indtast din email"
            required
          />
          <button type="submit">Tilmeld</button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
      </div>
    </footer>
  );
};

export default Footer;
