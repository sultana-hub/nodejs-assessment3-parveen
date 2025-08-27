import React from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    Button
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addExperience } from '../../queryFunctions/dashboard/experience';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const AddExperience = () => {
    const navigate=useNavigate()
    const { userId} = useParams();
    const queryClient = useQueryClient();
    const { register, handleSubmit, watch, reset, control } = useForm();
    const currentWatch = watch('current', false);

    const { mutate, isPending } = useMutation({
        mutationFn: addExperience,
        onSuccess: () => {
            queryClient.invalidateQueries(['current']); // Refresh profile
            reset();
            Swal.fire({
                title: "Good job!",
                text: "Experience added successfully!",
                icon: "success"
            });
            navigate(`/dashboard/${userId}`);
        },
    });

  const onSubmit = (data) => {
  if (data.current) {
    data.to = Date.now; // or null depending on backend expectations
  }

  mutate(data); // send to mutation (addEducation)
};

    return (
        <Container maxWidth="md" sx={{ mb: 5 }}>
            <Typography variant="h4" component="h1" color="primary" gutterBottom sx={{ mt: 4 }}>
                Add An Experience
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                <i className="fas fa-code-branch" /> Add any developer/programming positions that you have had in the past
            </Typography>
            <Typography variant="body2" sx={{ mb: 4 }}>* = required fields</Typography>

            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    fullWidth
                    label="* Job Title"
                    {...register("title", { required: true })}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="* Company"
                    {...register("company", { required: true })}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Location"
                    {...register("location")}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    type="date"
                    label="* From Date"
                    {...register("from", { required: true })}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                {!currentWatch && (
                    <TextField
                        fullWidth
                        type="date"
                        label="To Date"
                        {...register("to")}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                )}
                <Controller
                    name="current"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Checkbox {...field} checked={field.value} />}
                            label="Current Job"
                        />
                    )}
                />
                <TextField
                    fullWidth
                    label="Job Description"
                    {...register("description")}
                    margin="normal"
                    multiline
                    rows={4}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                    disabled={isPending}
                >
                    {isPending ? 'Submitting...' : 'Submit'}
                </Button>
            </Box>
        </Container>
    );
};

export default AddExperience;
