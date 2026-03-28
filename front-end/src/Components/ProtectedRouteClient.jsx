import React, { use } from 'react'
import { Navigate} from 'react-router-dom';

function ProtectedRouteClient({children}) {
    const client = localStorage.getItem('client');
    if (!client) {
    return <Navigate to="/logIn" replace />;
  }
    return children
  
}

export default ProtectedRouteClient
