import React from 'react'
import { useNavigate } from 'react-router-dom'

function HomeAdmin() {

  const navigate = useNavigate(); 

  const admin = localStorage.getItem("admin")   ;

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/logIn"); 
  };
  console.log(admin)

  return (
    <div>
      Bonjour {admin?.nom}
      <button className='btn btn-danger' onClick={handleLogout}>
        Deconnecter
      </button>
    </div>
  )
}

export default HomeAdmin