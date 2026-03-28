import React from 'react'
import { Navigate } from 'react-router-dom';

function ProtectedRouteAdmin({children}) {
 const admin = localStorage.getItem('admin');
    if (!admin) {
    return <Navigate to="/logIn" replace />;
  }
    return children
  
}


export default ProtectedRouteAdmin
