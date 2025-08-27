import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 2,
        }}
      >
        <Typography variant="h2" fontWeight="bold" color="error" sx={{ mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, color: "gray" }}>
          Oops! Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "gray" }}>
          The page you are looking for might have been removed or is temporarily unavailable.
        </Typography>

        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, rgb(104, 106, 110) 0%, rgb(63, 57, 113) 100%)",
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: "30px",
            padding: "10px 20px",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #e66465 0%, #9198e5 100%)",
            },
          }}
          onClick={() => navigate("/")}
        >
          Go Back Home
        </Button>

        {/* Illustration (Optional) */}
        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="Not Found"
          style={{ maxWidth: "80%", height: "auto", marginBottom: "20px" }}
        />

       
      </Box>
    </Container>
  );
};

export default NotFound;