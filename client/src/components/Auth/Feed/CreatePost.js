import React, {useState} from 'react';
import axios from "axios";
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Createpost = () => {
    const [commentVisible, setCommentVisible] = useState(false);
    const [textAreaValue, setTextAreaValue] = useState('');
    const [images, setImages] = useState([]); // State to hold Base64 image strings

    // Function to remove image based on index
    const handleRemoveImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };
// Handle the click on 'fa-times' icon
    const handleClose = () => {
        setCommentVisible(false); // Hide the comment box
    };
    const clearForm = () => {
        setTextAreaValue('');
        setImages([]);
    };
// Handle changes in the textarea
    const handleTextAreaChange = (e) => {
        setTextAreaValue(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/post/createpost', {
                description: textAreaValue,  // directly pass the textAreaValue as the description
                username_id: 1223,
                images,  // Include the images array
            });

            if (response.data.message) {
                alert(response.data.message);
                clearForm();
                handleClose();
            }
        } catch (error) {
            alert('Failed to create post!');
        }
    };
    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const base64Images = await Promise.all(files.map(file => convertToBase64(file)));
        setImages([...images, ...base64Images]);
    };

// Function to convert image to Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    const handleFormSubmit = () => {
        console.log('New Post');
        setCommentVisible(true); // Show the comment box
    };

    return(
        <>
            <div className="form-body">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Microsoft_Account.svg/1200px-Microsoft_Account.svg.png" alt="" />
                <div className="form-submit" onClick={handleFormSubmit}>
                    <p>What's happening?</p>
                </div>
            </div>
            {/* Conditionally render the 'comment' div */}
            {commentVisible && (
                <div className="comment">
                    <head>
                        <link
                            rel="stylesheet"
                            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
                    </head>
                    <div className="comment-box">
                        <div className="comment-header">
                            <h3>Create Post</h3>
                            <i className="fas fa-times" onClick={handleClose}></i>
                        </div>
                        {/* Display uploaded images */}
                        <div>
                            {images.map((image, index) => (
                                <div key={index} style={{ display: 'inline-block', position: 'relative' }}>
                                    <img src={image} alt={`Uploaded ${index}`} width="100" />
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleRemoveImage(index)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="comment-body">
                                <textarea
                                    color="neutral"
                                    disabled={false}
                                    minRows={2}
                                    size="sm"
                                    variant="outlined"
                                    placeholder="Write anything for before submit to post bar"
                                    value={textAreaValue}
                                    onChange={handleTextAreaChange}
                                />
                        </div>
                        <div className="comment-bottom">
                            <div className="icon">
                                <label htmlFor="photo-video">
                                    <i className="fas fa-photo-video" />
                                    <input type="file" id="photo-video" onChange={handleImageChange} multiple />
                                </label>
                                <label htmlFor="up-music">
                                    <i className="fas fa-music" />
                                    <input type="file" id="up-music" />
                                </label>
                                <label htmlFor="up-docx">
                                    <i className="fas fa-file-upload" />
                                    <input type="file" name="" id="up-docx" />
                                </label>
                            </div>
                            <div
                                className="button-send"
                                style={{
                                    background: textAreaValue ? '#52FFEE' : '#e7e7e7',
                                    cursor: textAreaValue ? 'pointer' : 'none',
                                }}>
                                <p onClick={handleSubmit} >post</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default Createpost;