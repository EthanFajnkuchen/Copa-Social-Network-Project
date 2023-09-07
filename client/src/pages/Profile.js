import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UidContext } from '../components/Log/AppContext';
import { Avatar, Grid, Paper, Typography, Card, CardContent, Box, Button, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import image from "../images/profil-pic-default.png";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import NavbarAfter from '../components/Auth/NavbarAfter';
import moment from 'moment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';





const Profile = () => {
    const uid = useContext(UidContext);
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProfilePictureDialog, setShowProfilePictureDialog] = useState(false);
    const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
    const [followingDialogOpen, setFollowingDialogOpen] = useState(false);
    const [followersList, setFollowersList] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [previousAvatar, setPreviousAvatar] = useState("");
    const [feature1, setFeature1] = useState(true);
    const [feature2, setFeature2] = useState(true);



    

    useEffect(() => {
        axios.get(`http://localhost:5000/api/user/${uid}`)
            .then(response => {
                setUser(response.data.user);
                if (response.data.user.feature1 === false) {
                    setFeature1(false);
                }

                if (response.data.user.feature2 === false) {
                    setFeature2(false);
                }
                return axios.get(`http://localhost:5000/api/postbyid/${uid}`);
            })
            .then(response => {
                const sortedPosts = response.data.userPosts.sort((a, b) => {
                    return new Date(b.time_of_creation) - new Date(a.time_of_creation);
                });
                setUserPosts(sortedPosts);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
            });
    }, [uid, navigate]);

    if (loading) {
        if (!uid) {
            navigate('/signup');
        }
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', alignItems: 'center'}}>
              <CircularProgress />
            </Box>
          );    
    }

    if (!uid) {
        setLoading(false);
        navigate('/signup');
        return;
    }

    if (uid === "6acba3b3-b13c-49b7-b7b1-ac7174267c80") {
        navigate('/admin');
        return;
    }


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
          const updatedPosts = userPosts.filter(post => post.post_id !== postId);
          setUserPosts(updatedPosts);
        })
        .catch(error => {
          console.error("Error deleting post:", error);
        });
    };

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
            const updatedUserPosts = userPosts.map(post => {
              if (post.post_id === postId) {
                return {
                  ...post,
                  likes: response.data.post.likes,
                };
              }
              return post;
            });
    
            setUserPosts(updatedUserPosts);
          }
        } catch (error) {
            console.log(error);
          // Handle error, show a notification, or any other appropriate action
        }
    };

    const handleOpenProfilePictureDialog = () => {
        setShowProfilePictureDialog(true);
    };

    const handleCloseProfilePictureDialogCancel = () => {
        setUser({ ...user, avatar: previousAvatar });
        setShowProfilePictureDialog(false);
        
    };

    const handleCloseProfilePictureDialog = () => {
        setShowProfilePictureDialog(false);
        
    };

    const handleProfilePictureChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.size <= 10485760) { // 10 MB in bytes
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Image = e.target.result;
                setUser({ ...user, avatar: base64Image });
            };
            reader.readAsDataURL(selectedFile);
        } else {
            alert("File is too large (max 10MB).");
        }
    };
    
    const handleSaveProfilePicture = async () => {
        try {
            const base64Avatar = user.avatar; // Get the base64 representation of the image
            console.log(user.avatar);
            
            // Send Axios PATCH request to update user's avatar
            const response = await axios.patch(`http://localhost:5000/api/user/avatar/${uid}`, {
                avatar: base64Avatar
            }, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
              });
            
            if (response.status === 200) {
                // Update the user state with the new avatar URL
                setUser({ ...user, avatar: base64Avatar });
                handleCloseProfilePictureDialog();
            } else {
                console.error("Failed to update user's avatar.");
            }
        } catch (error) {
            console.error("Error updating user's avatar:", error);
        }
    };

    const handleRemoveProfilePicture = async () => {
        try {
            // Send Axios PATCH request to update user's avatar to an empty string
            const response = await axios.patch(`http://localhost:5000/api/user/avatar/${uid}`, {
                avatar: ""
            }, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            });
            
            if (response.status === 200) {
                // Update the user state with an empty avatar
                setUser({ ...user, avatar: "" });
                handleCloseProfilePictureDialog();
            } else {
                console.error("Failed to remove user's avatar.");
            }
        } catch (error) {
            console.error("Error removing user's avatar:", error);
        }
    };

    const handleOpenFollowersDialog = () => {
        setFollowersDialogOpen(true);
        // Fetch followers list using API call
        axios.get(`http://localhost:5000/api/user/${uid}/followers`)
            .then(response => {
                setFollowersList(response.data.followers);
            })
            .catch(error => {
                console.error(error);
            });
    };
    
    const handleOpenFollowingDialog = () => {
        setFollowingDialogOpen(true);
        // Fetch following list using API call
        axios.get(`http://localhost:5000/api/user/${uid}/following`)
            .then(response => {
                setFollowingList(response.data.following);
            })
            .catch(error => {
                console.error(error);
            });
    };
    
    const handleCloseDialogs = () => {
        setFollowersDialogOpen(false);
        setFollowingDialogOpen(false);
    };

    const handleUnfollowUser = async (userId) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/unfollow/${uid}/${userId}`);
            
            if (response.status === 200) {
                // Update the followingList state to remove the unfollowed user
                setFollowingList(prevFollowingList => prevFollowingList.filter(user => user.id !== userId));
                
                // Update the user's following count in the user state
                setUser(prevUser => ({
                    ...prevUser,
                    following: prevUser.following.filter(id => id !== userId),
                }));
            }
        } catch (error) {
            console.error("Error unfollowing user:", error);
        }
    };
    

    
    

    return (
        <div style= {{backgroundColor: "#F7F8FA"}}>
            <NavbarAfter />
            <div style={{boxShadow: 'none'}}>
            <Container style={{ marginTop: '15px', boxShadow: 'none'}}>
            <Grid container spacing={3}>
                    <Grid item xs={12} sm={8} style={{ marginTop: '3rem', boxShadow: 'none'}}>
                    <Paper elevation={0}>
                        <Typography variant="h5" align="left" style={{fontFamily: "Roboto", color: "#1C1C1C", fontSize: "20px", fontWeight: "500", letterSpacing: "-0.2px", padding: '35px 0 0 30px'}}>My Feed</Typography>
                        <hr style={{ width: "100%" }} />
                        {userPosts.map((post, index) => (
                        <Card key={index} elevation={0} style={{ marginBottom: '20px', boxShadow: 'none'}}>
                            <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                            src={user.avatar || image}
                                            style={{ width: '48px', height: '48px', marginRight: '10px', marginLeft: "32px" }}
                                        />
                                    <div>
                                        <Typography variant="h6">{user.pseudo}</Typography>
                                        <Typography variant="caption" style={{ color: "#969696", marginTop: '3px' }}>
                                        {moment(post.time_of_creation).fromNow()}
                                        </Typography>
                                    </div>
                                </div>
                                {feature1 && (<div><IconButton onClick={() => handleDeletePost(post.post_id)} style={{ color: "#969696", outline: "none"}}>
                                <DeleteIcon />
                                </IconButton>
                                </div>)}
                            </div>
                            
                            <Typography variant="body1" style={{ marginTop: '20px', color: "#585757", fontSize: "14px", fontFamily: "Roboto", marginLeft: "32px" }}>
                                {post.description}
                            </Typography>
                            {post.images && <img src={post.images} alt="Post" style={{marginTop: '15px',marginBottom: '15px' }} />}


                            <div style={{ marginTop: '20px' }}>
                                <IconButton onClick={() => handleLikeToggle(post.post_id)} style={post.likes.includes(user.id) > 0 ? { color: red[500] , marginLeft: "23px", outline: "none"} : {marginLeft: "23px", outline: "none"}}aria-label="like post">
                                <EmojiEventsIcon />
                                </IconButton>
                                <Typography variant="caption">{post.likes.length} Likes</Typography>
                            </div>
                            </CardContent>
                            <hr style={{ height: '30px', backgroundColor: '#F7F8FA', border: 'none', width: "" }} />
                        </Card>
                        ))}
                    </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box style={{ marginTop: '3rem', marginRight: '15px' }}>
                            <Paper elevation={0} style={{ height: 'fit-content', padding: '20px' }}>
                                <CardContent>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h5" align="left" style={{fontFamily: "Roboto", color: "#1C1C1C", fontSize: "20px", fontWeight: "500", letterSpacing: "-0.2px"}}>
                                        My Profile
                                    </Typography>
                                    {feature2 && (<SettingsIcon onClick={handleOpenProfilePictureDialog} style={{ cursor: 'pointer', color: "#969696" }} />)}
                                </div>
                                    <hr style={{ width: "100%" }} />
                                    <Avatar
                                        src={user.avatar || image}
                                        style={{ width: '128px', height: '128px', margin: 'auto', marginTop: "2rem" }}
                                    />
                                    <Typography variant="h5" align="center" style={{letterSpacing: "-0.2px", fontSize: "20px", marginTop: "10px"}}>
                                        {user.pseudo}
                                    </Typography>
                                    <Typography variant="h6" align="center" style={{letterSpacing: "-0.2px", fontSize: "13px", color: "#969696", marginTop: "3px"}}>
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                        <Typography variant="body2" align="center" style={{ cursor: "pointer", letterSpacing: "-0.2px", fontSize: "13px", color: "#969696", marginRight: '15px' }} onClick={handleOpenFollowersDialog}>
                                            Followers: {user.followers ? user.followers.length : 0}
                                        </Typography>
                                        <Typography variant="body2" align="center" style={{ cursor: "pointer", letterSpacing: "-0.2px", fontSize: "13px", color: "#969696" }} onClick={handleOpenFollowingDialog}>
                                            Following: {user.following ? user.following.length : 0}
                                        </Typography>
                                    </div>
                                </CardContent>
                                
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <Dialog open={showProfilePictureDialog} onClose={handleCloseProfilePictureDialog}>
                <DialogTitle>Change Profile Picture</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <label htmlFor="profile-picture-input">
                            <Avatar
                                src={user.avatar || image}
                                alt={user.pseudo}
                                style={{ width: '128px', height: '128px', marginBottom: '20px', cursor: 'pointer' }}
                            />
                            <input
                                id="profile-picture-input"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleProfilePictureChange}
                            />
                        </label>
                        {/* Other UI elements */}
                    </div>
                </DialogContent>
                    <DialogActions>
                    {/* Existing buttons */}
                    <Button onClick={handleCloseProfilePictureDialogCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveProfilePicture} color="primary">
                        Save
                    </Button>
                    {/* New button to remove the profile picture */}
                    <Button onClick={handleRemoveProfilePicture} color="secondary">
                        Remove Pic
                    </Button>
                </DialogActions>
            </Dialog>
 <Dialog open={followersDialogOpen || followingDialogOpen} onClose={handleCloseDialogs} fullWidth maxWidth="md">
    <DialogTitle style={{ marginBottom: "20px" }}>{followersDialogOpen ? "Followers" : "Following"}</DialogTitle>
    <DialogContent>
        {followersDialogOpen ? (
            followersList.map(user => (
                <div>
                <div key={user.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={user.avatar || image} alt={user.pseudo} style={{ width: '48px', height: '48px', marginRight: '10px' }} />
                    <Typography>{user.pseudo}</Typography>
                </div>
                <hr style={{ width: "100%", marginTop:"15px", marginBottom: "15px"}} />
                </div>
            ))
        ) : (
            followingList.map(user => (
                <div>
                <div key={user.id} style={{ display: 'flex', alignItems: 'center'}}>
                    <Avatar src={user.avatar || image} alt={user.pseudo} style={{ width: '48px', height: '48px', marginRight: '10px' }} />
                        <Typography>{user.pseudo}</Typography>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            style={{ marginLeft: "15px", backgroundColor: "white", color: "#549BFF", borderColor: "#549BFF", borderWidth: "1px", borderStyle: "solid", boxShadow: "none", outline: "none", fontSize: "13px", marginTop: "5px" }}
                            onClick={() => handleUnfollowUser(user.id)}
                        >
                            Unfollow
                        </Button>
                </div>
                <hr style={{ width: "100%", marginTop:"15px", marginBottom: "15px"}} />

                </div>
            ))
        )}
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseDialogs} color="primary">
            Close
        </Button>
    </DialogActions>
</Dialog>


        </div>
        </div>
    );
};

export default Profile;