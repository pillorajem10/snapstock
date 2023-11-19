import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthRouter = ({ children, requireAuth = true }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('role');

    if (requireAuth && !token) {
      navigate('/');
    } /* else if (requireAuth && role === '0') {
      navigate('/home');
    } */

  }, [navigate, requireAuth]);

  return requireAuth ? <>{children}</> : null;
};

export default AuthRouter;
