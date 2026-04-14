import axios from 'axios';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faUser,
  faCalendar,
  faPhone,
  faEnvelope,
  faLocationDot,
  faEye,
  faSpinner,
  faDownload,
  faFilter,
  faPlus,
  faEdit,
  faTrashAlt,
  faChartLine,
  faCity,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import styles from './Clients.module.css';

const API_BASE_URL = 'http://localhost/Asya-App/back-end';

function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [regions, setRegions] = useState([]);
  const [villes, setVilles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterVille, setFilterVille] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'nom', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Réinitialiser la ville quand la région change
  useEffect(() => {
    setFilterVille('');
  }, [filterRegion]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [clientsRes, regionsRes, villesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/AfficherClients.php`),
        axios.get(`${API_BASE_URL}/get_region.php`),
        axios.get(`${API_BASE_URL}/get_ville.php`)
      ]);

      setClients(Array.isArray(clientsRes.data) ? clientsRes.data : []);
      setRegions(Array.isArray(regionsRes.data) ? regionsRes.data : []);
      setVilles(Array.isArray(villesRes.data) ? villesRes.data : []);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Impossible de charger les données. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getRegionName = useCallback((id_region) => {
    const reg = regions.find(r => r.id === id_region);
    return reg ? reg.region : 'Non spécifiée';
  }, [regions]);

  const getVilleName = useCallback((id_ville) => {
    const ville = villes.find(v => v.id === id_ville);
    return ville ? ville.ville : 'Non spécifiée';
  }, [villes]);

  const getVillesByRegion = useCallback((regionId) => {
    if (!regionId) return villes;
    return villes.filter(ville => ville.region_id === parseInt(regionId));
  }, [villes]);

  const formatDate = useCallback((dateString) => {
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
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?\n\nCette action est irréversible.')) {
      setDeletingId(id);
      try {
        const res = await axios.post(`${API_BASE_URL}/DeleteClients.php`, { id });
        if (res.data.success) {
          await fetchAllData();
          showNotification('Client supprimé avec succès', 'success');
        } else {
          showNotification(res.data.message || 'Erreur lors de la suppression', 'error');
        }
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        showNotification('Erreur de connexion. Veuillez réessayer.', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  }, [fetchAllData]);

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `${styles.notification} ${styles[type]}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleExportCSV = () => {
    const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Date d\'inscription', 'Région', 'Ville'];
    const csvData = filteredAndSortedClients.map(c => [
      c.nom,
      c.prenom,
      c.email,
      c.telephone,
      formatDate(c.date_inscription),
      getRegionName(c.region_id),
      getVilleName(c.ville_id)
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'clients.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter(client => {
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = !searchTerm ||
        client.nom?.toLowerCase().includes(searchLower) ||
        client.prenom?.toLowerCase().includes(searchLower) ||
        client.email?.toLowerCase().includes(searchLower) ||
        client.telephone?.includes(searchTerm);

      const matchRegion = !filterRegion || client.region_id === parseInt(filterRegion);
      const matchVille = !filterVille || client.ville_id === parseInt(filterVille);

      return matchSearch && matchRegion && matchVille;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'date_inscription') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [clients, searchTerm, filterRegion, filterVille, sortConfig]);

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedClients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedClients, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedClients.length / itemsPerPage);

  const stats = useMemo(() => ({
    total: clients.length,
    filtered: filteredAndSortedClients.length,
    parRegion: regions.map(region => ({
      ...region,
      count: clients.filter(c => c.region_id === region.id).length
    }))
  }), [clients, regions, filteredAndSortedClients]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setFilterRegion('');
    setFilterVille('');
    setCurrentPage(1);
  }, []);



  const closeModal = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FontAwesomeIcon icon={faSpinner} spin className={styles.loadingSpinner} />
        <p>Chargement des clients...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.tableHeader}>
        <h2 className={styles.tableTitle}>
          <FontAwesomeIcon icon={faUser} className={styles.titleIcon} />
          Gestion des Clients
        </h2>
        <div className={styles.tableStats}>
          <span className={styles.statsBadge}>
            <strong>{stats.total}</strong> client(s)
          </span>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
          <button onClick={fetchAllData} className={styles.retryButton}>
            Réessayer
          </button>
        </div>
      )}

      {/* Statistiques */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{stats.total}</span>
            <span className={styles.statLabel}>Total clients</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FontAwesomeIcon icon={faCity} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{regions.length}</span>
            <span className={styles.statLabel}>Régions</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FontAwesomeIcon icon={faMapMarkerAlt} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{villes.length}</span>
            <span className={styles.statLabel}>Villes</span>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className={styles.searchFilterSection}>
        <div className={styles.searchWrapper}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterWrapper}>
          <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Toutes les régions</option>
            {regions.map(region => (
              <option key={region.id} value={region.id}>
                {region.region} ({stats.parRegion.find(r => r.id === region.id)?.count || 0})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterWrapper}>
          <FontAwesomeIcon icon={faLocationDot} className={styles.filterIcon} />
          <select
            value={filterVille}
            onChange={(e) => setFilterVille(e.target.value)}
            className={styles.filterSelect}
            disabled={!filterRegion}
          >
            <option value="">Toutes les villes</option>
            {getVillesByRegion(filterRegion).map(ville => (
              <option key={ville.id} value={ville.id}>
                {ville.ville}
              </option>
            ))}
          </select>
        </div>

        <button className={styles.exportBtn} onClick={handleExportCSV}>
          <FontAwesomeIcon icon={faDownload} />
          Exporter CSV
        </button>

            

        {(searchTerm || filterRegion || filterVille) && (
          <button onClick={resetFilters} className={styles.resetButton}>
            Réinitialiser
          </button>
        )}
      </div>

      {/* Tableau des clients */}
      {filteredAndSortedClients.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <h3>Aucun client trouvé</h3>
          <p>
            {searchTerm || filterRegion || filterVille
              ? 'Aucun client ne correspond aux critères de recherche.'
              : 'Aucun client n\'est encore enregistré.'}
          </p>
          {!searchTerm && !filterRegion && !filterVille && (
            <button onClick={() => navigate('/admin/ajouter-client')} className={styles.primaryButton}>
              Ajouter un client
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={styles.tableInfo}>
            <span>Affichage de {paginatedClients.length} sur {filteredAndSortedClients.length} clients</span>
            <span className={styles.sortInfo}>
              Tri par {sortConfig.key === 'nom' ? 'nom' : sortConfig.key === 'date_inscription' ? 'date' : sortConfig.key}
              {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
            </span>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.clientTable}>
              <thead>
                <tr>
                  <th onClick={() => handleSort('nom')} className={styles.sortableHeader}>
                    Nom {sortConfig.key === 'nom' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('prenom')} className={styles.sortableHeader}>
                    Prénom {sortConfig.key === 'prenom' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th onClick={() => handleSort('date_inscription')} className={styles.sortableHeader}>
                    Date d'inscription {sortConfig.key === 'date_inscription' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Région</th>
                  <th>Ville</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map(client => (
                  <tr key={client.id} className={styles.tableRow}>
                    <td data-label="Nom">
                      <span className={styles.clientName}>{client.nom}</span>
                    </td>
                    <td data-label="Prénom">{client.prenom}</td>
                    <td data-label="Email">
                      <a href={`mailto:${client.email}`} className={styles.emailLink}>
                        {client.email}
                      </a>
                    </td>
                    <td data-label="Téléphone">
                      <a href={`tel:${client.telephone}`} className={styles.phoneLink}>
                        {client.telephone}
                      </a>
                    </td>
                    <td data-label="Date d'inscription">{formatDate(client.date_inscription)}</td>
                    <td data-label="Région">
                      <span className={styles.regionBadge}>
                        {getRegionName(client.region_id)}
                      </span>
                    </td>
                    <td data-label="Ville">{getVilleName(client.ville_id)}</td>
                    <td data-label="Actions" className={styles.actionsCell}>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionBtn} ${styles.btnView}`}
                          onClick={() => navigate(`/admin/DetailsClient/${client.id}`)}
                          title="Voir détails"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.btnEdit}`}
                          onClick={() => navigate(`/admin/modifierProfile/${client.id}`)}
                          title="Modifier"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.btnDelete}`}
                          onClick={() => handleDelete(client.id)}
                          disabled={deletingId === client.id}
                          title="Supprimer"
                        >
                          {deletingId === client.id ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faTrashAlt} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                ← Précédent
              </button>
              <div className={styles.pageNumbers}>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`${styles.pageNumber} ${currentPage === i + 1 ? styles.activePage : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal Détails */}
      {showModal && selectedClient && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                <FontAwesomeIcon icon={faUser} />
                Détails du client
              </h3>
              <button className={styles.modalClose} onClick={closeModal}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Nom complet :</span>
                <span className={styles.detailValue}>{selectedClient.nom} {selectedClient.prenom}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>
                  <FontAwesomeIcon icon={faEnvelope} /> Email :
                </span>
                <span className={styles.detailValue}>{selectedClient.email}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>
                  <FontAwesomeIcon icon={faPhone} /> Téléphone :
                </span>
                <span className={styles.detailValue}>{selectedClient.telephone}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>
                  <FontAwesomeIcon icon={faCalendar} /> Date d'inscription :
                </span>
                <span className={styles.detailValue}>{formatDate(selectedClient.date_inscription)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>
                  <FontAwesomeIcon icon={faLocationDot} /> Localisation :
                </span>
                <span className={styles.detailValue}>
                  {getRegionName(selectedClient.region_id)}, {getVilleName(selectedClient.ville_id)}
                </span>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnCloseModal} onClick={closeModal}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;