import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Avatar } from '@mui/material';
import { UidContext } from '../components/Log/AppContext';


const MyFeed = () => {
  const [posts, setPosts] = useState([]);
  const uid = useContext(UidContext);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/postbyid/${uid}`)
      .then(response => {
        setPosts(response.data.userPosts);
      })
      .catch(error => {
        console.error('Error fetching posts: ', error);
      });
  }, [uid]);

  return (
    <div>
      {posts.map((post) => (
        <Card key={post.post_id} style={{ marginBottom: '20px' }}>
          <CardContent>
            <Avatar src={post.profilePicture} />
            <Typography variant="h6">{post.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {post.time_of_creation}
            </Typography>
            <Typography variant="body1">{post.description}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyFeed;
