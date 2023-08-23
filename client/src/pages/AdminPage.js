import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UidContext } from '../components/Log/AppContext';
import '../styles/admin.css'

function AdminPage() {
  const [users, setUsers] = useState([]);

  const uid = useContext(UidContext);

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleDeleteUser = (userId) => {
    axios.delete(`http://localhost:5000/api/delete/${userId}`)
      .then(response => {
        if (response.data === 'User deleted successfully.') {
          setUsers(users.filter(user => user.id !== userId));
        }
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };


  return (
    uid === "6acba3b3-b13c-49b7-b7b1-ac7174267c80" ? (
      <div className='admin-page-component'>
        <div>
          <h1>Welcome on the admin page!</h1>
          <table className='styled-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Pseudo</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.pseudo}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : (
      <h1>Only admin have access to this page.</h1>
    )
  );
}

export default AdminPage;
