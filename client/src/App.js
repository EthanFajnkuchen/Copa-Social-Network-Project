import React, { useEffect, useState } from 'react';
import Routes from "./components/Routes";
import { UidContext } from './components/Log/AppContext';
import axios from 'axios';

const App = () => {

  const [uid, setUid] = useState(null);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get('http://localhost:5000/jwtid', { withCredentials: true });
        setUid(response.data);
        console.log(response);
      } catch (error) {
        console.log('No token');
      }
    };

    fetchToken();
  }, [uid]);

  return (
    <UidContext.Provider value={uid}>
    <div>
      <Routes />
    </div>
    </UidContext.Provider>
  );
};

export default App;
