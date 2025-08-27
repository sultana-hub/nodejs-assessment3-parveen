

// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   CircularProgress,
// } from '@mui/material';
// import { Person } from '@mui/icons-material';
// import { useForm } from 'react-hook-form';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import PostCard from '../../components/PostCard';
// import {
//   createPost,
//   fetchPosts,
//   likePost,
//   unlikePost,
//   getPostById
// } from '../../queryFunctions/post/postQuery';
// import { deletePost } from '../../queryFunctions/post/postQuery';
// import EditIcon from '@mui/icons-material/Edit';
// import Modal from '@mui/material/Modal';
// import { useState } from 'react';
// import { getCurrentProfile } from '../../queryFunctions/profile/getCurrentProfile';
// const Posts = () => {

//   const { register, handleSubmit, reset } = useForm();
//   const queryClient = useQueryClient();

//   const { data: posts, isLoading } = useQuery({
//     queryKey: ['posts'],
//     queryFn: fetchPosts,
//   });

//   const mutation = useMutation({
//     mutationFn: createPost,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//       reset();
//     },
//   });

//   const onSubmit = (data) => mutation.mutate(data);

//   // --- Logged-in user ID (adjust according to your auth setup)
//   const loggedInUserId = sessionStorage.getItem('userId');

//   const likeMutation = useMutation({
//     mutationFn: likePost,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//     },
//   });

//   const unlikeMutation = useMutation({
//     mutationFn: unlikePost,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//     },
//   });

//   const handleLike = (postId) => {
//     console.log('Like called for:', postId);
//     likeMutation.mutate(postId);
//   };

//   const handleUnlike = (postId, likes = []) => {
//     const currentUserId = sessionStorage.getItem('userId');

//     if (!likes?.some(like => like === currentUserId || like.user === currentUserId)) {
//       alert('You cannot unlike a post you have not liked yet');
//       return;
//     }

//     unlikeMutation.mutate(postId);
//   };

//   const deleteMutation = useMutation({
//     mutationFn: deletePost,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//       navigate(0);
//     },
//   });

//   //edit logic goes here
// const [openEdit, setOpenEdit] = useState(false);

// const currentUserId = localStorage.getItem('userId'); // or use auth context
// console.log("current user id",currentUserId)
// // Fetch current user profile
// const { data: currentProfile } = useQuery({
//   queryKey: ['currentProfile'],
//   queryFn: getCurrentProfile,
// });

// console.log("current user data",currentProfile)
// // const [editedText, setEditedText] = useState(post?.text || '');
// // const isOwner = post?.user === currentUserId;


//   return (
//     <Box sx={{ maxWidth: '800px', mx: 'auto', p: 2 }}>
//       <Typography variant="h3" color="primary" gutterBottom>
//         Posts
//       </Typography>
//       <Typography variant="h6" gutterBottom>
//         <Person sx={{ mr: 1 }} />
//         Welcome to the community!
//       </Typography>

//       <Box
//         sx={{
//           bgcolor: 'primary.main',
//           color: 'white',
//           p: 2,
//           borderRadius: 1,
//           mb: 2,
//         }}
//       >
//         <Typography variant="h6">Say Something...</Typography>
//       </Box>

//       <Box
//         component="form"
//         noValidate
//         autoComplete="off"
//         onSubmit={handleSubmit(onSubmit)}
//         sx={{ mb: 4 }}
//       >
//         <TextField
//           {...register('text', { required: true })}
//           placeholder="Create a post"
//           multiline
//           rows={4}
//           fullWidth
//           required
//         />
//         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
//           {mutation.isLoading ? 'Submitting...' : 'Submit'}
//         </Button>
//       </Box>

//       {isLoading ? (
//         <CircularProgress />
//       ) : (
//         posts?.map((post) => {
//           const isLiked = post.likes.includes(loggedInUserId);
//           return (
//             <PostCard
//               key={post._id}
//               avatar={post?.user?.avatar}
//               author={post?.user?.name}
//               date={new Date(post.date).toLocaleDateString()}
//               content={post.text}
//               comments={post?.comments?.length}
//               onLike={() => handleLike(post._id)}
//               onUnlike={() => handleUnlike(post._id, post.likes)}
//               postId={post._id}
//               likesCount={post?.likes?.length}
//               unlikeCount={post?.unlikes?.length}
//               isLiked={isLiked}
//               deletePost={() => deleteMutation.mutate(post._id)}
//             />
//           );
//         })
//       )}
//     </Box>
//   );
// };

// export default Posts;



import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Paper
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PostCard from '../../components/PostCard';
import {
  createPost,
  fetchPosts,
  likePost,
  unlikePost,
  deletePost,
  updatePost,
} from '../../queryFunctions/post/postQuery';
import { useState } from 'react';
import { getCurrentProfile } from '../../queryFunctions/profile/getCurrentProfile';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
const Posts = () => {
  const navigate=useNavigate()
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editedText, setEditedText] = useState('');

  const loggedInUserId = sessionStorage.getItem('userId');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const { data: currentProfile } = useQuery({
    queryKey: ['currentProfile'],
    queryFn: getCurrentProfile,
  });

  const currentUserId = currentProfile?.user._id 
  console.log("current user id ", currentUserId)
  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setOpenEdit(false);
      window.location.reload();
    },
  });


  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
  const likeMutation = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });



  const unlikeMutation = useMutation({
    mutationFn: unlikePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries(['posts']);

      const previousPosts = queryClient.getQueryData(['posts']);

      queryClient.setQueryData(['posts'], old =>
        old.map(post =>
          post._id === postId
            ? {
              ...post,
              likes: post.likes.filter(
                like =>
                  like !== loggedInUserId &&
                  like?.user !== loggedInUserId
              ),
            }
            : post
        )
      );

      return { previousPosts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['posts'], context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });



  const onSubmit = (data) => mutation.mutate(data);


const handleLike = (postId) => {
  likeMutation.mutate(postId);
};


const handleUnlike = (postId) => {
  unlikeMutation.mutate(postId);
};



  const handleEditOpen = (post) => {
    setSelectedPost(post);
    setEditedText(post.text);
    setOpenEdit(true);
  };

  const handleEditSubmit = () => {
    if (selectedPost && editedText.trim()) {
      updateMutation.mutate({
        postId: selectedPost._id,
        updatedData: { text: editedText }
      });
    }
  };

 
console.log("Logged in user:", loggedInUserId);
  //  const isLiked = post.likes.includes(loggedInUserId);
  //    const isOwner = post?.user?._id?.toString() === currentUserId?.toString();

  if (!currentUserId || !posts?.length) {
    return (
      <Paper elevation={3} sx={{ mt: 5, p: 4, textAlign: 'center', borderRadius: 4 ,marginTop:"200px",marginBottom:"200px"}}>
      <PersonAddIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Please create your profile to visit this page
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        You must have a profile to access posts and community features.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(`/dashboard/${loggedInUserId}`)}
        sx={{ mt: 1 }}
      >
        Create Profile
      </Button>
    </Paper>
    )
  }

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', p: 2 }}>
      <Typography variant="h3" color="primary" gutterBottom>
        Posts
      </Typography>
      <Typography variant="h6" gutterBottom>
        <Person sx={{ mr: 1 }} /> Welcome to the community!
      </Typography>

      <Box bgcolor="primary.main" color="white" p={2} borderRadius={1} mb={2}>
        <Typography variant="h6">Say Something...</Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 4 }}>
        <TextField
          {...register('text', { required: true })}
          placeholder="Create a post"
          multiline
          rows={4}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          {mutation.isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>

      {isLoading ? (
        <CircularProgress />
      ) : (
        posts?.map((post) => {
          // const isLiked = post.likes?.some(
          //   (like) => like === currentUserId || like.user === currentUserId
          // );

          // const isLiked = post?.likes?.some(like => like?.user === loggedInUserId);
          const isLiked = Array.isArray(post.likes)
            ? post.likes.some(like => like.user === loggedInUserId)
            : false;

          const isUnliked = Array.isArray(post.unlikes)
            ? post.unlikes.some(unlike => unlike.user === loggedInUserId)
            : false;

          const isOwner = post?.user?._id?.toString() === currentUserId?.toString();

          return (
            <Box key={post._id} mb={2}>
              <PostCard
                avatar={post?.user?.avatar}
                author={post?.user?.name}
                date={new Date(post.date).toLocaleDateString()}
                content={post.text}
                comments={post?.comments?.length}
                likesCount={post?.likes?.length}
                unlikeCount={post?.unlikes?.length}
                isLiked={isLiked}
                isOwner={isOwner}
                onLike={() => handleLike(post._id, post.likes)}
                onUnlike={() => handleUnlike(post._id, post.likes)}
                postId={post._id}
                onDelete={() => deleteMutation.mutate(post._id)}
                onEditClick={() => handleEditOpen(post)}
              />
            </Box>
          );
        })

      )}

      {/* Edit Post Modal */}
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Paper sx={{ width: 500, mx: 'auto', mt: '10%', p: 3 }}>
          <Typography variant="h6" gutterBottom>Edit Your Post</Typography>
          <TextField
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </Paper>
      </Modal>
    </Box>
  );
};

export default Posts;
