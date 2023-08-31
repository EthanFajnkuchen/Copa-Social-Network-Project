import React, {useEffect, useState} from 'react';
import Singlepost from "./SinglePost";
import axios from "axios";

const Posts = () => {

    const [allPostsWithTime, setAllPostsWithTime] = useState([]);
    const [username, setUsername] = useState('dldljf');
    const [likedPosts, setLikedPosts] = useState([]);
    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/post/all-posts');
            return response.data.posts;
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            return [];
        }
    };
    const fetchLikedPostsByUsername = async (username) => {
        try {
            const response = await axios.get('http://localhost:5000/api/post/all-posts');
            return response.data.posts.filter(post => {
                return post.likes.includes(username);
            }).map(post => post.post_id);
        } catch (error) {
            console.error('Failed to fetch liked posts:', error);
            return [];
        }
    };

    useEffect(() => {

        const getSecondsSincePostCreation = (timeOfCreation) => {
            const currentTime = new Date().getTime();
            const postTime = new Date(timeOfCreation).getTime();
            return Math.floor((currentTime - postTime) / 1000);
        };

        fetchPosts().then(fetchedPosts => {
            const postsWithTime = fetchedPosts.map(post => ({
                ...post,
                timeSincePostCreation: getSecondsSincePostCreation(post.time_of_creation),
            }));
            setAllPostsWithTime(postsWithTime);
        });

        fetchLikedPostsByUsername(username).then(likedPosts => {
            setLikedPosts(likedPosts);
        });

    }, [username,likedPosts]);

    return (
        <div>
            <header className="width">
                <img src="https://bit.ly/3F2c2UM" className="img-avtar" alt="" />
                <img src="https://bit.ly/3MUuvo1" className="img-avtar img-circled" alt="" />
            </header>

            {allPostsWithTime.map((post, index) => (
                <Singlepost post={post} index={index}/>
            ))}
        </div>
    );
};

export default Posts;