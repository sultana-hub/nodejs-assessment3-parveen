// import {

//     Button,
//     Typography,
//     Box,
//     Avatar,
//     Card,
//     CardActions,
//     IconButton,
// } from '@mui/material';
// import { imagePath } from '../../src/api/axiosInstance';

// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import ThumbDownIcon from '@mui/icons-material/ThumbDown';
// import ChatIcon from '@mui/icons-material/Chat';
// import DeleteIcon from "@mui/icons-material/Delete";
// const getAvatar = (avatar) => {
//     if (!avatar) return '';
//     if (avatar.startsWith('uploads')) return imagePath(avatar);
//     return avatar.startsWith('//') ? `https:${avatar}` : avatar;
// };

// const PostCard = ({
//     author,
//     date,
//     content,
//     deletePost,
//     comments,
//     avatar,
//     onLike,
//     onUnlike,
//     postId,
//     isLiked,
//     likesCount,
//     unlikeCount
// }) => (
//     <Card sx={{ mb: 2, display: 'flex', gap: 2, p: 2 }}>
//         <Box>
//             <Avatar alt={author} src={getAvatar(avatar)} sx={{ width: 64, height: 64 }} />
//             <Typography variant="h6" mt={1}>{author}</Typography>
//         </Box>
//         <Box flex={1}>
//             <Typography variant="body1" sx={{ mb: 1 }}>{content}</Typography>
//             <Typography variant="caption" color="text.secondary">Posted on {date}</Typography>

//             <CardActions sx={{ pl: 0, mt: 1 }}>

//                 <IconButton color="primary" onClick={onUnlike}>
//                     <ThumbDownIcon />
//                     {unlikeCount > 0 && (
//                         <Typography variant="body2" color="textSecondary">
//                             {unlikeCount}
//                         </Typography>
//                     )}

//                 </IconButton>
//                 <IconButton color="primary" onClick={onLike}>
//                     <ThumbUpIcon />
//                     {likesCount > 0 && (
//                         <Typography variant="body2" color="textSecondary">
//                             {likesCount}
//                         </Typography>
//                     )}
//                 </IconButton>
//                 <Button variant="contained" size="small" startIcon={<ChatIcon />} href={`/post/${postId}/comment`}>
//                     Comments <Box component="span" ml={1} fontWeight="bold">{comments}</Box>
//                 </Button>

//                 <IconButton color="error" onClick={deletePost}><DeleteIcon /></IconButton>
//             </CardActions>
//         </Box>
//     </Card>
// );

// export default PostCard


import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    IconButton,
    Avatar,
    Tooltip,
    Button
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
import { imagePath } from '../../src/api/axiosInstance';
const getAvatar = (avatar) => {
    if (!avatar) return '';
    if (avatar.startsWith('uploads')) return imagePath(avatar);
    return avatar.startsWith('//') ? `https:${avatar}` : avatar;
};
const PostCard = ({
    avatar,
    author,
    date,
    content,
    comments = 0,
    likesCount = 0,
    unlikeCount = 0,
    isLiked = false,
    isOwner = false,
    postId,
    onLike,
    onUnlike,
    onEditClick,
    onDelete,
}) => {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent sx={{ position: 'relative' }}>
                {/* User Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar src={getAvatar(avatar)} sx={{ mr: 2 }} />
                    <Box>
                        <Typography variant="subtitle1">{author}</Typography>
                        <Typography variant="caption" color="text.secondary">{date}</Typography>
                    </Box>

                    {/* Edit/Delete Buttons (Only for Owner) */}
                    {isOwner && (
                        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit Post">
                                <IconButton color="primary" onClick={onEditClick}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Post">
                                <IconButton color="error" onClick={onDelete}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Box>

                {/* Post Content */}
                <Typography sx={{ mb: 2 }}>{content}</Typography>

                {/* Actions: Like, Unlike, Comments */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        color="error"
                        onClick={onLike}
                        disabled={isLiked}
                    >
                        <FavoriteIcon/>
                        {/* <FavoriteBorderIcon /> */}
                    </IconButton>

                    <IconButton
                        color="primary"
                        onClick={onUnlike}
                        disabled={!isLiked}
                    >
                        <HeartBrokenIcon />
                    </IconButton>

                    <Typography variant="body2">{likesCount} Likes</Typography>
                    <Typography variant="body2">{unlikeCount} unLikes</Typography>
                    <CommentIcon sx={{ ml: 2 }} />
                    <Button variant="contained" size="small" href={`/post/${postId}/comment`}>
                        Discussion <Box component="span" ml={1} fontWeight="bold">{comments}</Box>
                    </Button>
                </Box>

            </CardContent>
        </Card>
    );
};

export default PostCard;

