import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './ModifierVoiture.module.css'

function ModifierVoiture() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState("")

  const [voiture, setVoiture] = useState({
    id: "",
    marque: "",
    modele: "",
    annee: "",
    prix_jour: ""
  })

  useEffect(() => {
    axios.post("http://localhost/Asya-App/back-end/getVoitureId.php", { id })
      .then(res => {
        setVoiture({
          id: res.data.id || "",
          marque: res.data.marque || "",
          modele: res.data.modele || "",
          annee: res.data.annee || "",
          prix_jour: res.data.prix_jour || ""
        })
      })
      .catch(err => console.error(err))
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setVoiture(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post("http://localhost/Asya-App/back-end/updateVoiture.php", voiture)
      .then(res => setMessage(res.data.message))
      .catch(err => console.error(err))
  }

  return (
    <div className={styles.container}>
      <h2>Modifier Voiture</h2>
      <form onSubmit={handleSubmit}>
        <label>Id :</label>
        <input type="text" value={voiture.id} disabled />

        <label>Marque :</label>
        <input 
          type="text" 
          name="marque"
          value={voiture.marque}
          onChange={handleChange}
        />

        <label>Modele :</label>
        <input 
          type="text" 
          name="modele"
          value={voiture.modele}
          onChange={handleChange}
        />

        <label>Annee :</label>
        <input 
          type="text" 
          name="annee"
          value={voiture.annee}
          onChange={handleChange}
        />

        <label>Prix :</label>
        <input 
          type="text" 
          name="prix_jour"
          value={voiture.prix_jour}
          onChange={handleChange}
        />

        <button type="submit">Modifier</button>
        <button type="button" onClick={() => navigate(-1)}>Retour</button>
      </form>

      {message && <div className={styles.message}>{message}</div>}
    </div>
  )
}

export default ModifierVoiture