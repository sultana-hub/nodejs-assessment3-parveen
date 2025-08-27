import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllProfiles } from '../../queryFunctions/profile/getAllProfiles';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import { imagePath } from '../../api/axiosInstance';
const Profiles = () => {
  const { data: profiles, isPending, isError, error } = useQuery({
    queryKey: ['profiles'],
    queryFn: getAllProfiles,
  });

  const [selectedCardId, setSelectedCardId] = useState(null);

  const handleCardClick = (id) => {
    setSelectedCardId((prevId) => (prevId === id ? null : id));
  };

const getAvatar = (avatar) => {
  if (!avatar) return '';

  // If it's a local uploaded file
  if (avatar.startsWith('uploads')) {
    return imagePath(avatar);
  }

  // Fallback to gravatar if not a file
  return avatar.startsWith('//') ? `https:${avatar}` : avatar;
};




  if (isPending)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  if (isError)
    return <Alert severity="error">Error: {error.message}</Alert>;

  return (
    <Container sx={{ marginBottom: '110px', paddingY: 4 }}>
      <Typography
        variant="h3"
        color="primary.main"
        gutterBottom
        sx={{ fontWeight: 700, letterSpacing: 1 }}
      >
        Developers
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <ConnectWithoutContactIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
        Browse and connect with developers
      </Typography>

      <Grid container spacing={4}>
        {profiles?.map((profile) => (
          <Grid item xs={12} md={6} key={profile._id} component="div">
            <Card
              onClick={() => handleCardClick(profile._id)}
              sx={{
                backgroundColor: '#ffffff',
                height: '100%',
                p: 3,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${selectedCardId === profile._id ? '#d32f2f' : '#1976d2'}`,
                transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                },
                cursor: 'pointer',
              }}
            >
              <Avatar
                src={getAvatar(profile.user?.avatar)}
                alt={profile.user?.name}
                //  sx={{ width: 120, height: 120, mr: 3, border: '2px solid #e0e0e0' }}
                sx={{ width: 100, height: 100, mr: 3, border: '2px solid #e0e0e0' }}
              />
              <CardContent sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
                    {profile.user?.name}
                  </Typography>
                  
                  {profile.company && (
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                      {profile.company}
                    </Typography>
                  )}
                  
                  {profile.status && (
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                      {profile.status}
                    </Typography>
                  )}

                  <Typography variant="body1" color="text.secondary">
                    {profile.user?.city}
                  </Typography>

                  <Box mt={2}>
                   <Button
                        variant="contained"
                            size="medium"
                   component={Link} 
                           to={`/profiles/profile/${profile.user._id}`}
                         sx={{
                          backgroundColor: '#1976d2',
                            '&:hover': { backgroundColor: '#1565c0' },
                        borderRadius: 2,
                              textTransform: 'none',
                         fontWeight: 500,
                       }}
                          >
                         View Profile
                         </Button>
                  </Box>
                </Box>

                {/* Skills Section on the Right */}
                {profile.skills && profile.skills.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 4, mr: 5, pl: 5, mb: 5 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ color: '#333' }}
                    >
                      Skills
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      {profile.skills.map((skill, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          color="text.primary"
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
                          <span style={{ color: '#1976d2', marginRight: 8 }}>✓</span> {skill}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Profiles;


// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getAllProfiles } from '../queryFunctions/getAllProfiles';
// import {
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Avatar,
//   Button,
//   CircularProgress,
//   Alert,
//   Box,
//   Chip, // Add Chip for displaying skills
// } from '@mui/material';
// import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

// const Profiles = () => {
//   const { data: profiles, isPending, isError, error } = useQuery({
//     queryKey: ['profiles'],
//     queryFn: getAllProfiles,
//   });

//   if (isPending)
//     return (
//       <Box textAlign="center" mt={5}>
//         <CircularProgress />
//       </Box>
//     );
//   if (isError)
//     return <Alert severity="error">Error: {error.message}</Alert>;

//   return (
//     <Container style={{ marginBottom: "250px" }}>
//       <Typography variant="h3" color="primary" gutterBottom>
//         Developers
//       </Typography>
//       <Typography variant="h6" gutterBottom>
//         <ConnectWithoutContactIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
//         Browse and connect with developers
//       </Typography>

//       <Grid container spacing={4}>
//         {profiles?.map((profile) => (
//           <Grid item xs={12} md={6} key={profile._id} component="div">
//             <Card
//               sx={{
//                 backgroundColor: '#f4f4f4',
//                 height: '100%',
//                 p: 4,
//                 display: 'flex',
//                 alignItems: 'center',
//               }}
//             >
//               <Avatar
//                 src={profile.user?.avatar} // Updated to use profile.user.avatar
//                 alt={profile.user?.name}
//                 sx={{ width: 120, height: 120, mr: 4 }}
//               />
//               <CardContent sx={{ flex: 1 }}>
//                 <Typography variant="h5" gutterBottom>
//                   {profile.user?.name}
//                 </Typography>
                
//                 {profile.company && (
//                   <Typography variant="body1" color="text.secondary">
//                     {profile.company}
//                   </Typography>
//                 )}
                
//                 {profile.status && (
//                   <Typography variant="body1" color="text.secondary">
//                     {profile.status}
//                   </Typography>
//                 )}

//                 <Typography variant="body1" color="text.secondary">
//                   {profile.user?.city}
//                 </Typography>

//                 {/* Display Skills */}
//                 {profile.skills && profile.skills.length > 0 && (
//                   <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
//                       <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//                       Skills:
//                     </Typography>
//                     {profile.skills.map((skill, index) => (
//                       <Chip
//                         key={index}
//                         label={skill}
//                         sx={{ backgroundColor: '#e0e0e0', color: '#333' }}
//                       />
//                     ))}
//                   </Box>
//                 )}

//                 <Box mt={2}>
//                   <Button
//                     variant="contained"
//                     size="medium"
//                     href={`/profile/${profile._id}`}
//                   >
//                     View Profile
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default Profiles;

