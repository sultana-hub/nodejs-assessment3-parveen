import React, { useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    MenuItem,
    Button
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCurrentProfile } from '../../queryFunctions/profile/getCurrentProfile';
import { editProfile } from '../../queryFunctions/profile/editProfile';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate();

    const { data: profileData, isLoading } = useQuery({
        queryKey: ['current'],
        queryFn: getCurrentProfile,
    });
console.log("profileData",profileData)
    const { register, handleSubmit, reset ,formState: { errors }} = useForm({
        defaultValues: {
            status: '',
            company: '',
            website: '',
            location: '',
            skills: '',
            githubusername: '',
            bio: '',
            twitter: '',
            facebook: '',
            youtube: '',
            linkedin: '',
            instagram: '',
        }
    });

    // set form values when data is available
    useEffect(() => {
        if (profileData) {
            const {
                status,
                company,
                website,
                location,
                skills,
                githubusername,
                bio,
                social = {}
            } = profileData;

            reset({
                status: status || '',
                company: company || '',
                website: website || '',
                location: location || '',
                skills: skills?.join(', ') || '',
                githubusername: githubusername || '',
                bio: bio || '',
                twitter: social.twitter || '',
                facebook: social.facebook || '',
                youtube: social.youtube || '',
                linkedin: social.linkedin || '',
                instagram: social.instagram || '',
            });
        }
    }, [profileData, reset]);

    const { mutate } = useMutation({
        mutationFn: editProfile,
        onSuccess: () => {
            Swal.fire({
                title: 'Success',
                text: 'Profile updated successfully!',
                icon: 'success'
            });
           navigate(`/dashboard/${profileData.user._id}`);
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            });
        }
    });

    const onSubmit = (data) => {
        const payload = {
            ...data,
            skills: data.skills.split(',').map(skill => skill.trim()),
            social: {
                twitter: data.twitter,
                facebook: data.facebook,
                youtube: data.youtube,
                linkedin: data.linkedin,
                instagram: data.instagram,
            }
        };
        mutate(payload);
    };

    return (
        <Container maxWidth="md" sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }} color='primary'>
                Edit Your Profile
            </Typography>
            <Typography variant="body2" sx={{ mb: 4 }}>* = required fields</Typography>

            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    fullWidth
                    select
                    label="* Select Professional Status"
                    {...register("status", { required: true })}
                    margin="normal"
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
                    Update Profile
                </Button>
            </Box>
        </Container>
    );
};

export default EditProfile;


