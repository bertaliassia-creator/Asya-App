import React, { useState } from 'react'
import axios from 'axios'
import styles from './AjouterVoiture.module.css'
import { useNavigate } from 'react-router-dom'

function AjouterVoiture() {

  const [voiture, setVoiture] = useState({
    marque: '',
    modele: '',
    annee: '',
    prix: ''
  })
  const navigate = useNavigate()

  const [images, setImages] = useState([])

  const handleChange = (e) => {
    setVoiture({...voiture, [e.target.name]: e.target.value})
  }

  const handleImageChange = (e) => {
    setImages(e.target.files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("marque", voiture.marque)
    formData.append("modele", voiture.modele)
    formData.append("annee", voiture.annee)
    formData.append("prix", voiture.prix)
    for (let i = 0; i < images.length; i++) {
      formData.append("images[]", images[i])
    }
    try {
      const res = await axios.post(
        "http://localhost/Asya-App/back-end/ajouterVoiture.php",
        formData
      )
      console.log(res.data)
      alert("Voiture ajoutée avec succès ✅")
    } catch (error) {
      console.log(error)
    }
    setVoiture({marque:'', modele:'', annee:'', prix:''})
    setImages([])
  }

  return (
    <div className={styles.ajouterVoitureForm}>
  <form onSubmit={handleSubmit} encType="multipart/form-data">
    <label>Marque :</label>
    <input type="text" name="marque" value={voiture.marque} onChange={handleChange} />

    <label>Modele :</label>
    <input type="text" name="modele" value={voiture.modele} onChange={handleChange} />

    <label>Annee :</label>
    <input type="text" name="annee" value={voiture.annee} onChange={handleChange} />

    <label>Prix :</label>
    <input type="text" name="prix" value={voiture.prix} onChange={handleChange} />

    <label>Images :</label>
    <input type="file" multiple onChange={handleImageChange} />
    
    {images.length > 0 && (
      <div className={styles.imagePreview}>
        {Array.from(images).map((img, idx) => (
          <img 
            key={idx} 
            src={URL.createObjectURL(img)} 
            alt={`Preview ${idx}`} 
          />
        ))}
      </div>
    )}

    <input type="submit" value="Ajouter" />
    <input type="reset" value={"Retour"} onClick={() => navigate(-1)} />
  </form>
</div>
  )
}

export default AjouterVoiture