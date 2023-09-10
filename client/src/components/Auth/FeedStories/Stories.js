import React, { useState, useEffect, useContext } from 'react';
import {
    Avatar,
    List,
    Box,
    ListItem,
    ListItemAvatar,
    Modal,
    Backdrop,
    Typography,
    Grid,
    Fade,
} from '@mui/material';
import { styled } from '@mui/system';
import { UidContext } from '../../Log/AppContext';
import AddStory from "./AddStory";
import axios from 'axios';
import StoryAvatar from "./StoryAvatar";
import CloseIcon from "@mui/icons-material/Close";

const Root = styled('div')({
    display: 'flex',
    justifyContent: 'center',  // Centers horizontally
    alignItems: 'center',      // Centers vertically
    overflowX: 'auto',
    marginTop: "20px"
});

const ImageContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',  // Aligns items to the top
    alignItems: 'flex-start',  // Aligns items to the left
    overflow: 'hidden',
});

const StyledModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,  // Set a high z-index value
});

const Stories = () => {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [allStories, setAllStories] = useState([]);
    const [allFollowers, setAllFollowers] = useState([]);
    const uid = useContext(UidContext);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [storyInterval, setStoryInterval] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        const timerId = setInterval(() => {
            setTimeElapsed(prevTime => prevTime + 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        if (timeElapsed % 5 === 0 && timeElapsed !== 0) {
            const nextImageIndex = currentImageIndex + 1;
            if (nextImageIndex >= allStories[activeIndex]?.images.length) {
                const nextIndex = getNextActiveIndex(activeIndex, allStories);
                if (nextIndex === -1) {
                    handleClose();
                    return;
                }
                setActiveIndex(nextIndex);
                setCurrentImageIndex(0);
            } else {
                setCurrentImageIndex(nextImageIndex);
            }
        }
    }, [timeElapsed]);

    const getNextActiveIndex = (currentIndex, storyArray) => {
        if (currentIndex < storyArray.length - 1) {
            return currentIndex + 1;
        }
        return -1;  // Signal that there are no more stories to show
    };

    const handleOpen = (index) => {
        setActiveIndex(index);
        setCurrentImageIndex(0);
        setOpen(true);
        setTimeElapsed(0); // Resetting timeElapsed to 0 when a story opens
    };

    const handleClose = () => {
        setActiveIndex(0);
        setCurrentImageIndex(0);
        setOpen(false);
    };

    const startStoryInterval = () => {
        let interval = setInterval(() => {
            // Check if we are at the last image of the current story.
            if (currentImageIndex >= allStories[activeIndex]?.images.length - 1) {
                clearInterval(storyInterval);  // Clear the existing interval for the current story
                // Go to the next story if there is one
                const nextIndex = getNextActiveIndex(activeIndex, allStories);
                // Check if there are no more stories
                if (nextIndex === -1) {
                    handleClose();  // Close the modal if all stories are shown
                    return;
                }

                // Set up for the next story
                setActiveIndex(nextIndex);
                setCurrentImageIndex(0);
                startStoryInterval();  // Start the new interval
            } else {
                // If not at the end, simply go to the next image
                alert(currentImageIndex);
                setCurrentImageIndex(prevCurrentImageIndex => prevCurrentImageIndex + 1);
            }
        }, 20000);

        setStoryInterval(interval);
    };

    useEffect(() => {
        return () => {
            clearInterval(storyInterval); // Clear the interval when component unmounts
        };
    }, []);

    useEffect(() => {
        console.log("UID:", uid);
        axios.get(`http://localhost:5000/api/user/${uid}`)
            .then(response => {
                console.log("Server Response:", response.data);
                if (response.data && response.data.user && response.data.user.followers) {
                    setAllFollowers([uid, ...response.data.user.followers]);
                }else {
                    setAllFollowers([uid]);
                }
            })
            .catch(error => {
                console.error("An error occurred:", error);
            });
        console.log("All Followers:", allFollowers);
    }, [uid]);

    useEffect(() => {
        const fetchStories = async () => {
            try {

                let flattenedStories = [];

                for (const followerId of allFollowers) {
                    await deleteImagesForUser(followerId);
                    const response = await axios.get(`http://localhost:5000/api/story/getstories/${followerId}`);
                    if (response.data.stories && Array.isArray(response.data.stories)) {
                        flattenedStories = [...flattenedStories, ...response.data.stories];
                    }
                }
                setAllStories(flattenedStories);
                console.log("Updated Stories:", flattenedStories);  // For debugging
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };
        if (allFollowers.length > 0) {
            fetchStories();
        }
    }, [allFollowers]);
    // JavaScript function to delete all images for a specific user
    async function deleteImagesForUser(userId) {
        const url = `http://localhost:5000/api/story/deletestories/${userId}`;

        try {
            // Make the DELETE request
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // include any other headers your API requires, like Authorization
                },
            });

            // Check if the request was successful
            if (response.status !== 200) {
                const data = await response.json();
                console.error('Failed to delete images:', data);
                return;
            }

            // Parse and log the JSON response
            const data = await response.json();
            console.log('Successfully deleted images:', data);

        } catch (error) {
            // Log any errors
            console.error('An error occurred:', error);
        }
    }

    return (

        <Root>
            <AddStory/>
            <List sx={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
                {allStories.map((storyData, index) => (
                    <ListItem
                        onClick={() => { handleOpen(index); }}
                        key={index}
                    >
                    <StoryAvatar storyData={storyData} index={index} />

                    </ListItem>

                ))}
            </List>
            <StyledModal
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={open}>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                borderRadius: '30px',
                                padding: '30px'
                            }}
                        >
                            <ImageContainer>
                                <div style={{ flexShrink: 0, zIndex: 2, marginBottom: '20px' }}>
                                    <StoryAvatar storyData={allStories[activeIndex]} index={activeIndex} />
                                </div>
                                {allStories[activeIndex]?.images[currentImageIndex]?.image ? (
                                    <img src={allStories[activeIndex].images[currentImageIndex].image}
                                         alt={`Story ${activeIndex}`}
                                         style={{
                                            width: "600px",
                                            height: "400px"     
                                         }}
                                    />
                                ) : null}

                            </ImageContainer>
                        </Box>
                    </Grid>
                </Fade>
            </StyledModal>
        </Root>
    );


};

export default Stories;


