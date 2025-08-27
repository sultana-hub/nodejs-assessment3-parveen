// components/ExperienceCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function ExperienceCard({ experience }) {
  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">{experience.company}</Typography>
        <Typography variant="subtitle2">{experience.title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {new Date(experience.from).toLocaleDateString()} -{' '}
          {experience.current ? 'Present' : new Date(experience.to).toLocaleDateString()}
        </Typography>
        {experience.description && (
          <Box mt={1}>
            <Typography variant="body2">{experience.description}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
