import React, { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  Container,
  Button,
  Typography,
  CircularProgress,
  InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import '../../style/style.css';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { userSignin } from '../../queryFunctions/auth/signin';
import Swal from 'sweetalert2'
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate, isLoading, isError } = useMutation({
    mutationFn: userSignin,
    mutationKey: ['signin'],
    onSuccess: (data) => {
      Swal.fire({
        title: "Welcome!",
        text: "You Login successfully",
        icon: "success"
      });

      sessionStorage.setItem('token', data?.token)
      sessionStorage.setItem('avatar', data?.user?.avatar)
      sessionStorage.setItem('name', data?.user?.name)
      sessionStorage.setItem("userId", data?.user?._id);
      console.log("login user payload", data)
      navigate(`/dashboard/${data?.user?._id}`);
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Either email or password is wrong!",

      });
    }
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();


  const onSubmit = (data) => {
    const payload = {
      email: data.email,
      password: data.password

    };
    mutate(payload)
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ p: 5, marginBottom: "140px",marginTop:"60px" }}>
        <Box
          sx={{
            mt: 5,
            pb: 5,
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "white",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom color="primary">
            Developer Login
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              name='email'
              variant="outlined"
              margin="normal"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors?.email?.message}
              autoComplete="new-email"
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 4, message: "Minimum 4 characters required" },
              })}
              error={!!errors.password}
              helperText={errors?.password?.message}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                mt: 2,
                borderRadius: "50px",
                bgcolor: "#185758ff",
                color: "white",
                "&:hover": { bgcolor: "rgba(61, 47, 118, 1)" },
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </form>
          <br />
          <Box sx={{ textAlign: "center" }}>
            <Typography>
              New user? Please
              <Link to="/register" style={{ textDecoration: "none" }}>
                <span> Signup</span>
              </Link>
            </Typography>
          </Box>
          {isError && <Typography color="error">Invalid Credentials</Typography>}
        </Box>
      </Container>
    </>
  );
};

export default Login;
