// src/Router.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Import your pages/components
import Home from '../pages/Home';
import ProtectedRoute from './isAuth'
import Navbar from '../layouts/Navbar';
import Profiles from '../pages/profile/Profiles';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register'
import NotFound from '../pages/NotFound';
import Footer from '../layouts/Footer';
import SingleProfile from '../pages/profile/SingleProfile'
import Dashboard from '../pages/dashboard/Dashboard';
import EditProfile from '../pages/dashboard/EditProfile'
import CreateProfile from '../pages/dashboard/CreateProfile';
import AddEducation from '../pages/dashboard/AddEducation'
import AddExperience from '../pages/dashboard/AddExperience'
import CircularProgress from '@mui/material/CircularProgress';
import Posts from '../pages/post/Posts'
import Comment from '../pages/post/Comment'
import OtpVerification from '../pages/auth/OtpVerification'
const ErrorPage = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("../pages/ErrorPage"))

      , 2000);
  });
});

const Router = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={
        <>
          <h3> ...Loading </h3>
          <CircularProgress />;
        </>


      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profiles" element={<Profiles />} />
          {/* <Route path="/profiles/profile/:userId" element={<SingleProfile />} /> */}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
            <Route path="/otp" element={<OtpVerification />} />
          {/* protected route */}
          <Route element={<ProtectedRoute />}>
            {/* user dashboard */}
            <Route path="/dashboard/:userId" element={<Dashboard />} />
            <Route path="/create-profile/:userId" element={<CreateProfile />} />
            <Route path="/add-education/:userId" element={<AddEducation />} />
            <Route path="/add-experience/:userId" element={<AddExperience />} />
            <Route path="/edit-profile/:userId" element={<EditProfile />} />
            {/* user profile */}
            <Route path="/profiles/profile/:userId" element={<SingleProfile />} />
            {/* post and comment  */}
            <Route path="/posts" element={<Posts />} />
            <Route path="/post/:postId/comment" element={<Comment />} />

          </Route>
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;