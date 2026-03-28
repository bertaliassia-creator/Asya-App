import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// ✅ CORRECTION : Importez les icônes de MARQUES depuis ce package
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn 
} from "@fortawesome/free-brands-svg-icons";
// ✅ Importez les icônes SOLIDES pour les contacts
import { 
  faEnvelope,
  faPhone,
  faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section" aria-labelledby="footer-title">
      <div className="container">
        <div className="row g-4">
          
          {/* LOGO & DESCRIPTION */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand">
              <h3 className="footer-logo">SENS CARS</h3>
              <p className="footer-desc">
                La meilleure expérience de location de voitures. 
                Qualité, sécurité et service client irréprochable.
              </p>
              <div className="footer-contact-mini">
                <div className="contact-item">
                  <FontAwesomeIcon icon={faPhone} />
                  <span>+212 6 12 34 56 78</span>
                </div>
                <div className="contact-item">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>contact@SENSCAR.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* LIENS RAPIDES */}
          <div className="col-lg-2 col-md-6">
            <h5 className="footer-title">Liens Rapides</h5>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Accueil</a></li>
              <li><a href="#" className="footer-link">Voitures</a></li>
              <li><a href="#" className="footer-link">Réservation</a></li>
              <li><a href="#" className="footer-link">À propos</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
            </ul>
          </div>

          {/* RESEAUX SOCIAUX */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title">Suivez-nous</h5>
            <p className="footer-social-desc">Restez informé de nos dernières offres.</p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook" className="social-link">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" aria-label="Twitter" className="social-link">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" aria-label="LinkedIn" className="social-link">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title">Newsletter</h5>
            <p className="footer-social-desc">Inscrivez-vous pour recevoir nos offres.</p>
            <form className="footer-newsletter">
              <input type="email" placeholder="Votre email" className="newsletter-input" />
              <button type="submit" className="newsletter-btn">ENVOYER</button>
            </form>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="footer-bottom">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start">
                <p className="mb-0">&copy; {currentYear} LUX CARS. Tous droits réservés.</p>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <p className="mb-0">
                  <a href="#" className="footer-link-sm">Politique de confidentialité</a>
                  <span className="mx-2">|</span>
                  <a href="#" className="footer-link-sm">Conditions d'utilisation</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;