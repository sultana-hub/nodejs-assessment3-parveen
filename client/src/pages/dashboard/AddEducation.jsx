import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addEducation } from '../../queryFunctions/dashboard/education'
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const AddEducation = () => {
const navigate=useNavigate()
  const { userId } = useParams();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const watchCurrent = watch("current", false); // Watch the "current" checkbox

  const { mutate, isLoading } = useMutation({
    mutationFn: addEducation,
    onSuccess: (res) => {
      queryClient.invalidateQueries(['current']); // Refresh profile
      reset();
      Swal.fire({
        title: "Good job!",
        text: "Education added successfully!",
        icon: "success"
      });
      navigate(`/dashboard/${userId}`);
    
    },
    onError: (err) => {
      alert(err?.response?.data?.message || "Something went wrong");
    }
  });

const onSubmit = (data) => {
  if (data.current) {
    data.to = ""; // or null depending on backend expectations
  }

  mutate(data); // send to mutation (addEducation)
};

  return (
    <Container maxWidth="md" sx={{ mb: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }} color='primary'>
        Add Your Education
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        <i className="fas fa-graduation-cap" /> Add any school, bootcamp, etc.
      </Typography>
      <Typography variant="body2" sx={{ mb: 4 }}>
        * = required fields
      </Typography>

      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="* Institute"
          margin="normal"
          {...register("school", { required: "School is required" })}
          error={!!errors.school}
          helperText={errors.school?.message}
        />
        <TextField
          fullWidth
          label="* Degree or Certificate"
          margin="normal"
          {...register("degree", { required: "Degree is required" })}
          error={!!errors.degree}
          helperText={errors.degree?.message}
        />
        <TextField
          fullWidth
          label="* Field of Study"
          margin="normal"
          {...register("fieldofstudy", { required: "Field of study is required" })}
          error={!!errors.fieldofstudy}
          helperText={errors.fieldofstudy?.message}
        />
        <TextField
          fullWidth
          type="date"
          label="From Date"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          {...register("from", { required: "From date is required" })}
          error={!!errors.from}
          helperText={errors.from?.message}
        />

        {!watchCurrent && (
          <TextField
            fullWidth
            type="date"
            label="To Date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register("to")}
          />
        )}

        <FormControlLabel
          control={<Checkbox {...register("current")} />}
          label="Current School"
        />

        <TextField
          fullWidth
          label="Program Description"
          multiline
          rows={3}
          margin="normal"
          {...register("description")}
        />

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Add Education"}
        </Button>
      </Box>
    </Container>
  );
};

export default AddEducation;
