import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import {Box} from "@mui/material";

const FollowButton = ({ followerId, userId }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    const fetchIsFollowing = async () => {
        try {
            const users = await getUsers();
            const follower = users.find(user => user.id === followerId);
            const userToCheck = users.find(user => user.id === userId);

            if (!follower || !userToCheck) {
                return false;
            }

            return follower.following.includes(userId);
        } catch (error) {
            console.error('Failed to determine follow status', error);
        }
    }

    async function getUsers() {
        try {
            const response = await axios.get('http://localhost:5000/users');
            return response.data;
        } catch (error) {
            console.error('Failed to get users:', error);
            return [];
        }
    }

    useEffect(() => {
        const handleFollow = async () => {
            const followingStatus = await fetchIsFollowing();
            setIsFollowing(followingStatus);
        };

        handleFollow();
    }, [followerId, userId]);

    const handleFollowClick = async () => {
        let response;
        const apiUrl = `http://localhost:5000/api/${isFollowing ? 'unfollow' : 'follow'}/${followerId}/${userId}`;

        try {
            response = await axios.patch(apiUrl);
            if (response.status === 200) {
                setIsFollowing(!isFollowing);
            }
        } catch (error) {
            console.error("Error following/unfollowing", error);
        }
    };

    return (
        <Box display="flex" justifyContent="flex-end">
            <Button
                variant="outlined"
                color={isFollowing ? "default" : "primary"}
                onClick={handleFollowClick}
                style={{ float: "right" }}

            >
                {isFollowing ? "Following" : "Follow"}
            </Button>
        </Box>
    );

};

export default FollowButton;