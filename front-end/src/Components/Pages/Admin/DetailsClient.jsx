import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './DetailsClient.module.css';

function DetailsClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loadingClient, setLoadingClient] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [error, setError] = useState('');

  // Récupération des informations du client
  useEffect(() => {
    setLoadingClient(true);
    axios
      .post('http://localhost/Asya-App/back-end/getClient_ID.php', { id })
      .then((res) => {
        setClient(res.data);
        setLoadingClient(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur lors du chargement des informations du client");
        setLoadingClient(false);
      });
  }, [id]);

  // Récupération des réservations du client
  useEffect(() => {
    if (!id) return;
    setLoadingReservations(true);
    axios
      .post('http://localhost/Asya-App/back-end/Resrvations_par_IdClient.php', { id })
      .then((res) => {
        setReservations(res.data);
        setLoadingReservations(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur lors du chargement des réservations");
        setLoadingReservations(false);
      });
  }, [id]);

  // Fonction pour déterminer la classe CSS du statut
  const getStatusClass = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'confirmé':
      case 'confirmée':
      case 'confirmé':
        return styles.statusConfirmed;
      case 'en attente':
      case 'attente':
        return styles.statusPending;
      case 'annulé':
      case 'annulée':
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  // Si une erreur est survenue
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⚠️</div>
          <p>{error}</p>
          <button onClick={() => navigate('/admin/clients')} className={styles.backButton}>
            Retour à la liste des clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Bouton de retour */}
      <button onClick={() => navigate('/admin/clients')} className={styles.backButtonTop}>
        ← Retour à la liste
      </button>

      {/* Section Client */}
      <h2 className={styles.sectionTitle}>Informations Client</h2>
      {loadingClient ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement des informations...</p>
        </div>
      ) : client && client.id ? (
        <div className={styles.clientCard}>
          <div className={styles.clientInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Nom :</span>
              <span className={styles.infoValue}>{client.nom}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Prénom :</span>
              <span className={styles.infoValue}>{client.prenom}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email :</span>
              <span className={styles.infoValue}>{client.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Téléphone :</span>
              <span className={styles.infoValue}>{client.telephone}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👤</div>
          <p>Aucune information client trouvée.</p>
        </div>
      )}

      {/* Section Réservations */}
      <h2 className={styles.sectionTitle}>Réservations</h2>
      {loadingReservations ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement des réservations...</p>
        </div>
      ) : reservations.length > 0 ? (
        <div className={styles.reservationsGrid}>
          {reservations.map((res, index) => (
            <div key={res.id || index} className={styles.reservationCard}>
              <img
                src={`http://localhost/Asya-App/back-end/uploads/${res.image}`}
                alt={`${res.marque} ${res.modele}`}
                className={styles.carImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-car.jpg'; // Image par défaut si erreur
                }}
              />
              <div className={styles.reservationContent}>
                <h3 className={styles.carTitle}>
                  {res.marque} {res.modele}
                </h3>
                <div className={styles.reservationDetails}>
                  <div className={styles.reservationDetail}>
                    <span className={styles.detailLabel}>📅 Début :</span>
                    <span className={styles.detailValue}>{res.date_debut}</span>
                  </div>
                  <div className={styles.reservationDetail}>
                    <span className={styles.detailLabel}>📅 Fin :</span>
                    <span className={styles.detailValue}>{res.date_fin}</span>
                  </div>
                  <div className={styles.reservationDetail}>
                    <span className={styles.detailLabel}>Statut :</span>
                    <span className={`${styles.status} ${getStatusClass(res.statut)}`}>
                      {res.statut}
                    </span>
                  </div>
                </div>
                <div className={styles.price}>
                  {res.prix_jour} DH / jour
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🚗</div>
          <p>Aucune réservation trouvée pour ce client.</p>
        </div>
      )}
    </div>
  );
}

export default DetailsClient;