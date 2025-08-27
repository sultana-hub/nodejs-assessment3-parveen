import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { otpVerification, resendOtp } from '../../queryFunctions/auth/otp';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Box,
} from '@mui/material';

const OtpVerification = () => {
    const navigate = useNavigate();
    const email = window.sessionStorage.getItem('email');

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors }
    } = useForm();

    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

    useEffect(() => {
        if (timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    const mutation = useMutation({
        mutationFn: otpVerification,
        mutationKey: ["otp"],
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'OTP verification successful.',
                timer: 2000,
                showConfirmButton: false,
            });
            reset();
            navigate("/login");
        },
        onError: () => {
            Swal.fire({
                icon: "error",
                title: "Verification Failed",
                text: "Invalid OTP or expired",
            });
        }
    });

    const resendMutation = useMutation({
        mutationFn: resendOtp,
        onSuccess: () => {
            setTimeLeft(15 * 60); // reset timer
            Swal.fire({
                icon: 'success',
                title: 'OTP Resent',
                text: 'A new OTP has been sent to your email.',
            });
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Unable to resend OTP. Try again later.',
            });
        }
    });

    const onSubmit = (formData) => {
        console.log("Submitting OTP:", formData);
        if (timeLeft <= 0) {
            Swal.fire({
                icon: "error",
                title: "OTP Expired",
                text: "Please click 'Resend OTP'.",
            });
            return;
        }
        mutation.mutate(formData);
    };

    const handleResend = () => {
        const email = getValues("email");
        if (!email) {
            Swal.fire({
                icon: "warning",
                title: "Email Required",
                text: "Please enter your email before resending OTP.",
            });
            return;
        }
        resendMutation.mutate({ email });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 10, mb: 6 }} >
            <Typography variant="h4" align="center" gutterBottom>
                OTP Verification
            </Typography>

            <Box mb={3}>
                <Alert severity={timeLeft > 0 ? "info" : "error"}>
                    {timeLeft > 0 ? (
                        <>OTP expires in: <strong>{formatTime(timeLeft)}</strong></>
                    ) : (
                        <>OTP has expired. Please request a new one.</>
                    )}
                </Alert>
            </Box>

            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 ,marginTop:"50px",marginBottom:"200px"}}
            >
                <TextField
                   label="Email"
                   fullWidth
                    
                    {...register('email', { required: 'Email is required' })}
                      error={!!errors.email}
                    helperText={errors.email?.message}
                />

                <TextField
                    label="OTP"
                    fullWidth
                    {...register('otp', { required: 'OTP is required' })}
                    error={!!errors.otp}
                    helperText={errors.otp?.message}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={mutation.isLoading || timeLeft <= 0}
                    startIcon={mutation.isLoading && <CircularProgress size={20} />}
                >
                    {mutation.isLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleResend}
                    disabled={resendMutation.isLoading || timeLeft > 0}
                >
                    {resendMutation.isLoading ? "Sending..." : "Resend OTP"}
                </Button>
            </Box>
        </Container>
    );
};

export default OtpVerification;
