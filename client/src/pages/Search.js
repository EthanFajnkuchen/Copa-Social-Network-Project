import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios'; 
import image from "../images/profil-pic-default.png";
import NavbarAfter from '../components/Auth/NavbarAfter';
import { useNavigate } from 'react-router-dom';
import { UidContext } from '../components/Log/AppContext';
import background from "../images/backgroundSearch.jpg"

import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';


const searchContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '20px', // Maintain the marginBottom for space between search bar and results
};


const userItemStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px', // Decrease the marginBottom value to reduce the gap
  marginTop: "10px",
};


const userAvatarStyle = {
  marginRight: '8px',
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const uid = useContext(UidContext);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/search-user/${searchQuery}`);
      setSearchResults(response.data.users);
    } catch (error) {
      console.error('Error searching for users:', error);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const visitProfile = (userId) => {
    if (userId === uid) {
      navigate('/profile');
    } else {
      navigate(`/profile/${userId}`);
    }
  };


  if (uid === "6acba3b3-b13c-49b7-b7b1-ac7174267c80") {
    navigate('/admin');
    return null;
  }

  return (
    <div
      style={{
        background: `url(${background})`,
        backgroundSize: 'cover', // Adjust to 'contain' if needed
        backgroundRepeat: 'repeat', // Change to 'no-repeat' if needed
        backgroundPosition: 'center center', // Adjust as needed
      }}
    >      <NavbarAfter />
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginTop: "10rem",
          height: '100vh',
        }}
      >
        <div style={searchContainerStyle}>
          <TextField
            style={{ marginRight: '8px' }}
            label="Search Users"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <List>
          {searchResults.map((user, index) => (
            user.id !== "6acba3b3-b13c-49b7-b7b1-ac7174267c80" && (
              <div key={user.id}>
                {index !== 0 && <Divider />}
                <ListItem style={userItemStyle}>
                  <Avatar
                    style={userAvatarStyle}
                    alt={user.pseudo}
                    src={user.avatar || image}
                  />
                  <ListItemText primary={user.pseudo}/>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ marginLeft: "50px", backgroundColor: 'white', outline: "none" }}
                    onClick={() => {
                      visitProfile(user.id);
                    }}
                  >
                    Visit Profile
                  </Button>
                </ListItem>
              </div>
            )
          ))}
        </List>
      </Container>
    </div>
  );
};

export default Search;
