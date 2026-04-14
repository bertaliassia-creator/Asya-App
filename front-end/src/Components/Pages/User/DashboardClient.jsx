import React, { useEffect } from 'react';
import './DashBoardClient.css'; // Assurez-vous que ce fichier contient le CSS glassmorphism
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar,
  faCalendarCheck,
  faChartLine,
  faUser,
  faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function DashboardClient() {
  const navigate = useNavigate();

  useEffect(() => {
    const client = localStorage.getItem('client');
    console.log(client);
    if (!client) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vous déconnecter ?')) {
      localStorage.removeItem('client');
      alert('Déconnecté avec succès !');
      navigate('/');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar avec style glassmorphism */}
      <nav className="sidebar">
        <div className="sidebar-top">
          <div className="brand">
            <FontAwesomeIcon icon={faCar} className="brand-icon" />
            <span className="brand-text">SENS CAR</span>
          </div>

          <ul className="nav-list">
            <li className="nav-item" data-tooltip="Voitures">
              <NavLink
                to="/client/Voitures"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faCar} />
                </span>
                <span className="title">Voitures</span>
              </NavLink>
            </li>
            <li className="nav-item" data-tooltip="Mes Réservations">
              <NavLink
                to="/client/MesReservation"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faCalendarCheck} />
                </span>
                <span className="title">Mes Réservations</span>
              </NavLink>
            </li>
            <li className="nav-item" data-tooltip="Profil">
              <NavLink
                to="/client/Profile"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <span className="title">Profil</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <ul className="nav-list bottom-list">
          <li className="nav-item" data-tooltip="Déconnexion">
            <NavLink
              to="#"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faRightFromBracket} />
              </span>
              <span className="title">Déconnexion</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardClient;