import React, { Children } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({children}) { 
    const userState = useSelector((state) => state.user);

    if (userState.uid === '')  {
        return <Navigate to="/" replace />
    }
    return children;
}

export default ProtectedRoute;