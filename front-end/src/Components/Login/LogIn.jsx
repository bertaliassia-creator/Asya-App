import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ErrorAlert from '../Alert/ErrorAlert';
import styles from './LogIn.module.css';

function LogIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost/Asya-App/back-end/logIn.php', form);
      if (res.data.success) {
        setMessage(res.data.message);
        setSuccess(true);
        if (res.data.client.role === 'user') {
          localStorage.setItem('client', JSON.stringify(res.data.client));
          navigate('/client/Voitures');
        } else {
          localStorage.setItem('admin', JSON.stringify(res.data.client));
          navigate('/admin/Profile');
        }
      } else {
        setMessage(res.data.message);
        setSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setMessage('Erreur de connexion au serveur');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginForm}>
          <form onSubmit={handleSubmit}>
            {success === false && <ErrorAlert msg={message} />}

            <h2 className={styles.title}>Connexion</h2>
            <p className={styles.subtitle}>Accédez à votre espace personnel</p>

            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Mot de passe"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>

            <div className={styles.registerLink}>
              <Link to="/register">Créer un compte</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;