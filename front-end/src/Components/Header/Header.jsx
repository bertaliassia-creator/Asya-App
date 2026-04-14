import React, { useState } from "react";
import "./header.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faEnvelope, faFileCircleCheck, faHouse, faInfoCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate()

  return (
    <header className="header">
      <div className="container">

        <div className="logo">
          <Link to={"/"}>SENS CARS</Link>
        </div>

        <nav className="nav">
          <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
            <li><Link to={"/"}><FontAwesomeIcon icon={faHouse} /> Accueil</Link></li>
            <li><Link to={"/voiture"}><FontAwesomeIcon icon={faCar} /> Voitures</Link></li>
            <li><a href="#apropose" onClick={() => navigate("/#apropose")}><FontAwesomeIcon icon={faInfoCircle} /> À propos</a></li>
            <li><a href="#contact" onClick={() => navigate("/#contact")}><FontAwesomeIcon icon={faEnvelope} /> Contact</a></li>
          </ul>
        </nav>

        <div className="nav-btn">
          <button onClick={() => navigate('/logIn')}><FontAwesomeIcon icon={faUser} /> Se Connecter</button>
        </div>

        {/* HAMBURGER */}
        <div 
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

      </div>
    </header>
  );
}

export default Header;