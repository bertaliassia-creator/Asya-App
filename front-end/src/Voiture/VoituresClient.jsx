import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from "./VoituresClient.module.css"
import { useNavigate } from 'react-router-dom'

function VoituresClient() {
  const [voitures, setVoitures] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    axios.get("http://localhost/Asya-App/back-end/getVoitures.php")
      .then(res => setVoitures(res.data))
      .catch(err => console.log(err))
  }, [])
  const client = localStorage.getItem("client")
  function verifierClient(){
    if(!client){
      navigate("/logIn")
    }
  }
  return (
    <div className={styles.container}>
      <h2>Voitures Disponibles</h2>

      <div className={styles.grid}>
        {voitures.map((v) => (
          <div className={styles.card} key={v.id}>
            
            <img 
              src={`http://localhost/Asya-App/back-end/uploads/${v.image}`} 
              alt={`${v.marque} ${v.modele}`}
            />

            <h3>{v.marque} {v.modele}</h3>
            <p>Année : {v.annee}</p>
            <p className={styles.price}>{v.prix_jour} DH / jour</p>

            <button 
              className={styles.reserveBtn}
              onClick={() => verifierClient()}
            >
              Réserver
            </button>

          </div>
        ))}
      </div>
    </div>
  )
}

export default VoituresClient