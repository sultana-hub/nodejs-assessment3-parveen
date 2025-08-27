import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    MenuItem,
    Button,
    Stack,
    Grid,
    IconButton
} from '@mui/material';
import {
    Person,
    Twitter,
    Facebook,
    YouTube,
    LinkedIn,
    Instagram
} from '@mui/icons-material';
import { createProfile } from '../../queryFunctions/profile/createProfile';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
const CreateProfile = () => {
    const navigate = useNavigate();
  const { userId } = useParams();
    const [showSocialLinks, setShowSocialLinks] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const { mutate, isPending, isSuccess, isError } = useMutation({
        mutationFn: createProfile,
        onSuccess: () => {
            Swal.fire({
                title: "Good job!",
                text: "Profile created successfully!",
                icon: "success"
            });
            navigate(`/dashboard/${userId}`); // redirect after successful registration
        },
        onError: () => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",

            });

        }
    });

    const onSubmit = (data) => {
        const payload = {
            status: data.status,
            company: data.company,
            website: data.website,
            location: data.location,
            skills: data.skills.split(',').map(skill => skill.trim()),
            githubusername: data.githubusername,
            bio: data.bio,
            social: {
                twitter: data.twitter || '',
                facebook: data.facebook || '',
                youtube: data.youtube || '',
                linkedin: data.linkedin || '',
                instagram: data.instagram || '',
            },
        };

        console.log("Submitting payload:", payload);
        mutate(payload);
    };




    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
                Create Your Profile
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                <i className="fas fa-user" /> Let's get some information to make your profile stand out
            </Typography>
            <Typography variant="body2" sx={{ mb: 4 }}>* = required fields</Typography>

            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    fullWidth
                    select
                    label="* Select Professional Status"
                    {...register("status", { required: true })}
                    margin="normal"
                    defaultValue=""
                    helperText="Give us an idea of where you are at in your career"
                >
                    <MenuItem value="">-- Select Status --</MenuItem>
                    <MenuItem value="Developer">Developer</MenuItem>
                    <MenuItem value="Junior Developer">Junior Developer</MenuItem>
                    <MenuItem value="Senior Developer">Senior Developer</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Student or Learning">Student or Learning</MenuItem>
                    <MenuItem value="Instructor">Instructor or Teacher</MenuItem>
                    <MenuItem value="Intern">Intern</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </TextField>

                <TextField fullWidth label="Company" {...register("company")} margin="normal" />
                <TextField fullWidth label="Website" {...register("website")} margin="normal" />
                <TextField fullWidth label="Location" {...register("location")} margin="normal" />
                <TextField
                    fullWidth
                    label="* Skills (e.g. HTML,CSS,JavaScript)"
                    {...register("skills", { required: true })}
                    margin="normal"
                />
                <TextField fullWidth label="Github Username" {...register("githubusername")} margin="normal" />
                <TextField
                    fullWidth
                    label="A short bio of yourself"
                    {...register("bio")}
                    margin="normal"
                    multiline
                    rows={3}
                />

                <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
                    Social Network Links
                </Typography>
                <TextField fullWidth label="Twitter URL" {...register("twitter")} margin="normal" />
                <TextField fullWidth label="Facebook URL" {...register("facebook")} margin="normal" />
                <TextField fullWidth label="YouTube URL" {...register("youtube")} margin="normal" />
                <TextField fullWidth label="LinkedIn URL" {...register("linkedin")} margin="normal" />
                <TextField fullWidth label="Instagram URL" {...register("instagram")} margin="normal" />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                >
                    Submit
                </Button>
            </Box>
        </Container>
    );

};

export default CreateProfile;
