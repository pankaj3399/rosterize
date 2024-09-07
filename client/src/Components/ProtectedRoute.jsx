import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader/Loader.jsx';

const ProtectedRoute = ({
  children
}) => {

  const {authData, loading} = useAuth();

  if(loading) return <Loader/>

  if (!authData || !authData?.email) {
    return <Navigate to='/landing-page' replace />;
  }

  return children;
};

export default ProtectedRoute;
