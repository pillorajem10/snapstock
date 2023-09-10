import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthRouter = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token'); // Check local storage for the token

    if (!token) {
      // If there's no token, redirect to the login page or any other route
      navigate('/');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthRouter;
