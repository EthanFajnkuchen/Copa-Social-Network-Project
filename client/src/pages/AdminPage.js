// src/components/AdminPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Switch,
  Typography,
} from '@mui/material';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [adminFeatures, setAdminFeatures] = useState({ feature1: false, feature2: true });

  useEffect(() => {
    // Fetch the list of users from the server
    axios.get('http://localhost:5000/users').then((response) => {
      setUsers(response.data.users);
    });

    // Fetch admin features from the server
    axios.get('/api/user/admin/getfeatures').then((response) => {
      setAdminFeatures(response.data);
    });
  }, []);

  const handleFeatureChange = (featureName) => (event) => {
    // Send a request to the server to enable/disable the feature
    axios.patch('http://localhost:5000/api/user/admin/changefeatures', { [featureName]: event.target.checked }).then(() => {
      setAdminFeatures((prevFeatures) => ({
        ...prevFeatures,
        [featureName]: event.target.checked,
      }));
    });
  };

  return (
    <div>
      <Typography variant="h4">Admin Page</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Pseudo</TableCell>
              <TableCell>Feature 1</TableCell>
              <TableCell>Feature 2</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.pseudo}</TableCell>
                <TableCell>
                  <Switch
                    checked={adminFeatures.feature1}
                    onChange={handleFeatureChange('feature1')}
                    disabled={!adminFeatures.feature2}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={adminFeatures.feature2}
                    onChange={handleFeatureChange('feature2')}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminPage;
