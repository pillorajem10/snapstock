import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminRouter = ({ children }) => {
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const role = Cookies.get('role');

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else if (role !== '3') {
      navigate('/home');
    }
  }, [navigate, token, role]);

  return <>{children}</>;
};

export default AdminRouter;
