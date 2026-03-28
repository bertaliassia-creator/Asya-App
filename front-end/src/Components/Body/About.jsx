import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./About.css";

function About() {
  return (
    <section className="about py-5" id="apropose">
      <div className="services-container">
        <h2 className="section-title mb-3">À propos de nous</h2>
        <p className="section-subtitle mb-4">
          Votre partenaire fiable pour la location de voitures.
        </p>
        <p className="about-text mx-auto">
          Nous sommes une agence spécialisée dans la location de voitures avec les meilleurs prix. Nous garantissons des véhicules récents, un service rapide et un support client 24/7 pour une expérience sans souci.
        </p>
      </div>
    </section>
  );
}

export default About;