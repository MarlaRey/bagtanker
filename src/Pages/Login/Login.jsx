import React, { useState, useContext } from 'react';
import styles from './Login.module.scss'; // Import CSS modules
import supabase from '../../../supabase.js';
import { AuthContext } from '../../context/AuthContext'; // Kommentér dette ind hvis AuthContext er implementeret

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { setIsLoggedIn } = useContext(AuthContext); // Kommentér dette ind hvis AuthContext er implementeret

  const handleLogin = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setSuccess("");
    } else {
      setSuccess("Du er nu logget ind!");
      setError("");
      setEmail("");
      setPassword("");
      setIsLoggedIn(true); // Kommentér dette ind hvis AuthContext er implementeret
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
  
    const { data, error } = await supabase.auth.signUp({ email: registerEmail, password: registerPassword });
    if (error) {
      if (error.message === 'Email rate limit exceeded') {
        setError('For mange forsøg. Prøv igen senere.');
      } else {
        setError(error.message);
      }
      setSuccess("");
    } else {
      setSuccess("Din konto er oprettet! Tjek venligst din email for at bekræfte.");
      setError("");
      setRegisterEmail("");
      setRegisterPassword("");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <img src="src/assets/images/banner_blue.png" alt="mediesuset" className={styles.bannerImage} />

      <form onSubmit={handleLogin} className={styles.form}>
        <h2>Log ind</h2>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Log ind</button>
      </form>

      <form onSubmit={handleRegister} className={styles.form}>
        <h2>Opret ny bruger</h2>
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password:</label>
          <input
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Opret bruger</button>
      </form>
    </div>
  );
}

export default Login;
