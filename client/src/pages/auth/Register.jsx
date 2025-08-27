import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { register as registerUser } from '../../queryFunctions/auth/registration';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import {
  Container,
  Button,
  Typography,
  TextField,
  Box,
  IconButton,
  InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      Swal.fire({
        title: "Good job!",
        text: "You registered successfully!",
        icon: "success"
      });
      navigate('/otp'); // redirect after successful registration
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

    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // If avatar file is uploaded
    if (data.avatar && data.avatar[0]) {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('city', data.city);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('avatar', data.avatar[0]);

      mutate(formData); // Send as multipart/form-data
    } else {
      // No image 
      const payload = {
        name: data.name,
        phone: data.phone,
        city: data.city,
        email: data.email,
        password: data.password

      };

      mutate(payload); // Send as application/json
    }

    reset();
  };


  return (
    <>

      <Container maxWidth="md">
        <Box sx={{ mt: 5, mb: 3, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
          <Typography variant="h5" align="center" gutterBottom color="primary">
            Devloper  Registration
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} id="regisForm">
            <div className="form-group">
              <TextField
                fullWidth
                label="Name"
                name="name"
                variant="outlined"
                margin="normal"
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                // You can also use the helperText prop on TextField
                helperText={errors.name ? errors.name.message : ''}
              />
              {/* {errors.name && <p className="text-danger">{errors.name.message}</p>} */}
            </div>

            <div className="form-group">
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                variant="outlined"
                margin="normal"
                {...register("phone", { required: "Phone is required" })}
                error={!!errors.phone}
                // You can also use the helperText prop on TextField
                helperText={errors.phone ? errors.phone.message : ''}
              />
              {/* {errors.phone && <p className="text-danger">{errors.phone.message}</p>} */}
            </div>


            <div className="form-group">
              <TextField
                fullWidth
                label="City"
                name="city"
                variant="outlined"
                margin="normal"
                {...register("city", { required: "City is required" })}
                error={!!errors.city}
                helperText={errors.city ? errors.city.message : ''}
              />
              {/* {errors.city && <p className="text-danger">{errors.city.message}</p>} */}
            </div>

            <div className="form-group">
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                margin="normal"
                {...register("email", { required: "Email is required" })}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
              />
              <small className="form-text">
                This site uses Gravatar so if you want a profile image, use a Gravatar email
              </small>
              {/* {errors.email && <p className="text-danger">{errors.email.message}</p>} */}
            </div>
            <div className="form-group">
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                autoComplete="new-password"

                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 4, message: "Minimum 4 characters required" },
                })}

                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
              />
              {/* {errors.password && <p className="text-danger">{errors.password.message}</p>} */}
            </div>
            <div className="form-group">
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (val) =>
                    val === watch("password") || "Passwords do not match",
                })}

                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
              />
              {/* {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>} */}
            </div>

            <Typography>Optional</Typography>
            <div className="form-group">
              <input
                type="file"
                {...register("avatar")}
                accept="image/*"
                className="form-control"
              />
            </div>


            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, borderRadius: "50px", bgcolor: "#185758ff", color: "white", "&:hover": { bgcolor: "rgba(65, 50, 107, 1)" } }}
            >
              Register
            </Button>
          </form>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography>
              Existing user? <Button onClick={() => navigate("/login")}>Login</Button>
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Register;
