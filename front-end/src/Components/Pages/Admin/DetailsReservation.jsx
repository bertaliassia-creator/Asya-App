import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './DetailsReservation.module.css';

const API = "http://localhost/Asya-App/back-end";

function DetailsReservation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [statut, setStatut] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    axios.post(`${API}/getReservationById.php`, { id })
      .then(res => {
        setData(res.data);
        console.log(res.data)
        setStatut(res.data.statut);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        showToast("Erreur lors du chargement", "error");
      });
  }, [id]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateStatut = () => {
    if (statut === data.statut) {
      showToast("Aucune modification", "info");
      return;
    }
    setUpdating(true);
    axios.post(`${API}/updateStatut.php`, { id, statut })
      .then(() => {
        showToast("Statut modifié avec succès ✅", "success");
        setData({ ...data, statut });
      })
      .catch(err => {
        console.error(err);
        showToast("Erreur lors de la modification", "error");
      })
      .finally(() => setUpdating(false));
  };

  const getStatusInfo = (statut) => {
    switch (statut) {
      case 'en_attente':
        return { text: 'En attente', class: styles.statusPending, icon: '⏳' };
      case 'confirmée':
      case 'confirme':
        return { text: 'Confirmée', class: styles.statusConfirmed, icon: '✅' };
      case 'annulée':
      case 'annule':
        return { text: 'Annulée', class: styles.statusCancelled, icon: '❌' };
      default:
        return { text: statut || 'En attente', class: styles.statusPending, icon: '📋' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non définie';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Chargement des détails...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>🚗</div>
        <h3>Réservation introuvable</h3>
        <p>Désolé, cette réservation n'existe pas ou a été supprimée.</p>
        <button onClick={() => navigate('/admin/reservations')} className={styles.backButton}>
          Retour à la liste
        </button>
      </div>
    );
  }

  const status = getStatusInfo(data.statut);

  return (
    <div className={styles.container}>
      {toast && (
        <div className={`${styles.toast} ${styles[`toast${toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info'}`]}`}>
          <span>{toast.message}</span>
        </div>
      )}

      <div className={styles.card}>
        {/* Header avec statut */}
        <div className={styles.header}>
          <h2>Détails de la réservation</h2>
          <div className={styles.statusBadge}>
            <span className={status.class}>
              {status.icon} {status.text}
            </span>
          </div>
        </div>

        {/* Informations client */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>👤</span>
            <h3>Informations client</h3>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Nom complet</span>
              <span className={styles.infoValue}>{data.nom} {data.prenom}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{data.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Téléphone</span>
              <span className={styles.infoValue}>{data.telephone}</span>
            </div>
          </div>
        </div>

        {/* Informations voiture */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🚗</span>
            <h3>Véhicule réservé</h3>
          </div>
          <div className={styles.carInfo}>
            <div className={styles.carImage}>
              <img
                src={`${API}/uploads/${data.image}`}
                alt={`${data.marque} ${data.modele}`}
                onError={(e) => { e.target.src = '/placeholder-car.jpg'; }}
              />
            </div>
            <div className={styles.carDetails}>
              <h3 className={styles.carTitle}>{data.marque} {data.modele}</h3>
              <div className={styles.dateRange}>
                <span>📅 {formatDate(data.date_debut)}</span>
                <span>→</span>
                <span>📅 {formatDate(data.date_fin)}</span>
              </div>
              <div className={styles.price}>
                💰 {data.prix_jour} MAD / jour
              </div>
            </div>
          </div>
        </div>

        {/* Modification du statut */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🔄</span>
            <h3>Modifier le statut</h3>
          </div>
          <div className={styles.statusUpdate}>
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className={styles.select}
              disabled={updating}
            >
              <option value="en_attente">⏳ En attente</option>
              <option value="confirmée">✅ Confirmée</option>
              <option value="annulée">❌ Annulée</option>
            </select>
            <button
              onClick={updateStatut}
              className={styles.updateButton}
              disabled={updating || statut === data.statut}
            >
              {updating ? (
                <>
                  <span className={styles.spinner}></span>
                  Mise à jour...
                </>
              ) : (
                'Enregistrer'
              )}
            </button>
          </div>
        </div>

        {/* Bouton retour */}
        <div className={styles.actionButtons}>
          <button
            onClick={() => navigate('/admin/Reservation')}
            className={styles.backButton}
          >
            ← Retour à la liste
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsReservation;