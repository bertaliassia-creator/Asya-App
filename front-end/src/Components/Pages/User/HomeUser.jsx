import React from 'react'
import { useNavigate } from 'react-router-dom'

function HomeUser() {

  const navigate = useNavigate(); 

  const user = JSON.parse( localStorage.getItem("client"));
  console.log(user)

  const handleLogout = () => {
    localStorage.removeItem("client");
    navigate("/logIn"); 
  };
  console.log(user)

  return (
    <div>
      Bonjour {user.prenom} hhhhhhhhhhh <br />
      <button className='btn btn-danger' onClick={handleLogout}>
        Deconnecter
      </button>
    </div>
  )
} 

export default HomeUser