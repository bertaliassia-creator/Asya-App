import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ErrorAlert from "../Alert/ErrorAlert";
import SingUpSuccess from "../Alert/SingUpSuccess";
import styles from "./Register.module.css";

function Register() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    region: "",
    ville: "",
    password: ""
  });

  const [regions, setRegions] = useState([]);
  const [villes, setVilles] = useState([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // get régions
  useEffect(() => {
    axios.get("http://localhost/Asya-App/back-end/get_region.php")
      .then(res => {
        setRegions(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error(err));
  }, []);

  // get villes
  useEffect(() => {
    axios.get("http://localhost/Asya-App/back-end/get_ville.php")
      .then(res => {
        setVilles(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error(err));
  }, []);

  // filter villes
  const villesFiltered = villes.filter(
    v => Number(v.region) === Number(form.region)
  );

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // reset ville si region change
    if (name === "region") {
      setForm(prev => ({ ...prev, region: value, ville: "" }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.post("http://localhost/Asya-App/back-end/Register.php", form)
      .then(res => {
        setSuccess(res.data.success);
        setMessage(res.data.message);
        if (res.data.success) {
          // Réinitialiser le formulaire après succès
          setForm({
            nom: "",
            prenom: "",
            email: "",
            telephone: "",
            region: "",
            ville: "",
            password: ""
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setSuccess(false);
        setMessage("Erreur serveur");
        setLoading(false);
      });
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.registerForm}>
          <form onSubmit={handleSubmit}>
            <h2 className={styles.title}>Créer un compte</h2>
            <p className={styles.subtitle}>Inscrivez-vous pour accéder à nos services</p>

            {success === true && <SingUpSuccess />}
            {success === false && <ErrorAlert msg={message} />}

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Nom"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Prénom"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

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
                type="tel"
                placeholder="Téléphone"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.selectRow}>
              <div className={styles.inputGroup}>
                <select
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  className={styles.select}
                  required
                >
                  <option value="">Choisir votre région</option>
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>{r.region}</option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <select
                  name="ville"
                  value={form.ville}
                  onChange={handleChange}
                  disabled={!form.region}
                  className={styles.select}
                  required
                >
                  <option value="">Choisir votre ville</option>
                  {villesFiltered.map(v => (
                    <option key={v.id} value={v.id}>{v.ville}</option>
                  ))}
                </select>
              </div>
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
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </button>

            <div className={styles.loginLink}>
              <Link to="/login">Vous avez déjà un compte ? Se connecter</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;