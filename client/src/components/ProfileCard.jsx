// components/ProfileCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, Chip, Grid } from '@mui/material';

export default function ProfileCard({ profile }) {
  if (!profile) return null;

  const { user, status, company, website, skills } = profile;

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              src={`http://localhost:5000/${user.avatar}`}
              alt={user.name}
              sx={{ width: 64, height: 64 }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="subtitle2" color="textSecondary">{status}</Typography>
            <Typography variant="body2" color="textSecondary">
              {company && <span>At {company}</span>}
              {user.city && <span> — {user.city}</span>}
            </Typography>
            {website && (
              <Typography variant="body2">
                <a href={`https://${website}`} target="_blank" rel="noopener noreferrer">
                  {website}
                </a>
              </Typography>
            )}
          </Grid>
        </Grid>

        <Box mt={2}>
          {skills?.slice(0, 5).map((skill, idx) => (
            <Chip key={idx} label={skill} sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
