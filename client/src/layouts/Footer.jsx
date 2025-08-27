
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      
      sx={{
        backgroundColor: '#1f1f1f',
        color: '#fff',
        py: 2,
        textAlign: 'center',
        mt: 'auto',
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} DevForum. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;