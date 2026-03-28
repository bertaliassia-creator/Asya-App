import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MesReservation.module.css';

function MesReservation() {
    const navigate = useNavigate();
    const [mesRes, setMesRes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [cancellingId, setCancellingId] = useState(null);
    
    const client = (() => {
        try {
            const data = localStorage.getItem("client");
            return data ? JSON.parse(data) : null;
        } catch(e) {
            return null;
        }
    })();

    useEffect(() => {
        if (!client) {
            navigate('/login');
            return;
        }
        
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const res = await axios.post("http://localhost/Asya-App/back-end/MesReservation.php", {
                id: client.id
            });
            
            console.log("Données reçues:", res.data);
            
            if (Array.isArray(res.data)) {
                setMesRes(res.data);
            } else {
                console.error("Les données reçues ne sont pas un tableau:", res.data);
                setMesRes([]);
            }
            setError('');
        } catch(err) {
            console.error("Erreur:", err);
            setError("Impossible de charger vos réservations");
            setMesRes([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (statut) => {
        switch(statut) {
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

    const formatDate = (dateString) => {
        if (!dateString) return 'Date non définie';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch(e) {
            return dateString;
        }
    };

    const calculateDays = (debut, fin) => {
        if (!debut || !fin) return 0;
        try {
            const start = new Date(debut);
            const end = new Date(fin);
            const diffTime = Math.abs(end - start);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        } catch(e) {
            return 0;
        }
    };

    const getFilteredReservations = () => {
        if (!Array.isArray(mesRes)) return [];
        if (filter === 'all') return mesRes;
        return mesRes.filter(res => res.statut === filter || 
            (filter === 'annulée' && (res.statut === 'annulée' || res.statut === 'annule')));
    };

    const cancelReservation = async (reservationId) => {
        if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?\n\nCette action est irréversible.')) {
            setCancellingId(reservationId);
            try {
                const res = await axios.post("http://localhost/Asya-App/back-end/annulerReservation.php", {
                    id: reservationId
                });
                
                console.log("Réponse annulation:", res.data);
                
                if (res.data.success) {
                    await fetchReservations();
                    alert('✅ Réservation annulée avec succès');
                } else {
                    alert('❌ ' + (res.data.message || 'Erreur lors de l\'annulation'));
                }
            } catch(err) {
                console.error("Erreur lors de l'annulation:", err);
                alert('❌ Erreur de connexion. Veuillez réessayer.');
            } finally {
                setCancellingId(null);
            }
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Chargement de vos réservations...</p>
            </div>
        );
    }

    const filteredReservations = getFilteredReservations();
    const totalCount = Array.isArray(mesRes) ? mesRes.length : 0;
    const pendingCount = Array.isArray(mesRes) ? mesRes.filter(r => r.statut === 'en_attente').length : 0;
    const confirmedCount = Array.isArray(mesRes) ? mesRes.filter(r => r.statut === 'confirmée' || r.statut === 'confirme').length : 0;
    const cancelledCount = Array.isArray(mesRes) ? mesRes.filter(r => r.statut === 'annulée' || r.statut === 'annule').length : 0;
    const completedCount = Array.isArray(mesRes) ? mesRes.filter(r => r.statut === 'termine').length : 0;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Mes Réservations</h1>
                <p>Gérez toutes vos réservations de véhicules</p>
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

            {/* Liste des réservations */}
            {filteredReservations.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📅</div>
                    <h3>Aucune réservation trouvée</h3>
                    <p>Vous n'avez pas encore de réservations dans cette catégorie</p>
                    <button 
                        onClick={() => navigate('/voitures')} 
                        className={styles.primaryButton}
                    >
                        Réserver une voiture
                    </button>
                </div>
            ) : (
                <div className={styles.reservationsList}>
                    {filteredReservations.map((r) => {
                        const status = getStatusInfo(r.statut);
                        const days = calculateDays(r.date_debut, r.date_fin);
                        const isCancelled = r.statut === 'annulée' || r.statut === 'annule';
                        
                        return (
                            <div key={r.id} className={`${styles.reservationCard} ${isCancelled ? styles.cancelledCard : ''}`}>
                                {/* IMAGE */}
                                {r.image && (
                                    <div className={styles.imageContainer}>
                                        <img
                                            src={`http://localhost/Asya-App/back-end/uploads/${r.image}`}
                                            alt={`${r.marque} ${r.modele}`}
                                            className={styles.image}
                                            onError={(e) => {
                                                e.target.src = '/default-car.jpg';
                                            }}
                                        />
                                    </div>
                                )}

                                {/* INFO */}
                                <div className={styles.cardContent}>
                                    <h3>{r.marque} {r.modele}</h3>
                                    
                                    <p className={styles.dates}>
                                        📅 {formatDate(r.date_debut)} → {formatDate(r.date_fin)}
                                    </p>
                                    
                                    <p className={styles.duration}>
                                        ⏱️ Durée: {days} jour{days > 1 ? 's' : ''}
                                    </p>
                                    
                                    <p className={`${styles.price} ${isCancelled ? styles.cancelledPrice : ''}`}>
                                        💰 {r.prix_total} DH
                                    </p>
                                    
                                    <span className={status.class}>
                                        {status.icon} {status.text}
                                    </span>
                                    
                                    {/* Badge annulé supplémentaire */}
                                    {isCancelled && (
                                        <div className={styles.cancelledBadge}>
                                            <span>🚫 Réservation annulée</span>
                                        </div>
                                    )}
                                </div>

                                {/* ACTION */}
                                {r.statut === 'en_attente' && (
                                    <button
                                        onClick={() => cancelReservation(r.id)}
                                        className={styles.cancelButton}
                                        disabled={cancellingId === r.id}
                                    >
                                        {cancellingId === r.id ? (
                                            <span>Annulation...</span>
                                        ) : (
                                            <span>❌ Annuler</span>
                                        )}
                                    </button>
                                )}
                                
                                {/* Message pour les réservations annulées */}
                                {isCancelled && (
                                    <div className={styles.cancelledInfo}>
                                        <span className={styles.cancelledDate}>
                                            Annulée le: {formatDate(r.date_annulation || r.date_debut)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MesReservation;