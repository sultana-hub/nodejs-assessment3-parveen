const PostModel = require('../model/post')
const { UserModel } = require('../model/Users')
const ProfileModel = require('../model/Profile')
const httpStatusCode = require('../helper/httpStatusCode')
const postValidation = require('../helper/validations/post')


class PostController {

    //create post

    async createPost(req, res) {

        try {
            const { error, value } = postValidation.validate({
                text: req.body.text
            })
            if (error) {
                return res.status(httpStatusCode.BadRequest).json({
                    message: error.details[0].message
                })
            }
            const user = await UserModel.findById(req.user._id).select('-password')
            const postData = {
                text: value.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user._id
            }
            // let post = await PostModel.findOne({ user: req.user._id })
            const post = new PostModel(postData)
            await post.save()
            return res.status(httpStatusCode.Create).json({
                message: "Post created successfully by user"
            })
        } catch (error) {
            console.error(error.message)
            return res.status(httpStatusCode.InternalServerError).json({
                message: error.message
            })
        }

    }


    //get post by id
    async getPostById(req, res) {
        try {
            const id = req.params.id;
            const post = await PostModel.findById(id);

            if (!post) {
                return res.status(httpStatusCode.NotFound).json({
                    message: "post not exist"
                });
            }

            return res.json(post);

        } catch (error) {
            console.log(error.message);

            if (error.kind === 'ObjectId') {
                return res.status(httpStatusCode.NotFound).json({
                    message: "post not exist"
                });
            }

            return res.status(httpStatusCode.InternalServerError).json({
                message: "Something went wrong"
            });
        }
    }


    //get all posts
    async getAllPost(req, res) {
        try {
            const posts = await PostModel.find()
                .populate('user', ['name', 'avatar']) // Populate only name and avatar fields from User
                .sort({ createdAt: -1 }); // Optional: newest posts first

            if (!posts || posts.length === 0) {
                return res.status(httpStatusCode.NotFound).json({
                    message: "No posts found",
                });
            }

            return res.status(200).json(posts);
        } catch (error) {
            console.error("Error fetching posts:", error.message);
            return res.status(httpStatusCode.InternalServerError).json({
                message: "Something went wrong",
            });
        }
    }
    async deletePost(req, res) {
        try {
            const post = await PostModel.findById(req.params.id);

            if (!post) {

                return res.status(httpStatusCode.BadRequest).json({
                    message: "Post does not exist"
                })
            }
            if (post.user.toString() !== req.user._id.toString()) {
                return res.status(httpStatusCode.Unauthorized).json({
                    message: "Unauthorized Action"
                })
            }

            await post.deleteOne();
            return res.status(httpStatusCode.Ok).json({
                message: "Post deleted successfully"
            })

        } catch (error) {
            console.error("Delete Post Error:", error.message);
            if (error.kind === 'ObjectId') {
                return res.status(httpStatusCode.NotFound).json({
                    message: "post not exist"
                })
            }

            return res.status(httpStatusCode.InternalServerError).json({
                message: "Server Error: " + error.message,
            });
        }
    }

    // new like
    async likePost(req, res) {
        try {
            const post = await PostModel.findById(req.params.id);

            // Remove from unlikes if user had unliked before
            post.unlikes = post.unlikes.filter(unlike => unlike.user.toString() !== req.user._id);

            if (post.likes.some(like => like.user.toString() === req.user._id)) {
                return res.status(400).json({ message: 'Post already liked by this user' });
            }
            post.likes = post.likes.filter(like => like?.user);
            post.likes.unshift({ user: req.user._id });

            await post.save();

            res.json(post);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
    //new unlike 

   async unlikePost(req, res) {
  try {
    console.log("🔁 Unlike request received");
    console.log("Post ID:", req.params.id);
    console.log("User ID:", req.user._id);

    const post = await PostModel.findById(req.params.id);
    if (!post) {
      console.log("🚫 Post not found");
      return res.status(404).json({ message: 'Post not found' });
    }

    // Cleanup: remove broken entries
    post.likes = post.likes.filter(like => like?.user);
    post.unlikes = post.unlikes.filter(unlike => unlike?.user);

    // ✅ Safe check if user already liked
    const likedIndex = post.likes.findIndex(
      (like) => like?.user?.toString() === req.user._id
    );
    console.log("Liked Index:", likedIndex);

    if (likedIndex === -1) {
      console.log("❌ Post not liked yet by this user");
      return res.status(400).json({ message: 'You have not liked this post' });
    }

    // ❌ Remove from likes
    post.likes.splice(likedIndex, 1);
    console.log("✅ Removed from likes");

    // ✅ Check if already unliked
    const alreadyUnliked = post.unlikes.some(
      (unlike) => unlike?.user?.toString() === req.user._id
    );

    if (!alreadyUnliked) {
      post.unlikes.push({ user: req.user._id});
      console.log("👍 Added to unlikes");
    }

    await post.save();
    console.log("📦 Post updated successfully");
    return res.json({ message: 'Post unliked successfully', post });

  } catch (error) {
    console.error("🔥 Server error in unlikePost:", error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}


    //create comments
    async createComment(req, res) {
        try {
            const { text } = req.body;
            const { error, value } = postValidation.validate({ text });

            if (error) {
                return res.status(httpStatusCode.BadRequest).json({
                    message: error.details[0].message
                });
            }

            const user = await UserModel.findById(req.user._id).select('-password');
            const post = await PostModel.findById(req.params.postId);

            if (!post) {
                return res.status(httpStatusCode.NotFound).json({
                    message: "Post not found"
                });
            }

            const newComment = {
                text: value.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user._id
            };

            post.comments.unshift(newComment);
            await post.save();

            return res.status(httpStatusCode.Create).json({
                message: "Comment created successfully by user"
            });

        } catch (error) {
            console.error(error.message);
            return res.status(httpStatusCode.InternalServerError).json({
                message: error.message
            });
        }
    }



    async getComments(req, res) {
        try {
            const post = await PostModel.findById(req.params.postId);

            if (!post) {
                return res.status(httpStatusCode.NotFound).json({
                    message: "Post not found"
                });
            }

            return res.status(httpStatusCode.Ok).json({
                comments: post.comments
            });
        } catch (error) {
            console.error(error.message);
            return res.status(httpStatusCode.InternalServerError).json({
                message: "Something went wrong"
            });
        }
    }




 async editComment (req, res)  {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Ensure the logged-in user is the comment owner
    if (comment.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "You are not authorized to edit this comment" });
    }

    comment.text = text;
    await post.save();

    res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });

  } catch (error) {
    console.error("Error editing comment:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





    async updatePost(req, res) {

        try {
            const { text } = req.body;
            const postId = req.params.postId;

            if (!text || text.trim() === "") {
                return res.status(httpStatusCode.BadRequest).json({
                    message: "Post text cannot be empty.",
                });
            }

            const post = await PostModel.findById(postId);

            if (!post) {
                return res.status(httpStatusCode.NotFound).json({
                    message: "Post not found.",
                });
            }

            // Check if the current user is the owner of the post
            if (post.user.toString() !== req.user._id.toString()) {
                return res.status(httpStatusCode.Forbidden).json({
                    message: "You are not authorized to edit this post.",
                });
            }

            // Update the post text
            post.text = text;
            await post.save();

            return res.status(httpStatusCode.Ok).json({
                message: "Post updated successfully.",
                post,
            });

        } catch (error) {
            console.error("Update Post Error:", error.message);
            return res.status(httpStatusCode.InternalServerError).json({
                message: "Something went wrong. Try again later.",
            });
        }
    };


    async deleteComment(req, res) {
        try {
            const { postId, comment_id } = req.params;

            // Find the post by ID
            const post = await PostModel.findById(postId);

            if (!post) {
                return res.status(httpStatusCode.NotFound).json({
                    message: "Post not found"
                });
            }

            // Find the comment inside the post
            const comment = post.comments.find(
                (comment) => comment._id.toString() === comment_id
            );

            if (!comment) {
                return res.status(httpStatusCode.NotFound).json({
                    message: "Comment does not exist"
                });
            }

            // Check if the user deleting the comment is the comment's owner
            if (comment.user.toString() !== req.user._id.toString()) {
                return res.status(httpStatusCode.Forbidden).json({
                    message: "User not authorized"
                });
            }

            // Remove the comment
            post.comments = post.comments.filter(
                (comment) => comment._id.toString() !== comment_id
            );

            await post.save();

            return res.json({ message: "Comment deleted successfully" });

        } catch (error) {
            console.error("Delete comment error:", error.message);
            return res.status(httpStatusCode.InternalServerError).json({
                message: error.message
            });
        }
    }


}

module.exports = new PostController
