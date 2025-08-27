import React from 'react';
import {
  Container,
  Typography,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from '@mui/material';
import {
  AccountCircle,
  Work,
  School,
  Edit,
  Delete,
  PersonRemove
} from '@mui/icons-material';
import { Link } from "react-router-dom";
import { useParams, Navigate } from "react-router-dom";
import useAuth from "../../../src/hooks/useAuth";
import { getCurrentProfile } from '../../queryFunctions/profile/getCurrentProfile';
import { useQuery } from '@tanstack/react-query';
import {deleteExperience} from '../../queryFunctions/dashboard/experience'
import {deleteEducation} from '../../queryFunctions/dashboard/education'
import { deleteProfile } from '../../queryFunctions/profile/deleteProfile';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
const Dashboard = () => {
   const navigate=useNavigate()
   const queryClient = useQueryClient();
  const { userId: routeUserId } = useParams();
  const { userId: loggedInUserId } = useAuth();
  console.log("routed id", routeUserId)
  console.log("logged in  id", loggedInUserId)
  const name = sessionStorage.getItem('name')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['current'],
    queryFn: getCurrentProfile,
    enabled: !!loggedInUserId
  })
  console.log("current user data", data)


  if (!loggedInUserId) {
    return <Navigate to="/login" replace />;
  }

  if (routeUserId !== loggedInUserId) {
    return <Navigate to="/error" replace />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h3" color="primary" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom>
        <AccountCircle sx={{ mr: 1 }} />
        Welcome {name}
      </Typography>

      {/* If no profile exists, prompt user to create one */}
      {!data ? (
        <>

          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: 2,
              p: 3,
              mt: 4,
              marginBottom: '280px',
              textAlign: 'center',
              backgroundColor: '#f9f9f9',
              marginTop:"100px"
            }}
          >
            <Typography variant="body1" sx={{ mt: 1 }}>
              You have not yet created a profile. Please add some info to get started.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/create-profile/${routeUserId}`}
              sx={{ mt: 2 }}
            >
              Create Profile
            </Button>
          </Box>

        </>
      ) : (
        <>
          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ my: 3 }}>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              component={Link}
              to={`/edit-profile/${routeUserId}`}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              startIcon={<Work />}
              component={Link}
              to={`/add-experience/${routeUserId}`}
            >
              Add Experience
            </Button>
            <Button
              variant="outlined"
              startIcon={<School />}
              component={Link}
              to={`/add-education/${routeUserId}`}
            >
              Add Education
            </Button>
          </Stack>
          {/* general information section */}

          {/* Profile Information Card */}
          <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f5f5f5', mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Profile Information
            </Typography>

            <Typography><strong>Status:</strong> {data.status}</Typography>
            <Typography><strong>Company:</strong> {data.company || 'N/A'}</Typography>
            <Typography><strong>Website:</strong>{' '}
              {data.website ? (
                <a href={data.website} target="_blank" rel="noopener noreferrer">{data.website}</a>
              ) : 'N/A'}
            </Typography>
            <Typography><strong>Location:</strong> {data.location || 'N/A'}</Typography>
            <Typography><strong>Skills:</strong> {data.skills?.join(', ') || 'N/A'}</Typography>
            <Typography><strong>Bio:</strong> {data.bio || 'N/A'}</Typography>
            {data.githubusername && (
              <Typography>
                <strong>GitHub:</strong>{' '}
                <a href={`https://github.com/${data.githubusername}`} target="_blank" rel="noopener noreferrer">
                  {data.githubusername}
                </a>
              </Typography>
            )}
          </Box>

          {/* Experience Section */}
          <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f5f5f5', mb: 4 }}>
            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
              Experience Credentials
            </Typography>
            {
              data?.experience.length === 0 ? (
                <>
                  <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f5f5f5', mb: 4 }}>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      You have not yet added Experience. Please add some info to get started.
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Company</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell>Years</TableCell>
                          <TableCell>Action</TableCell>
                          <TableCell />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.experience?.map((exp) => (
                          <TableRow key={exp._id}>
                            <TableCell>{exp.company}</TableCell>
                            <TableCell>{exp.title}</TableCell>
                            <TableCell>
                              {new Date(exp.from).toLocaleDateString()} -{' '}
                              {exp.current
                                ? 'Now'
                                : new Date(exp.to).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                startIcon={<Delete />}
                                onClick={()=>deleteExperience(exp._id,navigate)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )
            }

          </Box>
          {/* Education Section */}
          <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f5f5f5', mb: 4 }}>
            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
              Education Credentials
            </Typography>
            {
              data?.education.length === 0 ? (
                <>
                  <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f5f5f5', mb: 4 }}>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      You have not yet added Education. Please add some info to get started.
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Institute</TableCell>
                          <TableCell>Degree</TableCell>
                          <TableCell>Years</TableCell>
                          <TableCell>Action</TableCell>
                          <TableCell />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.education?.map((edu) => (
                          <TableRow key={edu._id}>
                            <TableCell>{edu.school}</TableCell>
                            <TableCell>{edu.degree}</TableCell>
                            <TableCell>
                              {new Date(edu.from).toLocaleDateString()} -{' '}
                              {edu.current
                                ? 'Now'
                                : new Date(edu.to).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                startIcon={<Delete />}
                                  onClick={()=>deleteEducation(edu._id,navigate)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )
            }

          </Box>
          {/* Delete Account */}
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<PersonRemove />}
               onClick={()=>deleteProfile(navigate,queryClient)}
            >
              Delete My Account
            </Button>
          </Box>
        </>
      )}
    </Container>
  );




};

export default Dashboard;
