import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from './ModifierClient.module.css'

function ModifierClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [client, setClient] = useState({
    id : id ,
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    region_id: "",
    ville_id: "",
    role: ""
  });

  const [regions, setRegions] = useState([]);
  const [villes, setVilles] = useState([]);

  useEffect(() => {
    axios.post("http://localhost/Asya-App/back-end/getClient_ID.php", { id })
      .then(res => setClient(res.data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    axios.get("http://localhost/Asya-App/back-end/get_region.php")
      .then(res => setRegions(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost/Asya-App/back-end/get_ville.php")
      .then(res => setVilles(res.data))
      .catch(err => console.error(err));
  }, []);

  const villesFiltered = villes.filter(v => Number(v.region) === Number(client.region_id));

  const handleChange = e => {
    const { name, value } = e.target;
    setClient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post("http://localhost/Asya-App/back-end/updateClient.php", client)
      .then(res => {
        alert(res.data.message);
        navigate(-1);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className={styles.container}>
      <h2>Modifier Client</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>Nom :</label>
          <input type="text" value={client.id} disabled />        
        </div>

        <div className={styles.inputGroup}>
          <label>Nom :</label>
          <input type="text" name="nom" value={client.nom} onChange={handleChange} required />
        </div>

        <div className={styles.inputGroup}>
          <label>Prénom :</label>
          <input type="text" name="prenom" value={client.prenom} onChange={handleChange} required />
        </div>

        <div className={styles.inputGroup}>
          <label>Email :</label>
          <input type="email" name="email" value={client.email} onChange={handleChange} required />
        </div>

        <div className={styles.inputGroup}>
          <label>Téléphone :</label>
          <input type="text" name="telephone" value={client.telephone} onChange={handleChange} required />
        </div>

        <div className={styles.selectRow}>
          <div className={styles.inputGroup}>
            <label>Région :</label>
            <select name="region_id" value={client.region_id} onChange={handleChange} required>
              <option value="">Choisir la région</option>
              {regions.map(r => <option key={r.id} value={r.id}>{r.region}</option>)}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Ville :</label>
            <select name="ville_id" value={client.ville_id} onChange={handleChange} disabled={!client.region_id} required>
              <option value="">Choisir la ville</option>
              {villesFiltered.map(v => <option key={v.id} value={v.id}>{v.ville}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Rôle :</label>
          <input type="text" value={client.role} disabled />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={`${styles.button} ${styles.save}`}>Sauvegarder</button>
          <button type="button" onClick={() => navigate(-1)} className={`${styles.button} ${styles.back}`}>Retour</button>
        </div>
      </form>
    </div>
  );
}

export default ModifierClient;