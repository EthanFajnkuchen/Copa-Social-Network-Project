import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Backdrop, Fade, Avatar, Grid, Box } from '@mui/material';
import { styled } from '@mui/system';
import { UidContext } from '../../Log/AppContext';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';

const StyledModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

export default function AddStory() {
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const uid = useContext(UidContext);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setSelectedFile(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            try {
                const response = await axios.post('http://localhost:5000/api/story/addstories', {
                    user_id: uid,
                    image: selectedFile,
                });
                console.log('Story added:', response);
            } catch (error) {
                console.error('An error occurred while adding the story:', error);
            }
        }
        setSelectedFile(null);
        setOpen(false); // Close the modal
    };

    const handleClose = () => {
        setOpen(false);
    };

    const removeImage = () => {
        setSelectedFile(null);
    };

    return (
        <>
            <Avatar
                style={{ backgroundColor: '#549BFF', cursor: 'pointer', marginRight: "20px"}}
                onClick={handleOpen}
            >
                <AddIcon />
            </Avatar>
            <StyledModal
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={open}>
                    <Box style={{
                        backgroundColor: '#fff',
                        padding: '1rem',
                        width: '100%',
                        height: '100%',
                        overflow: 'auto'
                    }}>
                        <Button onClick={handleClose} style={{ float: 'right' }}>
                            <CloseIcon />
                        </Button>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                {selectedFile && (
                                    <Box sx={{ width: '200px', height: '200px', overflow: 'hidden' }}>
                                        <img src={selectedFile} alt="Preview" style={{ width: '100%', height: 'auto' }} />
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <label htmlFor="upload-button">
                                    <Button variant="contained" color="primary" component="span" startIcon={<AttachFileIcon />} fullWidth>
                                        Choose File
                                    </Button>
                                </label>
                                <input type="file" accept="image/*" onChange={handleFileChange} id="upload-button" style={{ display: 'none' }} />
                            </Grid>
                            <Grid item xs={4}>
                                {selectedFile && (
                                    <Button variant="contained" color="secondary" onClick={removeImage} startIcon={<DeleteIcon />} fullWidth>
                                        Remove
                                    </Button>
                                )}
                            </Grid>
                            <Grid item xs={4}>
                                <Button variant="contained" color="primary" onClick={handleUpload} disabled={!selectedFile} startIcon={<UploadIcon />} fullWidth>
                                    Upload
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Fade>
            </StyledModal>
        </>
    );


}