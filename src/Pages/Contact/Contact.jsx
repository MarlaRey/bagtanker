import React from 'react';
import styles from './Contact.module.scss';

const Contact = () => {
  return (
    <div className={styles.contact}>
      <h2>Kontakt os</h2>
      <form className={styles['contact-form']}>
        <div className={styles['form-group']}>
          <label htmlFor="name">Navn:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="message">Besked:</label>
          <textarea id="message" name="message" rows="5" required></textarea>
        </div>
        <button type="submit" className={styles['submit-button']}>Send</button>
      </form>
    </div>
  );
};

export default Contact;
