import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSingleProfile } from '../../queryFunctions/profile/singleProfile';
import {
    CircularProgress,
    Alert,
    Box,
} from '@mui/material';
import { imagePath } from '../../api/axiosInstance';
import { useParams } from 'react-router-dom';
import '../../style/style.css';
const SingleProfile = () => {
    const { userId } = useParams();

    const { data: profile, isPending, isError, error } = useQuery({
        queryKey: ['profile', userId],
        queryFn: () => getSingleProfile(userId),
    });

    const getAvatar = (avatar) => {
        if (!avatar) return '';
        if (avatar.startsWith('uploads')) return imagePath(avatar);
        return avatar.startsWith('//') ? `https:${avatar}` : avatar;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toISOString().split('T')[0]; // yyyy-mm-dd
    };

    if (isPending) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box mt={5}>
                <Alert severity="error">{error.message || 'Something went wrong'}</Alert>
            </Box>
        );
    }

    return (
        <section class="container">
            <a href="/profiles" class="btn btn-light">Back To Profiles</a>

            <div class="profile-grid my-1">
                {/* <!-- Top --> */}
                <div class="profile-top bg-primary p-2">
                    <img
                        class="round-img my-1"
                        src={getAvatar(profile?.user?.avatar)}
                        alt={profile?.user?.name}
                    //  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <h1 class="large">{profile?.user?.name}</h1>
                    <p class="lead"> {profile?.status} at {profile?.company}</p>
                    <p>{profile?.user?.city}</p>

                    <div class="icons my-1">

                        {
                            profile?.website ? (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer">
                                    <i class="fas fa-globe fa-2x"></i>
                                </a>
                            ) : (
                                <a href="https://www.webskitters.com/" target="_blank" rel="noopener noreferrer">

                                </a>
                            )
                        }


                        {
                            profile?.social?.twitter ? (
                                <a href="https://x.com/home?lang=en-gb" target="_blank" rel="noopener noreferrer">
                                    <i class="fab fa-twitter fa-2x"></i>
                                </a>
                            ) : (
                                <>
                                    <a href="https://x.com/home?lang=en-gb" target="_blank" rel="noopener noreferrer">
                                        <i class="fab fa-twitter fa-2x"></i>
                                    </a>
                                </>
                            )
                        }

                        {
                            profile?.social?.facebook ? (
                                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                                    <i class="fab fa-facebook fa-2x"></i>
                                </a>
                            ) : (
                                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                                    <i class="fab fa-facebook fa-2x"></i>
                                </a>
                            )
                        }
                        {
                            profile?.social?.linkedin ? (
                                <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">
                                    <i class="fab fa-linkedin fa-2x"></i>
                                </a>
                            ):(
                                  <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-linkedin fa-2x"></i>
                        </a>
                            )
                       }


                        <a href="#" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-youtube fa-2x"></i>
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-instagram fa-2x"></i>
                        </a>
                    </div>
                </div>

                {/* <!-- About --> */}
                <div class="profile-about bg-light p-2">
                    <h2 class="text-primary">{profile?.user?.name}'s Bio</h2>
                    <p>
                        {profile?.bio}
                    </p>
                    <div class="line"></div>
                    <h2 class="text-primary">Skill Set</h2>

                    <div className="skills">
                        {profile?.skills?.map((skill, index) => (
                            <div className="p-1" key={index}>
                                <i className="fa fa-check"></i> {skill}
                            </div>
                        ))}
                    </div>
                </div>

                {/* <!-- Experience --> */}
                <div class="profile-exp bg-white p-2">
                    <h2 className="text-primary">Experience</h2>

                    {profile?.experience?.map((exp, index) => (
                        <div key={index}>
                            <h3 className="text-dark">{exp.company}</h3>
                            <p>
                                {new Date(exp.from).toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                })}{" "}
                                -{" "}
                                {exp.current
                                    ? "Current"
                                    : new Date(exp.to).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                    })}
                            </p>
                            <p>
                                <strong>Position: </strong>
                                {exp.title}
                            </p>
                            <p>
                                <strong>Description: </strong>
                                {exp.description}
                            </p>
                        </div>
                    ))}

                </div>
                {/* 
        <!-- Education --> */}
                <div className="profile-edu bg-white p-2">
                    <h2 className="text-primary">Education</h2>

                    {profile?.education?.map((edu, index) => (
                        <div key={index}>
                            <h3>{edu.school}</h3>
                            <p>
                                {new Date(edu.from).toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                })}{" "}
                                -{" "}
                                {edu.current
                                    ? "Current"
                                    : new Date(edu.to).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                    })}
                            </p>
                            <p>
                                <strong>Degree: </strong> {edu.degree}
                            </p>
                            <p>
                                <strong>Field Of Study: </strong> {edu.fieldofstudy}
                            </p>
                            <p>
                                <strong>Description: </strong> {edu.description}
                            </p>
                        </div>
                    ))}
                </div>


                {/* <!-- Github --> */}
                <div class="profile-github">
                    <h2 class="text-primary my-1">
                        <i class="fab fa-github"></i> Github Repos
                    </h2>
                    <div class="repo bg-white p-1 my-1">
                        <div>
                            <h4><a href="#" target="_blank"
                                rel="noopener noreferrer">Repo One</a></h4>
                            <p>
                                https://github.com/sultana-hub/sultana-calender
                            </p>
                        </div>
                        <div>
                            <ul>
                                <li class="badge badge-primary">Stars: 3</li>
                                <li class="badge badge-dark">Watchers: 21</li>
                                <li class="badge badge-light">Forks: 5</li>
                            </ul>
                        </div>
                    </div>
                    <div class="repo bg-white p-1 my-1">
                        <div>
                            <h4><a href="#" target="_blank"
                                rel="noopener noreferrer">Repo Two</a></h4>
                            <p>
                                https://github.com/sultana-hub/auth_ejs
                            </p>
                        </div>
                        <div>
                            <ul>
                                <li class="badge badge-primary">Stars: 2</li>
                                <li class="badge badge-dark">Watchers: 21</li>
                                <li class="badge badge-light">Forks: 2</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
};

export default SingleProfile;




