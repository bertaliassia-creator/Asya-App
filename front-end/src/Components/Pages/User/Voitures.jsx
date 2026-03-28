import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from "./Voitures.module.css";

function Voitures() {
  const [voitures, setVoitures] = useState([]);
  const [filteredVoitures, setFilteredVoitures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [fuelType, setFuelType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoitures = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost/Asya-App/back-end/getVoitures.php");
        setVoitures(response.data);
        setFilteredVoitures(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError("Impossible de charger les voitures. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchVoitures();
  }, []);

  // Filtrer les voitures
  useEffect(() => {
    let filtered = [...voitures];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(v => 
        `${v.marque} ${v.modele}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par marque
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(v => v.marque === selectedBrand);
    }

    // Filtre par prix
    if (priceRange !== 'all') {
      if (priceRange === '0-200') {
        filtered = filtered.filter(v => v.prix_jour <= 200);
      } else if (priceRange === '200-400') {
        filtered = filtered.filter(v => v.prix_jour > 200 && v.prix_jour <= 400);
      } else if (priceRange === '400+') {
        filtered = filtered.filter(v => v.prix_jour > 400);
      }
    }

    // Filtre par carburant
    if (fuelType !== 'all') {
      filtered = filtered.filter(v => v.carburant === fuelType);
    }

    setFilteredVoitures(filtered);
  }, [searchTerm, selectedBrand, priceRange, fuelType, voitures]);

  const handleReservation = (voitureId, objet) => {
    navigate(`/client/reservation/${voitureId}`, { state: objet });
  };

  // Obtenir les marques uniques
  const uniqueBrands = ['all', ...new Set(voitures.map(v => v.marque))];
  
  // Obtenir les types de carburant uniques
  const uniqueFuels = ['all', ...new Set(voitures.map(v => v.carburant).filter(Boolean))];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('all');
    setPriceRange('all');
    setFuelType('all');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Chargement des véhicules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryBtn}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Trouvez votre véhicule idéal
          </h1>
          <p className={styles.heroSubtitle}>
            Parcourez notre sélection de voitures de qualité à des prix compétitifs
          </p>
        </div>
      </div>

      <div className={styles.container}>
        {/* Barre de recherche et filtres */}
        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Rechercher par marque ou modèle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button 
              className={styles.filterToggle}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? '▲ Masquer filtres' : '▼ Afficher filtres'}
            </button>
          </div>

          {showFilters && (
            <div className={styles.filtersPanel}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Marque</label>
                <select 
                  value={selectedBrand} 
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className={styles.filterSelect}
                >
                  {uniqueBrands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand === 'all' ? 'Toutes les marques' : brand}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Prix par jour</label>
                <select 
                  value={priceRange} 
                  onChange={(e) => setPriceRange(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">Tous les prix</option>
                  <option value="0-200">Moins de 200 DH</option>
                  <option value="200-400">200 - 400 DH</option>
                  <option value="400+">Plus de 400 DH</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Carburant</label>
                <select 
                  value={fuelType} 
                  onChange={(e) => setFuelType(e.target.value)}
                  className={styles.filterSelect}
                >
                  {uniqueFuels.map(fuel => (
                    <option key={fuel} value={fuel}>
                      {fuel === 'all' ? 'Tous types' : fuel}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={clearFilters} className={styles.clearFiltersBtn}>
                Effacer les filtres
              </button>
            </div>
          )}
        </div>

        {/* Header avec compteur */}
        <div className={styles.header}>
          <h2 className={styles.title}>Nos Voitures disponibles</h2>
          <p className={styles.subtitle}>
            {filteredVoitures.length} véhicule{filteredVoitures.length > 1 ? 's' : ''} trouvé{filteredVoitures.length > 1 ? 's' : ''}
          </p>
        </div>

        {filteredVoitures.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3>Aucun véhicule trouvé</h3>
            <p>Aucune voiture ne correspond à vos critères de recherche.</p>
            <button onClick={clearFilters} className={styles.primaryBtn}>
              Effacer les filtres
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredVoitures.map((v) => (
              <div className={styles.card} key={v.id}>
                <div className={styles.cardImageWrapper}>
                  <img 
                    className={styles.image}
                    src={`http://localhost/Asya-App/back-end/uploads/${v.image}`} 
                    alt={`${v.marque} ${v.modele}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-car.jpg';
                    }}
                  />
                  {!v.disponible && (
                    <div className={styles.badge}>Indisponible</div>
                  )}
                  {v.disponible && v.promo && (
                    <div className={styles.promoBadge}>PROMO</div>
                  )}
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.carTitle}>{v.marque} {v.modele}</h3>
                  
                  <div className={styles.carDetails}>
                    <span className={styles.detailItem}>
                      📅 {v.annee}
                    </span>
                    {v.carburant && (
                      <span className={styles.detailItem}>
                        ⛽ {v.carburant}
                      </span>
                    )}
                    {v.transmission && (
                      <span className={styles.detailItem}>
                        ⚙️ {v.transmission}
                      </span>
                    )}
                  </div>

                  <div className={styles.priceContainer}>
                    <span className={styles.price}>{v.prix_jour}</span>
                    <span className={styles.priceUnit}>DH / jour</span>
                  </div>

                  <button 
                    className={`${styles.btn} ${!v.disponible ? styles.btnDisabled : ''}`}
                    onClick={() => handleReservation(v.id, v)}
                    disabled={!v.disponible}
                  >
                    {v.disponible ? 'Réserver maintenant' : 'Indisponible'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Voitures;