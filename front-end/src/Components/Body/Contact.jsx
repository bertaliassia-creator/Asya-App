import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "./Contact.css";

function Contact() {
  const contacts = [
    { 
      id: 1, 
      icon: faPhone, 
      title: "Téléphone", 
      value: "+212 6 12 34 56 78", 
      href: "tel:+212612345678" 
    },
    { 
      id: 2, 
      icon: faEnvelope, 
      title: "Email", 
      value: "contact@SENSCAR.com", 
      href: "mailto:contact@SENSCAR.com" 
    },
    { 
      id: 3, 
      icon: faMapMarkerAlt, 
      title: "Adresse", 
      value: "Centre ville , Immouzer Kandar , Maroc", 
      href: "https://maps.google.com/?q=123+Rue+de+la+Voiture+Casablanca" 
    },
  ];

  return (
    <section className="contact-section" aria-labelledby="contact-title" id="contact">
      <div className="services-container">
        <h2 id="contact-title" className="section-title">Contact rapide</h2>
        <div className="title-underline"></div>
        
        <div className="row g-4 justify-content-center">
          {contacts.map((contact) => (
            <div className="col-md-4" key={contact.id}>
              <article className="contact-card h-100" aria-label={contact.title}>
                <div className="contact-icon-wrapper">
                  <FontAwesomeIcon icon={contact.icon} className="contact-icon" />
                </div>
                <h5 className="mb-2">{contact.title}</h5>
                <a 
                  href={contact.href} 
                  className="contact-value text-decoration-none"
                  target="_blank" 
                  rel="noopener noreferrer"
                  tabIndex="0"
                >
                  {contact.value}
                </a>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Contact;