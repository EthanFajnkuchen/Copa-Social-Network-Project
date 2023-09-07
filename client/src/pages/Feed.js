import React, { useContext, useEffect, useState } from 'react';
import { UidContext } from "../components/Log/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Avatar, Grid, Paper, Typography, Card, CardContent, Box, Button, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import image from "../images/profil-pic-default.png";
import moment from "moment";
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import NavbarAfter from '../components/Auth/NavbarAfter';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ReplyIcon from '@mui/icons-material/Reply';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const fetchUserByUsernameId = async (usernameId) => {
  try {
      const response = await axios.get(`http://localhost:5000/api/user/${usernameId}`);
      return response.data.user;
  } catch (error) {
      console.error(error);
      return null;
  }
};

const Feed = () => {
  const uid = useContext(UidContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [feedPosts, setFeedPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const [newCommentContent, setNewCommentContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [feature1, setFeature1] = useState(true);






  useEffect(() => {
      axios.get(`http://localhost:5000/api/user/${uid}`)
          .then(response => {
              setUser(response.data.user);
              if (response.data.user.feature1 === false) {
                setFeature1(false);
            }
              return axios.get(`http://localhost:5000/api/post/feed/${uid}`);
          })
          .then(response => {
              const sortedPosts = response.data.combinedFeed.sort((a, b) => {
                  return new Date(b.time_of_creation) - new Date(a.time_of_creation);
              });
              setFeedPosts(sortedPosts);
          })
          .catch(error => {
              console.error(error);
          });
  }, [uid, navigate]);


  // Handle like toggle
  const handleLikeToggle = async (postId) => {
    try {
      const response = await axios.patch('http://localhost:5000/api/post/handlelikepost', {
        post_id: postId,
        username_id: uid, // Assuming uid is the current user's ID
      }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      });
      console.log(response);

      if (response.status === 200) {
        // Update the userPosts state with the updated post
        const updatedUserPosts = feedPosts.map(post => {
          if (post.post_id === postId) {
            return {
              ...post,
              likes: response.data.post.likes,
            };
          }
          return post;
        });

        setFeedPosts(updatedUserPosts);
      }
    } catch (error) {
        console.log(error);
      // Handle error, show a notification, or any other appropriate action
    }
};

const handleCommentsToggle = async (postId) => {
  if (expandedComments[postId]) {
    // If comments are already expanded, collapse them
    setExpandedComments((prevExpandedComments) => ({
      ...prevExpandedComments,
      [postId]: false,
    }));
  } else {
    // Fetch comments and expand
    try {
      const response = await axios.get(`http://localhost:5000/api/post/${postId}/comments`);
      const updatedExpandedComments = {
        ...expandedComments,
        [postId]: true,
      };
      setExpandedComments(updatedExpandedComments);
      // Update or store comments data as needed
    } catch (error) {
      console.log(error);
      // Handle error
    }
  }
};

const handleCommentLikeToggle = async (postId, commentId) => {
  try {
    const response = await axios.patch('http://localhost:5000/api/post/handlelikecomment', {
      post_id: postId,
      username_id: uid,
      comment_id: commentId,
    }, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
    
    if (response.status === 200) {
      const updatedFeedPosts = feedPosts.map(post => {
        if (post.post_id === postId) {
          const updatedComments = post.comments.map(comment => {
            if (comment.comment_id === commentId) {
              return {
                ...comment,
                likes: response.data.comment.likes,
              };
            }
            return comment;
          });
          
          return {
            ...post,
            comments: updatedComments,
          };
        }
        return post;
      });

      setFeedPosts(updatedFeedPosts);
    }
  } catch (error) {
    console.log(error);
    // Handle error, show a notification, or any other appropriate action
  }
};

const handlePostComment = async (postId, commentContent) => {
  try {
    const response = await axios.post('http://localhost:5000/api/post/createcomment', {
      post_id: postId,
      username_id: uid,
      description: commentContent,
    });

    if (response.status === 200) {
      // Find the index of the post in feedPosts
      const postIndex = feedPosts.findIndex(post => post.post_id === postId);

      if (postIndex !== -1) {
        // Update the comments of the specific post
        const updatedPost = {
          ...feedPosts[postIndex],
          comments: [...feedPosts[postIndex].comments, response.data.comment],
        };

        // Update the feedPosts state with the updated post
        const updatedFeedPosts = [...feedPosts];
        updatedFeedPosts[postIndex] = updatedPost;

        setFeedPosts(updatedFeedPosts);
        setNewCommentContent(''); // Clear the comment input field
      }
    }
  } catch (error) {
    console.log(error);
    // Handle error, show a notification, or any other appropriate action
  }
};

const handleDeletePost = (postId) => {
  axios({
    method: 'delete',
    url: 'http://localhost:5000/api/post/deletepost',
    data: {
      post_id: postId,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  })
  .then(response => {
    console.log(response.data);
    // Remove the deleted post from the userPosts state
    const updatedPosts = feedPosts.filter(post => post.post_id !== postId);
    setFeedPosts(updatedPosts);
  })
  .catch(error => {
    console.error("Error deleting post:", error);
  });
};

const handleDeleteComment = async (postId, commentId) => {
  try {
    const response = await axios.delete('http://localhost:5000/api/post/deletecomment', {
      data: {
        post_id: postId,
        comment_id: commentId,
      }
    });

    if (response.status === 200) {
      // Find the index of the post in feedPosts
      const postIndex = feedPosts.findIndex(post => post.post_id === postId);

      if (postIndex !== -1) {
        // Filter out the deleted comment from the specific post's comments
        const updatedPost = {
          ...feedPosts[postIndex],
          comments: feedPosts[postIndex].comments.filter(comment => comment.comment_id !== commentId),
        };

        // Update the feedPosts state with the updated post
        const updatedFeedPosts = [...feedPosts];
        updatedFeedPosts[postIndex] = updatedPost;

        setFeedPosts(updatedFeedPosts);
      }
    }
  } catch (error) {
    console.log(error);
    // Handle error, show a notification, or any other appropriate action
  }
};

const handleImageUpload = (file) => {
  if (file) {
    setSelectedImage(file); // Set the selected image as the Blob object
  }
};

const convertImageToBase64 = (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const handlePostCreation = async () => {
  try {
    // Convert the selected image to base64
    const imageBase64 = selectedImage ? await convertImageToBase64(selectedImage) : '';
    if (newPostContent === "" && !(selectedImage)) {
      return null;
    }

    // Send the post creation request
    const response = await axios.post('http://localhost:5000/api/post/createpost', {
      username_id: uid, // Assuming uid is the current user's ID
      description: newPostContent,
      images: imageBase64,
    }, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });

    if (response.status === 200) {
      console.log("Reussi");
      // Clear the selected image state
      setSelectedImage(null);
      // Clear the post content input
      setNewPostContent('');
      // Update the feed with the new post
      setFeedPosts([response.data.post, ...feedPosts]);
      // ... You might also want to show a success notification ...
    }
  } catch (error) {
    console.log(error);
    // ... Handle error, show a notification, or any other appropriate action ...
  }
};



  if (uid === "6acba3b3-b13c-49b7-b7b1-ac7174267c80") {
      navigate('/admin');
      return null;
  }

return (
  <div style={{ backgroundColor: "#F7F8FA" }}>
    <NavbarAfter />
    <Container style={{ marginTop: '15px', boxShadow: 'none' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8} style={{ marginTop: '3rem', boxShadow: 'none' }}>
          <Paper elevation={0}>
            {/* Post creation form */}
            <Card style={{ marginBottom: '20px', boxShadow: 'none', padding: '20px' }}>
                <Typography variant="h6" style={{ fontFamily: "Roboto", color: "#1C1C1C", fontSize: "18px", fontWeight: "500", letterSpacing: "-0.2px", marginBottom: '20px' }}>Hi {user.pseudo} 👋 ,</Typography>
                {/* Text field for entering post content */}
                <TextField
                  variant="outlined"
                  label="Say hi to your friends :)"
                  multiline
                  rows={3}
                  fullWidth
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  style={{ marginBottom: '15px' }}
                />
                {selectedImage && <div><img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ maxWidth: '100%', marginBottom: '15px' }} /><br /></div>}

                <input
                  type="file"
                  accept="image/*"
                  id="image-input"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                />
                <label htmlFor="image-input">
                  <IconButton
                    variant="outlined"
                    style={{ color: '#969696' }}
                    aria-label="upload image"
                    component="span"
                  >
                    <AddPhotoAlternateIcon />
                  </IconButton>
                </label>
                        <br />
                <Button onClick={() => handlePostCreation()} variant="contained" color="primary" style={{textTransform:"capitalize", marginTop:"15px"}}> Post</Button>
              </Card>
              <hr style={{ height: '30px', backgroundColor: '#F7F8FA', border: 'none', width: "" }} />


            {/* Existing feed posts */}
            <Typography variant="h5" align="left" style={{ fontFamily: "Roboto", color: "#1C1C1C", fontSize: "20px", fontWeight: "500", letterSpacing: "-0.2px", padding: '0 0 0 30px' }}>Feed</Typography>
            <hr style={{ width: "100%" }} />
            {feedPosts.map((post, index) => (
              <Card key={index} elevation={0} style={{ marginBottom: '20px', boxShadow: 'none' }}>
                <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {post.username_id && (
                        <FutureUserAvatar usernameId={post.username_id} />
                      )}
                      <div>
                        {post.username_id && (
                          <FutureUserPseudo usernameId={post.username_id} />
                        )}
                        <Typography variant="caption" style={{ color: "#969696", marginTop: '3px' }}>
                          {moment(post.time_of_creation).fromNow()}
                        </Typography>
                      </div>
                    </div>
                    {feature1 && post.username_id === uid && (
                    <IconButton onClick={() => handleDeletePost(post.post_id)} style={{ color: "#969696", outline: "none"}}>
                      <DeleteIcon />
                    </IconButton>)}
                  </div>
                  <Typography variant="body1" style={{ marginTop: '20px', color: "#585757", fontSize: "14px", fontFamily: "Roboto", marginLeft: "32px" }}>
                    {post.description}
                  </Typography>
                  {post.images && <img src={post.images} alt="Post" style={{marginTop: '15px',marginBottom: '15px' }} />}

                  <div style={{ marginTop: '20px' }}>
                    <IconButton onClick={() => handleLikeToggle(post.post_id)} style={post.likes.includes(user.id) ? { color: red[500], marginLeft: "23px", outline: "none" } : { marginLeft: "23px", outline: "none" }} aria-label="like post">
                      <EmojiEventsIcon />
                    </IconButton>
                    <Typography style={{color: "#969696"}} variant="caption">{post.likes.length} likes</Typography>
                    <IconButton   onClick={() => handleCommentsToggle(post.post_id)} style={{ color: "#969696", marginLeft: "20px", outline: "none" }} aria-label="like post">
                      <QuestionAnswerIcon />
                    </IconButton>
                    <Typography style={{color: "#969696"}} variant="caption">{post.comments.length} comments</Typography>
                  </div>
                    {expandedComments[post.post_id] && (
                      <div>
                      <hr />
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: "20px" }}>
                        <FutureUserAvatar usernameId={uid} />
                        <TextField
                          variant="outlined"
                          placeholder="Write a comment..."
                          fullWidth
                          value={newCommentContent}
                          onChange={(e) => setNewCommentContent(e.target.value)}
                          style={{ marginLeft: '10px' }}
                        />
                        <IconButton
                          variant="outlined"
                          style={{ color: "#969696" }}
                          aria-label="post comment"
                        >
                          <PhotoCameraIcon />
                        </IconButton>
                      <Button onClick={() => handlePostComment(post.post_id, newCommentContent)} variant="contained" color="primary" style={{textTransform: "capitalize"}}>Post</Button>
                          </div>
                    <div style={{marginTop: "20px"}}>
                      {post.comments.map((comment, index) => (
                        <Card key={index} elevation={0} style={{ marginBottom: '10px', boxShadow: 'none' }}>
                          <CardContent>
                        
                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton style={{ color: "#2E7CD9",  outline: "none", pointerEvents: "none"}} aria-label="reply to comment">
                              <ReplyIcon />
                            </IconButton>
                      {post.username_id && (
                        <FutureUserAvatar usernameId={comment.username_id} />
                      )}
                      <div>
                        {post.username_id && (
                          <FutureUserPseudo usernameId={comment.username_id} />
                        )}
                        <Typography variant="caption" style={{ color: "#969696", marginTop: '3px' }}>
                          {moment(comment.time_of_creation).fromNow()}
                        </Typography>
                      </div>
                    </div>
                    {feature1 && comment.username_id === uid && (
                    <IconButton onClick={() => handleDeleteComment(post.post_id, comment.comment_id)} style={{ color: "#969696", outline: "none"}}>
                      <DeleteIcon />
                    </IconButton>)}
                  </div>
                  <Typography variant="body1" style={{ marginTop: '20px', color: "#585757", fontSize: "14px", fontFamily: "Roboto", marginLeft: "80px" }}>
                    {comment.description}
                  </Typography>
                  <div style={{ marginTop: '20px' }}>
                    <IconButton onClick={() => handleCommentLikeToggle(post.post_id, comment.comment_id)} style={comment.likes.includes(user.id) ? { color: red[500], marginLeft: "70px", outline: "none" } : { marginLeft: "70px", outline: "none" }} aria-label="like post">
                      <EmojiEventsIcon />
                    </IconButton>
                    <Typography style={{color: "#969696"}} variant="caption">{comment.likes.length} likes</Typography>
                  </div>
                  
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    </div>
                  )}
                </CardContent>
                <hr style={{ height: '30px', backgroundColor: '#F7F8FA', border: 'none', width: "" }} />
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  </div>
);
                        }

const FutureUserAvatar = ({ usernameId }) => {
  const [user, setUser] = useState({});
  
  useEffect(() => {
      fetchUserByUsernameId(usernameId).then(result => {
          setUser(result);
      });
  }, [usernameId]);

  return (
      <Avatar
          src={user.avatar || image}
          style={{ width: '48px', height: '48px', marginRight: '10px', marginLeft: "32px" }}
      />
  );
};

const FutureUserPseudo = ({ usernameId }) => {
  const [user, setUser] = useState({});
  
  useEffect(() => {
      fetchUserByUsernameId(usernameId).then(result => {
          setUser(result);
      });
  }, [usernameId]);

  return (
      <Typography variant="h6">{user.pseudo}</Typography>
  );
};

export default Feed;