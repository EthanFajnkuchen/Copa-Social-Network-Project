// src/components/UserList.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Button, Table, TableHead, TableBody, TableCell, TableRow, Avatar } from '@mui/material';
import { UidContext } from '../components/Log/AppContext';
import "../styles/admin.css"
import NavbarAdmin from "../components/Auth/NavbarAdmin";
import image from "../images/profil-pic-default.png";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [usersW, setUsersW] = useState([]);
  const uid = useContext(UidContext);



  useEffect(() => {
    // Fetch user data from the server
    axios.get('http://localhost:5000/users').then((response) => {
      // Filter out the admin user
      const filteredUsers = response.data.filter((user) => user.pseudo !== 'admin');
      setUsers(filteredUsers);
      setUsersW(response.data);

    });
  }, []);

  const toggleFeature = (userId, featureName) => {
    // Define the URL for the toggle feature endpoint on your server
    const toggleFeatureUrl = `http://localhost:5000/api/users/${userId}/toggle-feature/${featureName}`;
  
    // Define custom headers
    const customHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      // Add any other headers you need here
    };
  
    // Send a PUT request to toggle the feature with custom headers
    axios
      .put(toggleFeatureUrl, null, { headers: customHeaders })
      .then((response) => {
        // Handle a successful toggle, you can update the user data in the state
        // or show a success message to the user
        console.log(`Feature ${featureName} toggled successfully`);
        console.log(response)
        setUsersW((prevUsers) => {
          return prevUsers.map((user) => {
            if (user.id === userId) {
              return { ...user, [featureName]: !user[featureName] };
            }
            return user;
          });
        });
      })
      .catch((error) => {
        // Handle errors, e.g., display an error message to the user
        console.error(`Error toggling feature ${featureName}:`, error);
      });
  };

  const togglePage = (userId, pageName) => {
    // Define the URL for the toggle page endpoint on your server
    const togglePageUrl = `http://localhost:5000/api/users/${userId}/toggle-page/${pageName}`;

    // Define custom headers
    const customHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      // Add any other headers you need here
    };

    // Send a PUT request to toggle the page with custom headers
    axios
      .put(togglePageUrl, null, { headers: customHeaders })
      .then((response) => {
        console.log(`Page ${pageName} toggled successfully`);
        setUsersW((prevUsers) => {
          return prevUsers.map((user) => {
            if (user.id === userId) {
              return { ...user, [pageName]: !user[pageName] };
            }
            return user;
          });
        });
      })
      .catch((error) => {
        console.error(`Error toggling page ${pageName}:`, error);
      });
  };
  
  

  const handleDeleteUser = (userId) => {
    axios.delete(`http://localhost:5000/api/delete/${userId}`).then((response) => {
      if (response.status === 200) {
        setUsers(users.filter((user) => user.id !== userId));
      }
    }).catch((error) => {
      console.error('Error deleting user:', error);
    });
  };


  return (
    <div>
    <NavbarAdmin />
    <div className="admin-page-component">
      <h1>Welcome on the Admin Page!</h1>
      <div className="table-container">
        <Table className="styled-table">
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Pseudo</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Last Logout</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar alt={user.pseudo} src={user.avatar || image} />
                </TableCell>
                <TableCell>{user.pseudo}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}</TableCell>
                <TableCell>{user.last_logout ? new Date(user.last_logout).toLocaleString() : 'N/A'}</TableCell>
                <TableCell>
                  <Button className="styled-button" onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Feature Toggle Buttons */}
      <div className="feature-buttons">
        <Button
          style = {{width: "250px", outline: "none", marginRight:"10px"}}
          variant="contained"
          onClick={() => toggleFeature(uid, 'feature1')}
          className="styled-button"
        >
          {usersW.find((user) => user.id === uid)?.feature1
            ? 'Disable Delete Post'
            : 'Enable Delete Post'}
        </Button>
        <Button
          style = {{width: "250px", outline: "none", marginLeft:"10px", marginRight: "10px"}}
          variant="contained"
          onClick={() => toggleFeature(uid, 'feature2')}
          className="styled-button"
        >
          {usersW.find((user) => user.id === uid)?.feature2
            ? 'Disable Change Avatar'
            : 'Enable Change Avatar'}
        </Button>
      </div>
      <div className="page-buttons">
        <Button
          style = {{width: "250px", outline: "none", marginRight:"10px", marginLeft: "10px"}}
          variant="contained"
          onClick={() => togglePage(uid, 'page1')}
          className="styled-button"
        >
          {usersW.find((user) => user.id === uid)?.page1
            ? 'Disable Page 1'
            : 'Enable Page 1'}
        </Button>
        <Button
          style = {{width: "250px", outline: "none", marginLeft:"10px"}}
          variant="contained"
          onClick={() => togglePage(uid, 'page2')}
          className="styled-button"
        >
          {usersW.find((user) => user.id === uid)?.page2
            ? 'Disable Page 2'
            : 'Enable Page 2'}
        </Button>
      </div>
    </div>
    </div>
  );
};



export default UserList;
