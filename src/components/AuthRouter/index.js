import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthRouter = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('role');

    if (!token) {
      navigate('/');
    } /* else if (role === '0') {
      navigate('/home');
    } */

  }, [navigate]);

  return <>{children}</>;
};

export default AuthRouter;
