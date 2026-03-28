import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // si vous voulez naviguer
import styles from './Reservation.module.css';

// URL de base de l'API
const API_BASE_URL = 'http://localhost/Asya-App/back-end';

function Reservation() {
  const navigate = useNavigate(); // optionnel
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/getReservation.php`);
      const data = Array.isArray(response.data) ? response.data : [];
      setReservations(data);
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des réservations :', err);
      setError('Impossible de charger les réservations. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction de statut (identique à MesReservation)
  const getStatusInfo = (statut) => {
    switch (statut) {
      case 'en_attente':
        return { text: 'En attente', class: styles.statusPending, icon: '⏳' };
      case 'confirmée':
      case 'confirme':
        return { text: 'Confirmé', class: styles.statusConfirmed, icon: '✅' };
      case 'annulée':
      case 'annule':
        return { text: 'Annulé', class: styles.statusCancelled, icon: '❌' };
      case 'termine':
        return { text: 'Terminé', class: styles.statusCompleted, icon: '🏁' };
      default:
        return { text: statut || 'En attente', class: styles.statusPending, icon: '📋' };
    }
  };

  // Formatage de date (optionnel)
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

  // Filtrage
  const getFilteredReservations = () => {
    if (!Array.isArray(reservations)) return [];
    if (filter === 'all') return reservations;
    return reservations.filter(res => {
      if (filter === 'annulée') {
        return res.statut === 'annulée' || res.statut === 'annule';
      }
      return res.statut === filter;
    });
  };

  // Statistiques
  const totalCount = reservations.length;
  const pendingCount = reservations.filter(r => r.statut === 'en_attente').length;
  const confirmedCount = reservations.filter(r => r.statut === 'confirmée' || r.statut === 'confirme').length;
  const cancelledCount = reservations.filter(r => r.statut === 'annulée' || r.statut === 'annule').length;
  const completedCount = reservations.filter(r => r.statut === 'termine').length;

  const filteredReservations = getFilteredReservations();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Chargement des réservations...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gestion des Réservations</h1>
        <p>Consultez et gérez toutes les réservations des clients</p>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button onClick={fetchReservations} className={styles.retryButton}>
            Réessayer
          </button>
        </div>
      )}

      {/* Statistiques */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{totalCount}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{pendingCount}</span>
          <span className={styles.statLabel}>En attente</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{confirmedCount}</span>
          <span className={styles.statLabel}>Confirmées</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{cancelledCount}</span>
          <span className={styles.statLabel}>Annulées</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{completedCount}</span>
          <span className={styles.statLabel}>Terminées</span>
        </div>
      </div>

      {/* Filtres */}
      <div className={styles.filterTabs}>
        <button
          className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          Toutes ({totalCount})
        </button>
        <button
          className={`${styles.filterTab} ${filter === 'en_attente' ? styles.active : ''}`}
          onClick={() => setFilter('en_attente')}
        >
          ⏳ En attente ({pendingCount})
        </button>
        <button
          className={`${styles.filterTab} ${filter === 'confirmée' ? styles.active : ''}`}
          onClick={() => setFilter('confirmée')}
        >
          ✅ Confirmées ({confirmedCount})
        </button>
        <button
          className={`${styles.filterTab} ${filter === 'annulée' ? styles.active : ''}`}
          onClick={() => setFilter('annulée')}
        >
          ❌ Annulées ({cancelledCount})
        </button>
        <button
          className={`${styles.filterTab} ${filter === 'termine' ? styles.active : ''}`}
          onClick={() => setFilter('termine')}
        >
          🏁 Terminées ({completedCount})
        </button>
      </div>

      {/* Liste des réservations (tableau) */}
      {filteredReservations.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📅</div>
          <h3>Aucune réservation trouvée</h3>
          <p>Aucune réservation ne correspond à ce filtre.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.reservationTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Nom Client</th>
                <th>Prénom Client</th>
                <th>Téléphone</th>
                <th>Voiture</th>
                <th>Date Début</th>
                <th>Date Fin</th>
                <th>Prix / jour</th>
                <th>Statut</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((resv) => {
                const status = getStatusInfo(resv.statut);
                const isCancelled = resv.statut === 'annulée' || resv.statut === 'annule';
                return (
                  <tr key={resv.id} className={isCancelled ? styles.cancelledRow : ''}>
                    <td data-label="ID">{resv.id}</td>
                    <td data-label="Image">
                      {resv.image && (
                        <img
                          src={`${API_BASE_URL}/uploads/${resv.image}`}
                          alt={`${resv.marque} ${resv.modele}`}
                          className={styles.tableImage}
                        />
                      )}
                    </td>
                    <td data-label="Nom Client">{resv.nom}</td>
                    <td data-label="Prénom Client">{resv.prenom}</td>
                    <td data-label="Téléphone">{resv.telephone}</td>
                    <td data-label="Voiture">
                      {resv.marque} {resv.modele}
                    </td>
                    <td data-label="Date Début">{formatDate(resv.date_debut)}</td>
                    <td data-label="Date Fin">{formatDate(resv.date_fin)}</td>
                    <td data-label="Prix / jour" className={isCancelled ? styles.cancelledPrice : ''}>
                      {resv.prix_jour} MAD
                    </td>
                    <td data-label="Statut">
                      <span className={status.class}>
                        {status.icon} {status.text}
                      </span>
                    </td>
                    <td data-label="Détails">
                      <button
                        className={styles.detailsButton}
                        onClick={() => {
                          navigate(`/admin/reservation/${resv.id}`);
                          
                        }}
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Reservation;