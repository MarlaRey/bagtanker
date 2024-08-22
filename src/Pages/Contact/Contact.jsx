import React from 'react';
import styles from './Contact.module.scss';
import { Helmet } from 'react-helmet';


const Contact = () => {
  return (
    <div className={styles.mainContainer}>
      <Helmet>
        <title>Bagtanker | Kontakt</title>
      </Helmet>
      <div className={styles.contact}>
        <h2>Kontakt os</h2>
        <form className={styles['form']}>
          <div className={styles['formGroup']}>

            <input type="text" id="name" name="name" placeholder='Dit navn' required className={styles.input} />
          </div>
          <div className={styles['form-group']}>

            <input type="email" id="email" name="email" required placeholder='Din mail' className={styles.input} />
          </div>
          <div className={styles['form-group']}>

            <textarea id="message" name="message" rows="5" required placeholder='Din besked' className={styles.input}></textarea>
          </div>
          <button type="submit" className={styles.button}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
