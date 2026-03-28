import axios from 'axios';
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import styles from './ProfileC.module.css';

const API_BASE_URL = 'http://localhost/Asya-App/back-end';

function ProfileC() {
  const [form, setForm] = useState(null);
  const [regions, setRegions] = useState([]);
  const [villes, setVilles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [dirty, setDirty] = useState(false);
  const initialDataRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const clientData = localStorage.getItem("client");
        if (!clientData) throw new Error("Aucune donnée client");
        
        const parsedClient = JSON.parse(clientData);
        setForm(parsedClient);
        initialDataRef.current = parsedClient;
        
        const [regionsRes, villesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/get_region.php`),
          axios.get(`${API_BASE_URL}/get_ville.php`)
        ]);
        
        setRegions(regionsRes.data || []);
        setVilles(villesRes.data || []);
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const villesFiltrees = useMemo(() => {
    if (!form?.region_id) return [];
    return villes.filter(v => Number(v.region) === Number(form.region_id));
  }, [villes, form?.region_id]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setForm(prev => {
      const updated = name === "region_id" 
        ? { ...prev, region_id: value, ville_id: "" }
        : { ...prev, [name]: value };
      
      const hasChanges = JSON.stringify(updated) !== JSON.stringify(initialDataRef.current);
      setDirty(hasChanges);
      
      return updated;
    });
  }, []);

  const validate = useCallback(() => {
    if (!form?.nom?.trim()) {
      showToast("Le nom est requis", "error");
      return false;
    }
    if (!form?.prenom?.trim()) {
      showToast("Le prénom est requis", "error");
      return false;
    }
    if (!form?.email?.trim()) {
      showToast("L'email est requis", "error");
      return false;
    }
    if (form?.email && !/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(form.email)) {
      showToast("Email invalide", "error");
      return false;
    }
    return true;
  }, [form, showToast]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSaving(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/updateClient.php`, form, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.data?.success) {
        localStorage.setItem("client", JSON.stringify(form));
        initialDataRef.current = { ...form };
        setDirty(false);
        showToast("Profil mis à jour", "success");
        
        if (formRef.current) {
          formRef.current.classList.add(styles.successFlash);
          setTimeout(() => {
            formRef.current?.classList.remove(styles.successFlash);
          }, 300);
        }
      } else {
        throw new Error(response.data?.message || "Erreur");
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }, [form, validate, showToast]);

  const handleReset = useCallback(() => {
    if (dirty && window.confirm("Annuler les modifications ?")) {
      setForm({ ...initialDataRef.current });
      setDirty(false);
      showToast("Modifications annulées", "info");
    }
  }, [dirty, showToast]);

  if (loading) {
    return (
      <div className={styles.skeleton}>
        <div className={styles.skeletonHeader} />
        <div className={styles.skeletonContent}>
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLine} />
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>🔒</div>
        <h3>Session expirée</h3>
        <p>Veuillez vous reconnecter</p>
        <button onClick={() => window.location.href = "/login"} className={styles.btnPrimary}>
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${styles[`toast${toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info'}`]}`}>
          <span>{toast.message}</span>
        </div>
      )}

      <div className={styles.card} ref={formRef}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.avatar}>
              {form.nom?.[0]}{form.prenom?.[0]}
            </div>
            <div className={`${styles.status} ${dirty ? styles.statusDirty : styles.statusClean}`}>
              {dirty ? "Modifications" : "Synchronisé"}
            </div>
          </div>
          
          <div className={styles.userInfo}>
            <h1>{form.nom} {form.prenom}</h1>
            <div className={styles.contactInfo}>
              <span className={styles.contactBadge}>📧 {form.email}</span>
              {form.telephone && (
                <span className={styles.contactBadge}>📱 {form.telephone}</span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>👤</span>
              <h3>Informations personnelles</h3>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom || ""}
                  onChange={handleChange}
                  disabled={saving}
                  className={styles.input}
                />
              </div>
              
              <div className={styles.field}>
                <label>Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={form.prenom || ""}
                  onChange={handleChange}
                  disabled={saving}
                  className={styles.input}
                />
              </div>
              
              <div className={styles.field}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  disabled={saving}
                  className={styles.input}
                />
              </div>
              
              <div className={styles.field}>
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={form.telephone || ""}
                  onChange={handleChange}
                  disabled={saving}
                  className={styles.input}
                  placeholder="+212 6XX XXX XXX"
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📍</span>
              <h3>Localisation</h3>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Région</label>
                <select
                  name="region_id"
                  value={form.region_id || ""}
                  onChange={handleChange}
                  disabled={saving}
                  className={styles.select}
                >
                  <option value="">Sélectionner</option>
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>{r.region}</option>
                  ))}
                </select>
              </div>
              
              <div className={styles.field}>
                <label>Ville</label>
                <select
                  name="ville_id"
                  value={form.ville_id || ""}
                  onChange={handleChange}
                  disabled={!form.region_id || saving}
                  className={styles.select}
                >
                  <option value="">Sélectionner</option>
                  {villesFiltrees.map(v => (
                    <option key={v.id} value={v.id}>{v.ville}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={`${styles.actionBar} ${dirty ? styles.actionBarVisible : ''}`}>
            <div className={styles.actionContent}>
              <div className={styles.changesCount}>
                {dirty && "✦ Modifications en attente"}
              </div>
              <div className={styles.buttons}>
                <button
                  type="button"
                  onClick={handleReset}
                  className={styles.btnSecondary}
                  disabled={saving || !dirty}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={saving || !dirty}
                >
                  {saving ? (
                    <>
                      <span className={styles.spinner} />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileC;