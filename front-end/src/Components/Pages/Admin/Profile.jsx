import axios from 'axios';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import styles from './Profile.module.css';

function Profile() {
  const storedAdmin = localStorage.getItem("admin");
  const [form, setForm] = useState(() =>
    storedAdmin ? JSON.parse(storedAdmin) : null
  );
  const [regions, setRegions] = useState([]);
  const [villes, setVilles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const formRef = useRef(null);

  // 🔹 handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === "region_id" && { ville_id: "" })
    }));
  };

  // 🔹 fetch regions + villes in parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resRegions, resVilles] = await Promise.all([
          axios.get("http://localhost/Asya-App/back-end/get_region.php"),
          axios.get("http://localhost/Asya-App/back-end/get_ville.php")
        ]);
        setRegions(resRegions.data || []);
        setVilles(resVilles.data || []);
      } catch (err) {
        console.error(err);
        setMessage("❌ Erreur de chargement des données");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 filter villes optimized
  const villesFiltered = useMemo(() => {
    if (!form?.region_id) return [];
    return villes.filter(v => Number(v.region) === Number(form.region_id));
  }, [villes, form?.region_id]);

  // 🔹 submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage('');
      const res = await axios.post(
        "http://localhost/Asya-App/back-end/updateClient.php",
        form
      );
      setMessage("✅ Profil mis à jour avec succès");
      setMessageType("success");
      localStorage.setItem("admin", JSON.stringify(form));

      // Flash effect
      if (formRef.current) {
        formRef.current.classList.add(styles.successFlash);
        setTimeout(() => {
          formRef.current?.classList.remove(styles.successFlash);
        }, 300);
      }
    } catch (err) {
      setMessage("❌ Erreur lors de la mise à jour");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

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
    <div className={styles.container}>
      <div className={styles.card} ref={formRef}>
        {/* Header avec avatar et infos */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.avatar}>
              {form.nom?.[0]}{form.prenom?.[0]}
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

        {/* Message de feedback */}
        {message && (
          <div className={`${styles.message} ${messageType === 'success' ? styles.messageSuccess : styles.messageError}`}>
            {message}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>👤</span>
              <h3>Informations personnelles</h3>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>ID</label>
                <input
                  name="id"
                  value={form.id || ""}
                  disabled
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label>Nom</label>
                <input
                  name="nom"
                  value={form.nom || ""}
                  onChange={handleChange}
                  placeholder="Nom"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label>Prénom</label>
                <input
                  name="prenom"
                  value={form.prenom || ""}
                  onChange={handleChange}
                  placeholder="Prénom"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  placeholder="Email"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label>Téléphone</label>
                <input
                  name="telephone"
                  value={form.telephone || ""}
                  onChange={handleChange}
                  placeholder="Téléphone"
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📍</span>
              <h3>Localisation</h3>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Région</label>
                <select
                  name="region_id"
                  value={form.region_id || ""}
                  onChange={handleChange}
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
                  disabled={!form.region_id}
                  className={styles.select}
                >
                  <option value="">Sélectionner</option>
                  {villesFiltered.map(v => (
                    <option key={v.id} value={v.id}>{v.ville}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🔑</span>
              <h3>Rôle</h3>
            </div>
            <div className={styles.field}>
              <input
                name="role"
                value={form.role || ""}
                disabled
                className={styles.input}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className={styles.button}
          >
            {saving ? (
              <>
                <span className={styles.spinner} />
                Sauvegarde...
              </>
            ) : (
              "Sauvegarder"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;