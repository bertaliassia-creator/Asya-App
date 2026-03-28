import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCar, 
  faMoneyBillWave, 
  faShieldAlt, 
  faHeadset 
} from "@fortawesome/free-solid-svg-icons";
import "./Services.css";

function Services() {
  const services = [
    { 
      id: 1, 
      icon: faCar, 
      title: "Large choix de voitures", 
      description: "Choisissez parmi une large gamme de véhicules adaptés à vos besoins." 
    },
    { 
      id: 2, 
      icon: faMoneyBillWave, 
      title: "Prix abordables", 
      description: "Des tarifs compétitifs pour toutes les durées de location." 
    },
    { 
      id: 3, 
      icon: faShieldAlt, 
      title: "Assurance incluse", 
      description: "Profitez d'une tranquillité d'esprit avec notre assurance complète." 
    },
    { 
      id: 4, 
      icon: faHeadset, 
      title: "Support 24/7", 
      description: "Notre équipe est disponible à tout moment pour vous aider." 
    },
  ];

  return (
    <section className="services-section" aria-labelledby="services-title">
      <div className="services-container">
        <h2 id="services-title" className="section-title">Nos Services</h2>
        <div className="title-underline"></div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <article 
              className="service-card" 
              key={service.id} 
              aria-label={service.title}
              tabIndex="0"
            >
              <div className="service-icon-wrapper">
                <FontAwesomeIcon icon={service.icon} className="service-icon" />
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;