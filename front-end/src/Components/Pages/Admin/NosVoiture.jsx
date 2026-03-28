import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from "./NosVoiture.module.css"
import { useNavigate } from 'react-router-dom';
import SupprimerVoiture from './SupprimerVoiture';

function NosVoiture() {
  const [voitures, setVoitures] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    axios.get("http://localhost/Asya-App/back-end/getVoitures.php")
      .then(res => setVoitures(res.data))
      .catch(err => console.log(err))
  }, [])

  return (
    <div className={styles.nosVoituresContainer}>
      <h2>Nos Voitures</h2>

      <div className={styles.nosVoituresGrid}>
        {voitures.map((v) => (
          <div className={styles.nosVoituresCard}>
              <img 
                src={`http://localhost/Asya-App/back-end/uploads/${v.image}`} 
                alt={`${v.marque} ${v.modele}`}
              />
              <h3>{v.marque} {v.modele}</h3>
              <p>Année : {v.annee}</p>
              <p>Prix : {v.prix_jour} DH / jour</p>

              {/* غلفنا الزرين div خاص */}
              <div className={styles.buttonsWrapper}>
                <button 
                  className={styles.modifyBtn} 
                  onClick={() => navigate(`/admin/modifier/${v.id}`)}
                >
                  Modifier
                </button>
                <SupprimerVoiture  
                  id={v.id} 
                  className={styles.deleteBtn} // <--- هادي مهمة باش اللون يتطبق
                  onDeleted={() => setVoitures(prev => prev.filter(item => item.id !== v.id))}
                />
              </div>
            </div>
        ))}
      </div>
    </div>
  )
}

export default NosVoiture;