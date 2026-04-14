import React from 'react';
import './DashBoard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar,
  faPlus,
  faCalendarCheck,
  faUsers,
  faChartLine,
  faUser,
  faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function DashBoard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vous déconnecter ?')) {
      localStorage.removeItem('admin');
      navigate('/');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-top">
          <div className="brand">
            <FontAwesomeIcon icon={faCar} className="brand-icon" />
            <span className="brand-text">SENS CAR</span>
          </div>

          <ul className="nav-list">
            <li className="nav-item" data-tooltip="Nos Voitures">
              <NavLink
                to="/admin/NosVoitures"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faCar} />
                </span>
                <span className="title">Nos Voitures</span>
              </NavLink>
            </li>
            <li className="nav-item" data-tooltip="Ajouter Voiture">
              <NavLink
                to="/admin/AjouterVoiture"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faPlus} />
                </span>
                <span className="title">Ajouter Voiture</span>
              </NavLink>
            </li>
            <li className="nav-item" data-tooltip="Réservation">
              <NavLink
                to="/admin/Reservation"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faCalendarCheck} />
                </span>
                <span className="title">Réservation</span>
              </NavLink>
            </li>
            <li className="nav-item" data-tooltip="Clients">
              <NavLink
                to="/admin/Clients"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faUsers} />
                </span>
                <span className="title">Clients</span>
              </NavLink>
            </li>
            
            <li className="nav-item" data-tooltip="Profil">
              <NavLink
                to="/admin/Profile"
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

export default DashBoard;