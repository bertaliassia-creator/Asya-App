import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from "./ReserverVoiture.module.css"

function ReserverVoiture() {
  const { voitureId } = useParams()
  const navigate = useNavigate()

  const [voiture, setVoiture] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ date_debut: '', date_fin: '' })
  const [totalPrice, setTotalPrice] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageLoaded, setImageLoaded] = useState(false)

  // user from localStorage
  const user = (() => {
    try {
      const data = localStorage.getItem("client")
      return data ? JSON.parse(data) : null
    } catch(e) {
      return null
    }
  })()

  // fetch voiture
  useEffect(() => {
    const fetchVoiture = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`http://localhost/Asya-App/back-end/getVoitureById.php?id=${voitureId}`)
        setVoiture(res.data)
      } catch(err) {
        console.error(err)
        setError("Impossible de charger les informations de la voiture")
      } finally {
        setLoading(false)
      }
    }
    fetchVoiture()
  }, [voitureId])

  // calculate total price
  useEffect(() => {
    if (form.date_debut && form.date_fin && voiture) {
      const debut = new Date(form.date_debut)
      const fin = new Date(form.date_fin)
      const diffDays = Math.ceil((fin - debut) / (1000*60*60*24))
      setTotalPrice(diffDays > 0 ? diffDays * voiture.prix_jour : 0)
    } else {
      setTotalPrice(0)
    }
  }, [form, voiture])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  // Get number of days
  const getDaysCount = () => {
    if (!form.date_debut || !form.date_fin) return 0
    return Math.ceil((new Date(form.date_fin) - new Date(form.date_debut)) / (1000*60*60*24))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!user) {
      setError("Vous devez être connecté pour réserver")
      setTimeout(() => navigate("/login"), 2000)
      return
    }
    
    if (!form.date_debut || !form.date_fin) {
      setError("Veuillez remplir les deux dates")
      return
    }
    
    const startDate = new Date(form.date_debut)
    const endDate = new Date(form.date_fin)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (startDate < today) {
      setError("La date de début ne peut pas être dans le passé")
      return
    }
    
    if (endDate <= startDate) {
      setError("La date de fin doit être après la date de début")
      return
    }

    setSubmitting(true)

    try {
      const data = {
        client_id: user.id,
        voiture_id: voitureId,
        date_debut: form.date_debut,
        date_fin: form.date_fin
      }

      const res = await axios.post("http://localhost/Asya-App/back-end/reserver.php", data)
      
      if(res.data.message === "success") {
        setSuccess("Réservation effectuée avec succès !")
        setTimeout(() => {
          navigate("/client/MesReservation")
        }, 1500)
      } else {
        setError(res.data.message || "Erreur lors de la réservation")
      }
    } catch(err) {
      console.error(err)
      setError("Erreur de connexion au serveur")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Chargement des informations...</p>
      </div>
    )
  }
  
  if (!voiture) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>🚗</div>
        <h2>Voiture non trouvée</h2>
        <p>Désolé, cette voiture n'est pas disponible ou n'existe pas.</p>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          Retour à l'accueil
        </button>
      </div>
    )
  }

  const daysCount = getDaysCount()

  return (
    <div className={styles.container}>
      {/* Success Toast */}
      {success && (
        <div className={`${styles.toast} ${styles.success}`}>
          <span className={styles.toastIcon}>✅</span>
          {success}
        </div>
      )}
      
      {/* Error Toast */}
      {error && (
        <div className={`${styles.toast} ${styles.error}`}>
          <span className={styles.toastIcon}>❌</span>
          {error}
        </div>
      )}
      
      {/* LEFT → FORM */}
      <div className={styles.left}>
        <div className={styles.card}>
          <h3>Réserver cette voiture</h3>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Date de début</label>
              <input 
                type="date" 
                name="date_debut" 
                value={form.date_debut} 
                onChange={handleChange} 
                min={getMinDate()}
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Date de fin</label>
              <input 
                type="date" 
                name="date_fin" 
                value={form.date_fin} 
                onChange={handleChange} 
                min={form.date_debut || getMinDate()}
                required 
              />
            </div>

            {totalPrice > 0 && (
              <div className={styles.priceBreakdown}>
                <div className={styles.total}>
                  <span className={styles.totalLabel}>Total à payer</span>
                  <span className={styles.totalAmount}>{formatPrice(totalPrice)} DH</span>
                </div>
                <p className={styles.priceDetail}>
                  📅 {daysCount} jour{daysCount > 1 ? 's' : ''} × {formatPrice(voiture.prix_jour)} DH/jour
                </p>
              </div>
            )}

            {!user && (
              <div className={styles.warningMessage}>
                ⚠️ Vous devez être connecté pour réserver
              </div>
            )}

            <div className={styles.buttonGroup}>
              <button 
                className={styles.button} 
                type="submit"
                disabled={submitting || totalPrice === 0 || !user}
              >
                {submitting ? (
                  <span className={styles.buttonSpinner}></span>
                ) : (
                  'Confirmer la réservation'
                )}
              </button>
              
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className={styles.backButton}
              >
                ← Retour
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT → IMAGE + INFO */}
      <div className={styles.right}>
        <div className={styles.card}>
          <h2>{voiture.marque} {voiture.modele}</h2>
          
          <div className={styles.imageContainer}>
            {!imageLoaded && <div className={styles.imagePlaceholder}>🖼️ Chargement...</div>}
            <img 
              src={`http://localhost/Asya-App/back-end/uploads/${voiture.image}`} 
              alt={`${voiture.marque} ${voiture.modele}`} 
              className={styles.image}
              style={{ display: imageLoaded ? 'block' : 'none' }}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = '/default-car.jpg'
                setImageLoaded(true)
              }}
            />
          </div>

          <div className={styles.voitureInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>💰 Prix par jour</span>
              <span className={styles.infoValue}>{formatPrice(voiture.prix_jour)} DH</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>📅 Année</span>
              <span className={styles.infoValue}>{voiture.annee}</span>
            </div>
            {voiture.carburant && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>⛽ Carburant</span>
                <span className={styles.infoValue}>{voiture.carburant}</span>
              </div>
            )}
            {voiture.transmission && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>⚙️ Transmission</span>
                <span className={styles.infoValue}>{voiture.transmission}</span>
              </div>
            )}
            {voiture.nombre_places && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>👥 Places</span>
                <span className={styles.infoValue}>{voiture.nombre_places}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReserverVoiture