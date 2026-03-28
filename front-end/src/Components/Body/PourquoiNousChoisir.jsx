import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCarSide, 
  faCalendarCheck, 
  faCreditCard, 
  faHeadset 
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Pourquoi.css";

// Données séparées pour une meilleure maintenabilité
const reasonsData = [
  { 
    id: 1, 
    icon: faCarSide, 
    title: "Voitures récentes", 
    desc: "Nos véhicules sont toujours récents et bien entretenus." 
  },
  { 
    id: 2, 
    icon: faCalendarCheck, 
    title: "Réservation facile", 
    desc: "Réservez votre voiture en quelques clics seulement." 
  },
  { 
    id: 3, 
    icon: faCreditCard, 
    title: "Paiement sécurisé", 
    desc: "Transactions rapides et sécurisées pour tous nos clients." 
  },
  { 
    id: 4, 
    icon: faHeadset, 
    title: "Service rapide", 
    desc: "Support client disponible 24/7 pour vous aider." 
  },
];

function PourquoiNousChoisir() {
  return (
    <section className="pourquoi-section py-5" aria-labelledby="section-title">
      <div className="services-container">
        <div className="text-center mb-5">
          <h2 id="section-title" className="section-title">Pourquoi nous choisir ?</h2>
          <div className="title-underline"></div>
        </div>

        <div className="row g-4">
          {reasonsData.map((reason, index) => (
            <div className="col-md-6 col-lg-3" key={reason.id}>
              <article 
                className="choix-card h-100 p-4 text-center" 
                aria-label={reason.title}
                tabIndex="0" // Rend l'élément focusable pour le clavier
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    // Exemple d'action au clavier
                    console.log(`Action sur ${reason.title}`);
                  }
                }}
              >
                <div className="choix-icon-wrapper">
                  <FontAwesomeIcon icon={reason.icon} className="choix-icon" />
                </div>
                <h5 className="card-title mb-2">{reason.title}</h5>
                <p className="card-desc text-muted">{reason.desc}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PourquoiNousChoisir;