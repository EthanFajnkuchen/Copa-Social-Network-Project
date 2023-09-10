import {Avatar, ListItemAvatar, Typography , Box,Grid} from "@mui/material";
import { useEffect, useState } from "react";
import { styled } from "@mui/system";
import axios from "axios";

const ImageContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '200px',
    height: '200px',
    overflow: 'hidden',
});

  

const StoryAvatar = ({ storyData, index }) => {
    const [user_data, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/${storyData.user_id}`);
                console.log("Server Response:", response.data);
                if (response.data) {
                    setUserData(response.data.user);
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        if (storyData && storyData.user_id) {
            fetchUserData();
        }
    }, [storyData?.user_id]);

    // To check the updated user_data
    useEffect(() => {
        if (user_data) {
        }
    }, [user_data]);

    return (
        <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ListItemAvatar>
                <Typography variant="caption">
                    {storyData?.images?.[0]?.image ? (
                        <Avatar style={{width: "70px", height: "70px", borderWidth: "4px", borderStyle: "solid", borderColor: "#549BFF"}} alt={`Story ${index}`} src={user_data?.avatar || ''} />
                    ) : (
                        <Avatar alt={`Story ${index}`} />
                    )}
                       {user_data?.pseudo || ''}
                </Typography>
            </ListItemAvatar>
        </Grid>

    );
};

export default StoryAvatar;