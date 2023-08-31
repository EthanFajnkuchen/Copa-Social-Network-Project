// Singlecomment.js
import React, { useEffect, useState } from 'react';
import { Avatar, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Singlecomment = ({post, comment, cIndex }) => {
    const [likedComments, setLikedComments] = useState([]);
    const [username, setUsername] = useState('dldljf'); // Initialize the username

    const addremovelikecomment = async (post_id,comment_id,username_id) => {
        try {
            const response = await axios.patch('http://localhost:5000/api/post/handlelikecomment', {
                username_id: username_id,
                post_id: post_id,
                comment_id: comment_id,
            });
            if (response.data.message) {
                if (response.data.message === "like added") {
                    setLikedComments([...likedComments, comment_id]); // Add comment to liked comments
                } else {
                    setLikedComments(likedComments.filter(id => id !== comment_id)); // Remove comment from likedcomments
                }
            }
        } catch (error) {
            alert('Failed to update Comment like status!');
        }
    };

    const fetchLikedCommentsByUsername = async (username, post_id) => {
        try {
            // Fetch all comments for a specific post
            const response = await axios.get('http://localhost:5000/api/post/all-comments', {
                params: {
                    post_id: post_id
                }
            });
            // Assuming each comment object has a 'likes' field that is an array of usernames who have liked the comment
            const likedComments = response.data.posts.filter(comment => {
                return comment.likes.includes(username);
            }).map(comment => comment.comment_id);  // Replace 'comment_id' with the field name used in your data structure
            return likedComments;

        } catch (error) {
            console.error('Failed to fetch liked comments:', error);
            return [];
        }
    };

    useEffect(() => {
        fetchLikedCommentsByUsername(username, post.post_id).then(likedComments => {
            console.log("Liked Comments for Username and Post:", likedComments);
            setLikedComments(likedComments);
        });
    }, [username, post.post_id]);
    useEffect(() => {
        console.log("Current Liked Comments:", likedComments);
    }, [likedComments]);

    return (
        <div>
            <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>

                <div key={cIndex}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt="" src="https://bit.ly/3shJrDh"/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={comment.username_id}
                            secondary={
                                <Grid container direction="row" alignItems="flex-start">
                                    <Grid item xs={10}>
                                        <Typography
                                            sx={{display: 'block'}}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {comment.description}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {comment.likes.length} likes
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                      <span className="logo"
                                            onClick={() => addremovelikecomment(post.post_id, comment.comment_id, "dldljf")}>
                                          <FontAwesomeIcon
                                                icon={faHeart}
                                                style={{ color: likedComments.includes(comment.comment_id) ? 'red' : 'inherit' }}
                                            />
                                      </span>
                                    </Grid>
                                </Grid>
                            }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li"/>
                </div>
            </List>
        </div>
    );
};

export default Singlecomment;