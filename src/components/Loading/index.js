import React from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, Box, Typography } from '@mui/material';

//STYLE
import styles from './index.module.css';

const LoadingSpinner = () => {
  const loading = useSelector((state) => state.common.ui.loading);

  if (!loading) {
    return null; // If loading is false, do not render anything
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      position="fixed"
      top={0}
      left={0}
      width="100%"
      backgroundColor="rgba(255, 255, 255, 0.8)"
      zIndex={9999}
    >
      <CircularProgress style={{ color: 'black' }} />
      <Typography variant="body1" className={styles.loadingMessage}>
        Please bear with us...
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
