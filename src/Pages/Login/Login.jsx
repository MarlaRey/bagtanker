import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import supabase from '../../../supabase';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setSuccess("");
    } else {
      setSuccess(`You have logged in successfully!`);
      setError("");
      setEmail("");
      setPassword("");
      login();
      navigate('/minside');
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
  
    const { error } = await supabase.auth.signUp({ email: registerEmail, password: registerPassword });
    if (error) {
      setError(error.message);
      setSuccess("");
    } else {
      setSuccess(`Account created successfully! Please check your email for verification.`);
      setError("");
      setRegisterEmail("");
      setRegisterPassword("");
    }
  };

  return (
    <div>
      <img src="src/assets/images/banner_blue.png" alt="mediesuset" />
      <form onSubmit={handleLogin}>
        <h2>Log ind</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log ind</button>
      </form>

      <form onSubmit={handleRegister}>
        <h2>Opret ny bruger</h2>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Opret bruger</button>
      </form>
    </div>
  );
}

export default Login;
