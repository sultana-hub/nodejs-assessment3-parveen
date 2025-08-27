// components/EducationCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function EducationCard({ education }) {
  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">{education.school}</Typography>
        <Typography variant="subtitle2">{education.degree} in {education.fieldofstudy}</Typography>
        <Typography variant="body2" color="textSecondary">
          {new Date(education.from).toLocaleDateString()} -{' '}
          {education.current ? 'Present' : new Date(education.to).toLocaleDateString()}
        </Typography>
        {education.description && (
          <Box mt={1}>
            <Typography variant="body2">{education.description}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
